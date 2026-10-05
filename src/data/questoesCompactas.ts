import type { Question } from '@/types';

type Letra = 'A' | 'B' | 'C' | 'D';
const LETRAS: Letra[] = ['A', 'B', 'C', 'D'];

/**
 * Formato enxuto para escrever questões autorais:
 * s = subtema, e = enunciado, o = alternativas (A a D), g = gabarito,
 * c = comentário geral, x = por que cada alternativa errada está errada.
 */
export interface QuestaoCompacta {
  s: string;
  e: string;
  o: [string, string, string, string];
  g: Letra;
  c: string;
  x: Partial<Record<Letra, string>>;
}

// Sequência fixa que espalha o gabarito entre A, B, C e D (25% cada a cada 16 questões)
const POSICOES = [2, 0, 3, 1, 1, 3, 0, 2, 3, 2, 1, 0, 0, 1, 2, 3];

export function montarQuestoes(
  prefixo: string,
  specialty: Question['specialty'],
  topic: string,
  lista: QuestaoCompacta[],
): Question[] {
  return lista.map((q, i) => {
    // Troca a alternativa correta de lugar com a da posição sorteada
    const origem = LETRAS.indexOf(q.g);
    const destino = POSICOES[i % POSICOES.length];
    const itens = LETRAS.map((letra, k) => ({
      texto: q.o[k],
      correta: letra === q.g,
      motivo: q.x[letra] ?? '',
    }));
    [itens[origem], itens[destino]] = [itens[destino], itens[origem]];

    return {
      id: `${prefixo}-${String(i + 1).padStart(3, '0')}`,
      specialty,
      topic,
      subtopic: q.s,
      institution: 'Autoral (estilo residência)',
      year: 2026,
      statement: q.e,
      options: itens.map((it, k) => ({ letter: LETRAS[k], text: it.texto })),
      correctOption: LETRAS[destino],
      generalComment: q.c,
      optionsExplanations: itens.map((it, k) => ({
        letter: LETRAS[k],
        text: it.texto,
        isCorrect: it.correta,
        explanation: it.correta ? `Correta. ${q.c}` : `Incorreta. ${it.motivo}`.trim(),
      })),
      isRevisao: false,
    };
  });
}
