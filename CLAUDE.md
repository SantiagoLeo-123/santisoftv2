# SantiSOFT

App de estudo para residência médica (React + Vite + TypeScript + Tailwind). O deploy é automático na Vercel a partir da branch `main`: tudo que entra na `main` vai para produção.

## Comandos

- `npm run dev`: servidor local (porta 3000)
- `npm run build`: build de produção (`vite build`); rode antes de commitar
- `npm run typecheck`: `tsc --noEmit -p tsconfig.app.json`
- `npm run lint`

Alias de import: `@/foo` = `src/foo`.

## Questões

### Formato compacto

As questões autorais ficam em `src/data/clinica/*.ts`, cada arquivo exportando um `QuestaoCompacta[]`:

```ts
{ s, e, o, g, c, x }
// s = subtema, e = enunciado, o = alternativas [A, B, C, D],
// g = gabarito ('A' | 'B' | 'C' | 'D'), c = comentário geral,
// x = por que cada alternativa errada está errada ({ A?: string, ... })
```

O tipo e a função `montarQuestoes` estão em `src/data/questoesCompactas.ts`. `montarQuestoes(prefixo, especialidade, tema, lista)` converte a lista compacta em `Question[]` (ids `prefixo-001`, `prefixo-002`...) e redistribui a posição do gabarito entre A, B, C e D.

### Ligando um arquivo a um tema

Um arquivo só aparece no app depois de ser ligado em `src/data/questoesClinica.ts`:

1. importe a constante exportada pelo arquivo;
2. adicione `...montarQuestoes('prefixo-unico', 'Especialidade', 'Tema', LISTA)` ao array `QUESTOES_CLINICA`.

O prefixo precisa ser único (os ids das questões saem dele). Vários arquivos do mesmo tema entram juntos na mesma chamada ou em chamadas com o mesmo `Tema`. As questões "extra" (`cm2Extra*.ts`, `pedExtra*.ts`...) se juntam às antigas do mesmo tema.

A especialidade de **Clínica Médica 1 e Clínica Médica 2 é `'Clínica Médica'`**. A divisão CM1/CM2 existe só na tela do Banco. As demais: `'Pediatria'`, `'Cirurgia'`, `'Ginecologia e Obstetrícia'`, `'Preventiva'`.

`src/data/questoes.ts` junta tudo (inclusive `QUESTOES_CLINICA`) em `questoesData`, que é o que o Banco lê.

### Temas do Banco de Questões

Os temas exibidos ficam em `SUBTEMAS_POR_AREA` em `src/components/QuestoesScreen.tsx`. Cada item tem `label` e um `matches(q)` que compara o `topic` normalizado da questão. **O nome do tema passado a `montarQuestoes` precisa bater com o `label` do tema** (a comparação ignora acentos, caixa e pontuação). Se não bater, as questões existem mas não aparecem no tema.

## Progresso do usuário

O estado do usuário vive em `src/lib/profileStore.ts`: localStorage por perfil (`santisoft:<perfilId>:<chave>`) espelhado na tabela `profile_state` do Supabase. Use `useProfileState(chave, valorInicial)` (`src/hooks/useProfileState.ts`) como um `useState`. Chaves novas precisam entrar em `StateKey` e `ALL_KEYS` no `profileStore.ts`, senão não sincronizam com a nuvem.

Chaves atuais: `lesson_progress`, `mentor_revisoes`, `custom_drive_urls`, `question_answers` (respostas do banco livre) e `exam_sessions` (provas em andamento do Banco).

## Progresso das questões difíceis

Lista dos temas de `SUBTEMAS_POR_AREA` (`QuestoesScreen.tsx`) que ainda precisam de questões difíceis. `[x]` = já recebeu (em CM2, os arquivos `cm2Extra*.ts`, nível USP/UNIFESP/ENARE/SUS-SP, já ligados em `questoesClinica.ts`); `[ ]` = pendente.

Novos arquivos de questões difíceis começam com o prefixo `dif` (exemplo: `difCirTrauma.ts`). Siga o fluxo de "Ligando um arquivo a um tema" e marque o tema como `[x]` aqui ao ligar o arquivo. O nome do tema passado a `montarQuestoes` deve bater com o `label` abaixo.

### Clínica Médica 2

- [x] Cardiologia: Hipertensão Arterial
- [x] Cardiologia: Doença Coronariana
- [x] Cardiologia: Definição Universal do Infarto do Miocárdio
- [x] Cardiologia: Insuficiência Cardíaca
- [x] Cardiologia: Arritmias Cardíacas
- [x] Cardiologia: Cardiomiopatias, Valvopatias e Pericardite Aguda
- [x] Cardiologia: Parada Cardiorrespiratória
- [x] Terapia Intensiva: Instabilidade Hemodinâmica
- [x] Pneumologia: Asma
- [x] Pneumologia: Tromboembolia Pulmonar
- [x] Pneumologia: Tuberculose
- [x] Pneumologia: Câncer de Pulmão
- [x] Pneumologia: DPOC
- [x] Pneumologia: Insuficiência Respiratória Aguda
- [x] Endocrinologia: Diabetes Mellitus
- [x] Endocrinologia: Tireoide
- [x] Endocrinologia: Paratireoide e Suprarrenal
- [x] Hepatologia: Hepatopatias Agudas
- [x] Hepatologia: Hepatopatias Crônicas e Cirrose
- [x] Hepatologia: Síndrome da Hipertensão Portal
- [ ] Neurologia: Acidente Vascular Encefálico
- [ ] Neurologia: Cefaleia
- [ ] Neurologia: Demência
- [ ] Neurologia: Doenças Motoras
- [ ] Neurologia: Estado de Mal Epiléptico e Crise Febril

### Cirurgia

- [x] Abdome Agudo
- [x] Anestesiologia
- [x] Cicatrização
- [x] Cirurgia Bariátrica
- [ ] Cirurgia Pediátrica
- [ ] Complicações Cirúrgicas
- [ ] Delgado e Cólon: Pólipos e Câncer Colorretal
- [ ] Doença Inflamatória Intestinal
- [ ] Doenças do Esôfago
- [ ] Doenças do Estômago
- [ ] Fígado e Vias Biliares
- [ ] Fios de Sutura
- [ ] Pâncreas
- [ ] Proctologia
- [ ] Risco Cirúrgico
- [ ] Trauma I: Avaliação Inicial e Tórax
- [ ] Trauma II: Transição Toracoabdominal, Abdome, Pelve e TCE
- [ ] Urologia
- [ ] Cirurgia Vascular
- [ ] Hérnias da Parede Abdominal
- [ ] Queimaduras e Cirurgia Plástica

### Preventiva

- [x] Epidemiologia: Processo Epidêmico e Prevenção de Doenças
- [ ] Epidemiologia: Índices, Transição Demográfica e Epidemiológica
- [ ] Epidemiologia: Coeficientes
- [ ] Epidemiologia: Doenças Crônicas Não Transmissíveis e Declaração de Óbito
- [ ] Epidemiologia: Classificação dos Estudos Epidemiológicos
- [ ] Epidemiologia: Análise I - Medidas de Frequência e Associação
- [ ] Epidemiologia: Análise II - Estatística
- [ ] Epidemiologia: Extras e Validação de Teste Diagnóstico
- [ ] Epidemiologia Clínica
- [ ] Vigilância: Raiva, Tétano e Vigilância da Saúde
- [ ] SUS: Atenção Básica
- [ ] SUS: Financiamento do SUS
- [ ] Saúde do Trabalhador
- [ ] Acidente de Trabalho
- [ ] Ética Médica
- [ ] Acidente por Animais Peçonhentos
- [ ] Intoxicações
- [ ] Psiquiatria: Transtornos Psicóticos e Transtornos de Humor
- [ ] Psiquiatria: Transtornos de Ansiedade e Transtornos Alimentares
- [ ] Psiquiatria: Delirium e Transtornos Relacionados a Substâncias
