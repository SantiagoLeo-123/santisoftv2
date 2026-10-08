import { cronogramaData } from '@/data/cronograma';
import { curriculum } from '@/data/curriculum';
import { readState, writeState } from '@/lib/profileStore';

export const MENTOR_STORAGE_KEY = 'santisoft_mentor_revisoes';

export type CicloRevisao = 'R1' | 'R2' | 'R3' | 'R4';

// Sequência de revisões: dias após a conclusão da aula
export const CICLOS_ORDEM: CicloRevisao[] = ['R1', 'R2', 'R3', 'R4'];
export const DIAS_CICLO: Record<CicloRevisao, number> = { R1: 7, R2: 15, R3: 30, R4: 60 };
// Regra adaptativa pelo percentual de acerto no simulado de revisão
export const LIMITE_AVANCA = 80; // >= 80%: avança para o próximo intervalo
export const LIMITE_REPETE = 60; // 60 a 79%: repete o mesmo intervalo; < 60%: volta para 7 dias

export type ResultadoRevisao = 'avancou' | 'repetiu' | 'reiniciou' | 'finalizou';

export interface CicloInfo {
  ciclo: CicloRevisao;
  diasAposConclusao: number; // 7, 15, 30, 60
  dataPrevista: string; // YYYY-MM-DD
  concluido: boolean;
  dataConclusao?: string;
  pontuacaoSimulado?: { acertos: number; total: number };
}

export interface TemaRevisao {
  id: string; // e.g. lessonId or slugified tema
  tema: string; // ex: "CARDIOLOGIA PEDIATRICA", "ITU PEDIATRICO", etc.
  especialidade: string; // "Pediatria", "Clínica Médica", "Cirurgia", "Ginecologia e Obstetrícia", "Preventiva"
  dataConclusaoAula: string; // YYYY-MM-DD
  ciclos: {
    R1: CicloInfo;
    R2: CicloInfo;
    R3: CicloInfo;
    R4: CicloInfo;
  };
  cicloAtual: CicloRevisao | 'FINALIZADO';
  ultimoResultado?: ResultadoRevisao;
  ultimoPercentual?: number;
}

export interface RevisaoPendente {
  temaId: string;
  tema: string;
  especialidade: string;
  ciclo: CicloRevisao;
  diasCiclo: number;
  dataPrevista: string;
  diasAtraso: number; // 0 = hoje, >0 = atrasada
}

export type MentorStore = Record<string, TemaRevisao>;

// Helpers de formatação de data YYYY-MM-DD local
export function toDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function parseDateStr(str: string): Date {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function normalizeStr(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

const TEMA_CANONICAL_MAP: Record<string, string> = {
  'cardiologia pediatrica': 'CARDIOLOGIA PEDIATRICA',
  'itu pediatrico': 'ITU PEDIATRICO',
  'infeccao do trato urinario': 'ITU PEDIATRICO',
  'infeccao urinaria': 'ITU PEDIATRICO',
  'nefrologia pediatrica': 'ITU PEDIATRICO',
  'crescimento e seus disturbios': 'CRESCIMENTO E SEUS DISTURBIOS',
  'disturbios do crescimento': 'CRESCIMENTO E SEUS DISTURBIOS',
  'disturbios do crescimento desnutricao e baixa estatura': 'CRESCIMENTO E SEUS DISTURBIOS',
  'crescimento e desenvolvimento normais puberdade normal': 'CRESCIMENTO E SEUS DISTURBIOS',
  'crescimento': 'CRESCIMENTO E SEUS DISTURBIOS',
  'doencas exantematicas': 'DOENÇAS EXANTEMATICAS',
  'imunizacoes': 'IMUNIZAÇÕES',
};

// Mapeia áreas curtas do cronograma para nomes completos aceitos no filtro
export function normalizarEspecialidade(area: string): string {
  const map: Record<string, string> = {
    'Clínica': 'Clínica Médica',
    'Clínica Médica': 'Clínica Médica',
    'GO': 'Ginecologia e Obstetrícia',
    'Ginecologia e Obstetrícia': 'Ginecologia e Obstetrícia',
    'Cirurgia': 'Cirurgia',
    'Pediatria': 'Pediatria',
    'Preventiva': 'Preventiva',
  };
  return map[area] || area || 'Pediatria';
}

// Localiza o tema e especialidade a partir do ID da aula
// Acha a aula do cronograma correspondente a uma aula do menu lateral (mesmo vídeo do Drive)
function cronogramaPorLicao(lessonId: string) {
  for (const area of curriculum) {
    for (const mod of area.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === lessonId) {
          const driveId = (lesson as { driveId?: string }).driveId;
          return driveId ? cronogramaData.find((c) => c.driveId === driveId) : undefined;
        }
      }
    }
  }
  return undefined;
}

export function resolverTemaEEspecialidade(lessonOrEntryId: string): {
  id: string;
  tema: string;
  especialidade: string;
} {
  // 1. Tenta achar no cronogramaData (aulas do Intensivo usam o prefixo 'int-')
  const baseId = lessonOrEntryId.startsWith('int-') ? lessonOrEntryId.slice(4) : lessonOrEntryId;
  const cron = cronogramaData.find((c) => c.id === baseId) || cronogramaPorLicao(baseId);
  if (cron) {
    // A revisão usa exatamente o tema da aula no cronograma
    const rawTema = cron.aula || cron.titulo || 'Tema Geral';
    return {
      id: cron.id,
      tema: rawTema,
      especialidade: normalizarEspecialidade(cron.area),
    };
  }

  // 2. Tenta achar no curriculum
  for (const area of curriculum) {
    for (const mod of area.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.id === lessonOrEntryId) {
          const rawTema = lesson.title || mod.name;
          const canonical = TEMA_CANONICAL_MAP[normalizeStr(rawTema)] || rawTema;
          return {
            id: lesson.id,
            tema: canonical,
            especialidade: normalizarEspecialidade(area.name),
          };
        }
      }
    }
  }

  // Fallback
  return {
    id: lessonOrEntryId,
    tema: 'CARDIOLOGIA PEDIATRICA',
    especialidade: 'Pediatria',
  };
}

// Recupera a loja do LocalStorage garantindo ausência de dados fictícios/teste
export function getMentorStore(): MentorStore {
  if (typeof window === 'undefined') return {};
  try {
    const store = { ...readState<MentorStore>('mentor_revisoes', {}) };
    let modified = false;

    // Purga quaisquer dados de teste/mock pré-cadastrados ou antigos
    for (const key of Object.keys(store)) {
      const item = store[key];
      const isTestKey =
        key.startsWith('revisao-teste') ||
        key.toLowerCase().includes('teste') ||
        key.toLowerCase().includes('test') ||
        key.toLowerCase().includes('mock');
      const isTestItem =
        !item ||
        !item.id ||
        item.id.startsWith('revisao-teste') ||
        item.id.toLowerCase().includes('teste') ||
        item.id.toLowerCase().includes('test') ||
        item.id.toLowerCase().includes('mock');

      if (isTestKey || isTestItem) {
        delete store[key];
        modified = true;
      }
    }

    // Alinha as revisões ao tema do cronograma (inclusive as criadas pelo menu lateral)
    for (const key of Object.keys(store)) {
      const item = store[key];
      if (!item || !item.id) continue;
      const baseId = item.id.startsWith('int-') ? item.id.slice(4) : item.id;
      const conhecido = cronogramaData.some((c) => c.id === baseId) || !!cronogramaPorLicao(baseId);
      if (!conhecido) continue;
      const r = resolverTemaEEspecialidade(item.id);
      if (r.id === key && r.tema === item.tema) continue;
      if (r.id !== key && store[r.id]) continue;
      store[r.id] = { ...item, id: r.id, tema: r.tema, especialidade: r.especialidade };
      if (r.id !== key) delete store[key];
      modified = true;
    }

    // Migra temas gravados no formato antigo (R1 7d, R2 30d, R3 60d) para 7, 15, 30 e 60 dias
    for (const key of Object.keys(store)) {
      const item = store[key] as TemaRevisao;
      if (!item || !item.ciclos || item.ciclos.R4) continue;
      const antigo = item.ciclos as unknown as { R1: CicloInfo; R2: CicloInfo; R3: CicloInfo };
      const base = parseDateStr(item.dataConclusaoAula || toDateStr(new Date()));
      const r1Feito = !!antigo.R1?.concluido;
      const novoR2: CicloInfo = {
        ciclo: 'R2',
        diasAposConclusao: 15,
        dataPrevista: toDateStr(addDays(base, 15)),
        // quem já tinha passado da revisão de 30 dias não precisa voltar para a de 15
        concluido: !!antigo.R2?.concluido,
        dataConclusao: antigo.R2?.concluido ? antigo.R2.dataConclusao : undefined,
      };
      const novoR3: CicloInfo = { ...antigo.R2, ciclo: 'R3', diasAposConclusao: 30 };
      const novoR4: CicloInfo = { ...antigo.R3, ciclo: 'R4', diasAposConclusao: 60 };
      item.ciclos = { R1: antigo.R1, R2: novoR2, R3: novoR3, R4: novoR4 };
      const atualAntigo = item.cicloAtual as string;
      if (atualAntigo === 'R2') item.cicloAtual = r1Feito ? 'R2' : 'R1';
      else if (atualAntigo === 'R3') item.cicloAtual = 'R4';
      modified = true;
    }

    if (modified) {
      writeState('mentor_revisoes', store);
    }

    return store;
  } catch (err) {
    console.error('Erro ao ler mentorStore do LocalStorage:', err);
    return {};
  }
}

// Limpa explicitamente a chave do localStorage se contiver dados de teste antigos
export function limparDadosTesteMentor(): void {
  // getMentorStore já remove e regrava a loja quando encontra dados de teste
  getMentorStore();
}

// Salva a loja no LocalStorage e dispara evento reativo
export function saveMentorStore(store: MentorStore): void {
  if (typeof window === 'undefined') return;
  try {
    // Grava no perfil ativo, envia para a nuvem e dispara 'santisoft_mentor_updated'
    writeState('mentor_revisoes', store);
  } catch (err) {
    console.error('Erro ao salvar mentorStore no LocalStorage:', err);
  }
}

/**
 * 1. Registra a conclusão de uma aula e agenda automaticamente R1 (7d), R2 (15d), R3 (30d) e R4 (60d)
 */
export function registrarConclusaoAula(
  lessonId: string,
  temaForced?: string,
  especialidadeForced?: string,
): TemaRevisao {
  const store = getMentorStore();
  const info = resolverTemaEEspecialidade(lessonId);
  const tema = temaForced || info.tema;
  const especialidade = especialidadeForced || info.especialidade;

  const now = new Date();
  const todayStr = toDateStr(now);

  const novoCiclo = (ciclo: CicloRevisao): CicloInfo => ({
    ciclo,
    diasAposConclusao: DIAS_CICLO[ciclo],
    dataPrevista: toDateStr(addDays(now, DIAS_CICLO[ciclo])),
    concluido: false,
  });

  const novoTema: TemaRevisao = {
    id: lessonId,
    tema,
    especialidade,
    dataConclusaoAula: todayStr,
    ciclos: {
      R1: novoCiclo('R1'),
      R2: novoCiclo('R2'),
      R3: novoCiclo('R3'),
      R4: novoCiclo('R4'),
    },
    cicloAtual: 'R1',
  };

  store[lessonId] = novoTema;
  saveMentorStore(store);
  return novoTema;
}

/**
 * Remove agendamento se usuário desmarcar aula (opcional)
 */
export function removerConclusaoAula(lessonId: string): void {
  const store = getMentorStore();
  if (store[lessonId]) {
    delete store[lessonId];
    saveMentorStore(store);
  }
}

/**
 * 2. Retorna revisões pendentes com data prevista menor ou igual à data de hoje
 */
export function getRevisoesDeHoje(): RevisaoPendente[] {
  const store = getMentorStore();
  const todayStr = toDateStr(new Date());
  const todayDate = parseDateStr(todayStr);

  const pendentes: RevisaoPendente[] = [];

  for (const item of Object.values(store)) {
    if (item.cicloAtual === 'FINALIZADO') continue;

    const cicloAtivo = item.ciclos[item.cicloAtual];
    if (!cicloAtivo || cicloAtivo.concluido) continue;

    // Se data prevista <= hoje, está pronta para revisão!
    if (cicloAtivo.dataPrevista <= todayStr) {
      const prevDate = parseDateStr(cicloAtivo.dataPrevista);
      const diffMs = todayDate.getTime() - prevDate.getTime();
      const diasAtraso = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      pendentes.push({
        temaId: item.id,
        tema: item.tema,
        especialidade: item.especialidade,
        ciclo: cicloAtivo.ciclo,
        diasCiclo: cicloAtivo.diasAposConclusao,
        dataPrevista: cicloAtivo.dataPrevista,
        diasAtraso,
      });
    }
  }

  // Ordena pelas mais antigas / atrasadas primeiro
  return pendentes.sort((a, b) => a.dataPrevista.localeCompare(b.dataPrevista));
}

/**
 * Retorna próximas revisões agendadas no futuro (dataPrevista > hoje)
 */
export function getProximasRevisoes(): {
  temaId: string;
  tema: string;
  especialidade: string;
  ciclo: CicloRevisao;
  dataPrevista: string;
  diasFaltando: number;
}[] {
  const store = getMentorStore();
  const todayStr = toDateStr(new Date());
  const todayDate = parseDateStr(todayStr);

  const futuras: {
    temaId: string;
    tema: string;
    especialidade: string;
    ciclo: CicloRevisao;
    dataPrevista: string;
    diasFaltando: number;
  }[] = [];

  for (const item of Object.values(store)) {
    if (item.cicloAtual === 'FINALIZADO') continue;

    const cicloAtivo = item.ciclos[item.cicloAtual];
    if (!cicloAtivo || cicloAtivo.concluido) continue;

    if (cicloAtivo.dataPrevista > todayStr) {
      const prevDate = parseDateStr(cicloAtivo.dataPrevista);
      const diffMs = prevDate.getTime() - todayDate.getTime();
      const diasFaltando = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      futuras.push({
        temaId: item.id,
        tema: item.tema,
        especialidade: item.especialidade,
        ciclo: cicloAtivo.ciclo,
        dataPrevista: cicloAtivo.dataPrevista,
        diasFaltando,
      });
    }
  }

  return futuras.sort((a, b) => a.dataPrevista.localeCompare(b.dataPrevista));
}

/**
 * 3. Ao finalizar a resolução do simulado de revisão:
 * Marca o ciclo atual como concluído e agenda/avança para o próximo ciclo
 */
export function concluirCicloRevisao(
  temaId: string,
  cicloConcluido: CicloRevisao,
  pontuacao?: { acertos: number; total: number },
): TemaRevisao | null {
  const store = getMentorStore();
  let item = store[temaId];

  // Se não encontrar pela chave direta, busca por ID interno ou tema
  if (!item) {
    const targetNorm = normalizeStr(temaId);
    for (const entry of Object.values(store)) {
      if (
        entry.id === temaId ||
        normalizeStr(entry.tema) === targetNorm ||
        normalizeStr(entry.id) === targetNorm
      ) {
        item = entry;
        break;
      }
    }
  }

  if (!item) return null;

  const now = new Date();
  const todayStr = toDateStr(now);

  const percentual =
    pontuacao && pontuacao.total > 0 ? Math.round((pontuacao.acertos / pontuacao.total) * 100) : 100;
  const atual = item.ciclos[cicloConcluido];
  const idx = CICLOS_ORDEM.indexOf(cicloConcluido);
  // intervalo deste ciclo = dias desde a revisão anterior (7, 8, 15 e 30)
  const intervalo = idx > 0 ? DIAS_CICLO[cicloConcluido] - DIAS_CICLO[CICLOS_ORDEM[idx - 1]] : DIAS_CICLO.R1;

  if (atual && pontuacao) atual.pontuacaoSimulado = pontuacao;
  item.ultimoPercentual = percentual;

  if (percentual < LIMITE_REPETE) {
    // Abaixo de 60%: recomeça a sequência a partir da revisão de 7 dias
    for (const c of CICLOS_ORDEM) {
      const info = item.ciclos[c];
      if (!info) continue;
      info.concluido = false;
      info.dataConclusao = undefined;
      info.dataPrevista = toDateStr(addDays(now, DIAS_CICLO[c]));
    }
    item.cicloAtual = 'R1';
    item.ultimoResultado = 'reiniciou';
  } else if (percentual < LIMITE_AVANCA) {
    // Entre 60 e 79%: repete o mesmo intervalo antes de avançar
    if (atual) {
      atual.concluido = false;
      atual.dataPrevista = toDateStr(addDays(now, intervalo));
    }
    item.cicloAtual = cicloConcluido;
    item.ultimoResultado = 'repetiu';
  } else {
    // 80% ou mais: conclui o ciclo e avança
    if (atual) {
      atual.concluido = true;
      atual.dataConclusao = todayStr;
    }
    const proximo = CICLOS_ORDEM[idx + 1];
    if (proximo && item.ciclos[proximo]) {
      item.cicloAtual = proximo;
      // Garante que a próxima revisão fique no futuro
      if (item.ciclos[proximo].dataPrevista <= todayStr) {
        item.ciclos[proximo].dataPrevista = toDateStr(
          addDays(now, DIAS_CICLO[proximo] - DIAS_CICLO[cicloConcluido]),
        );
      }
      item.ultimoResultado = 'avancou';
    } else {
      item.cicloAtual = 'FINALIZADO';
      item.ultimoResultado = 'finalizou';
    }
  }

  saveMentorStore(store);
  return item;
}
