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
import { CICATRIZACAO_1 } from './cirurgia/cicatrizacao1';
import { CICATRIZACAO_2 } from './cirurgia/cicatrizacao2';
import { CICATRIZACAO_3 } from './cirurgia/cicatrizacao3';
import { CICATRIZACAO_4 } from './cirurgia/cicatrizacao4';
import { BARIATRICA_1 } from './cirurgia/bariatrica1';
import { BARIATRICA_2 } from './cirurgia/bariatrica2';
import { BARIATRICA_3 } from './cirurgia/bariatrica3';
import { BARIATRICA_4 } from './cirurgia/bariatrica4';
import { PEDIATRICA_1 } from './cirurgia/pediatrica1';
import { PEDIATRICA_2 } from './cirurgia/pediatrica2';
import { PEDIATRICA_3 } from './cirurgia/pediatrica3';
import { PEDIATRICA_4 } from './cirurgia/pediatrica4';
// Banco de Clínica Cirúrgica: 100 questões autorais por tema, em estilo de prova de residência.
// Para incluir um tema novo, acrescente uma linha aqui e o subtema em QuestoesScreen.
export const QUESTOES_CIRURGIA: Question[] = [
  ...montarQuestoes('cir-abdome-agudo', 'Cirurgia', 'Abdome Agudo', [
    ...ABDOME_AGUDO_1, ...ABDOME_AGUDO_2, ...ABDOME_AGUDO_3, ...ABDOME_AGUDO_4,
  ]),
  ...montarQuestoes('cir-anestesiologia', 'Cirurgia', 'Anestesiologia', [
    ...ANESTESIOLOGIA_1, ...ANESTESIOLOGIA_2, ...ANESTESIOLOGIA_3, ...ANESTESIOLOGIA_4,
  ]),
  ...montarQuestoes('cir-cicatrizacao', 'Cirurgia', 'Cicatrização', [
    ...CICATRIZACAO_1, ...CICATRIZACAO_2, ...CICATRIZACAO_3, ...CICATRIZACAO_4,
  ]),
  ...montarQuestoes('cir-bariatrica', 'Cirurgia', 'Cirurgia Bariátrica', [
    ...BARIATRICA_1, ...BARIATRICA_2, ...BARIATRICA_3, ...BARIATRICA_4,
  ]),
  ...montarQuestoes('cir-pediatrica', 'Cirurgia', 'Cirurgia Pediátrica', [
    ...PEDIATRICA_1, ...PEDIATRICA_2, ...PEDIATRICA_3, ...PEDIATRICA_4,
  ]),
];
