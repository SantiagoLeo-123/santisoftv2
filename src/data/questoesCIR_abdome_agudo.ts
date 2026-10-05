import { montarQuestoes } from './questoesCompactas';
import { ABDOME_AGUDO_1 } from './cirurgia/abdomeAgudo1';
import { ABDOME_AGUDO_2 } from './cirurgia/abdomeAgudo2';
import { ABDOME_AGUDO_3 } from './cirurgia/abdomeAgudo3';
import { ABDOME_AGUDO_4 } from './cirurgia/abdomeAgudo4';

// 100 questões autorais, em estilo de prova de residência, sobre Abdome Agudo
export const QUESTOES_CIR_ABDOME_AGUDO = montarQuestoes('cir-abdome-agudo', 'Cirurgia', 'Abdome Agudo', [
  ...ABDOME_AGUDO_1,
  ...ABDOME_AGUDO_2,
  ...ABDOME_AGUDO_3,
  ...ABDOME_AGUDO_4,
]);
