import type { Question } from '@/types';
import { montarQuestoes } from './questoesCompactas';
import { ABDOME_AGUDO_1 } from './cirurgia/abdomeAgudo1';
import { ABDOME_AGUDO_2 } from './cirurgia/abdomeAgudo2';
import { ABDOME_AGUDO_3 } from './cirurgia/abdomeAgudo3';
import { ABDOME_AGUDO_4 } from './cirurgia/abdomeAgudo4';
import { ANESTESIOLOGIA_1 } from './cirurgia/anestesiologia1';
import { ANESTESIOLOGIA_2 } from './cirurgia/anestesiologia2';
import { ANESTESIOLOGIA_3 } from './cirurgia/anestesiologia3';
import { ANESTESIOLOGIA_4 } from './cirurgia/anestesiologia4';

// Banco de Clínica Cirúrgica: 100 questões autorais por tema, em estilo de prova de residência.
// Para incluir um tema novo, acrescente uma linha aqui e o subtema em QuestoesScreen.
export const QUESTOES_CIRURGIA: Question[] = [
  ...montarQuestoes('cir-abdome-agudo', 'Cirurgia', 'Abdome Agudo', [
    ...ABDOME_AGUDO_1, ...ABDOME_AGUDO_2, ...ABDOME_AGUDO_3, ...ABDOME_AGUDO_4,
  ]),
  ...montarQuestoes('cir-anestesiologia', 'Cirurgia', 'Anestesiologia', [
    ...ANESTESIOLOGIA_1, ...ANESTESIOLOGIA_2, ...ANESTESIOLOGIA_3, ...ANESTESIOLOGIA_4,
  ]),
];
