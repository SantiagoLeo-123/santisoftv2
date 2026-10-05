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
import { VASCULAR_1 } from './cirurgia/vascular1';
import { VASCULAR_2 } from './cirurgia/vascular2';
import { VASCULAR_3 } from './cirurgia/vascular3';
import { VASCULAR_4 } from './cirurgia/vascular4';
import { COMPLICACOES_1 } from './cirurgia/complicacoes1';
import { COMPLICACOES_2 } from './cirurgia/complicacoes2';
import { COMPLICACOES_3 } from './cirurgia/complicacoes3';
import { COMPLICACOES_4 } from './cirurgia/complicacoes4';
import { COLORRETAL_1 } from './cirurgia/colorretal1';
import { COLORRETAL_2 } from './cirurgia/colorretal2';
import { COLORRETAL_3 } from './cirurgia/colorretal3';
import { COLORRETAL_4 } from './cirurgia/colorretal4';
import { DII_1 } from './cirurgia/dii1';
import { DII_2 } from './cirurgia/dii2';
import { DII_3 } from './cirurgia/dii3';
import { DII_4 } from './cirurgia/dii4';
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
  ...montarQuestoes('cir-vascular', 'Cirurgia', 'Cirurgia Vascular', [
    ...VASCULAR_1, ...VASCULAR_2, ...VASCULAR_3, ...VASCULAR_4,
  ]),
  ...montarQuestoes('cir-complicacoes', 'Cirurgia', 'Complicações Cirúrgicas', [
    ...COMPLICACOES_1, ...COMPLICACOES_2, ...COMPLICACOES_3, ...COMPLICACOES_4,
  ]),
  ...montarQuestoes('cir-colorretal', 'Cirurgia', 'Delgado e Cólon: Pólipos e Câncer Colorretal', [
    ...COLORRETAL_1, ...COLORRETAL_2, ...COLORRETAL_3, ...COLORRETAL_4,
  ]),
  ...montarQuestoes('cir-dii', 'Cirurgia', 'Doença Inflamatória Intestinal', [
    ...DII_1, ...DII_2, ...DII_3, ...DII_4,
  ]),
];
