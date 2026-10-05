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
import { ESOFAGO_1 } from './cirurgia/esofago1';
import { ESOFAGO_2 } from './cirurgia/esofago2';
import { ESOFAGO_3 } from './cirurgia/esofago3';
import { ESOFAGO_4 } from './cirurgia/esofago4';
import { ESTOMAGO_1 } from './cirurgia/estomago1';
import { ESTOMAGO_2 } from './cirurgia/estomago2';
import { ESTOMAGO_3 } from './cirurgia/estomago3';
import { ESTOMAGO_4 } from './cirurgia/estomago4';
import { FIGADO_1 } from './cirurgia/figado1';
import { FIGADO_2 } from './cirurgia/figado2';
import { FIGADO_3 } from './cirurgia/figado3';
import { FIGADO_4 } from './cirurgia/figado4';
import { FIOS_1 } from './cirurgia/fios1';
import { FIOS_2 } from './cirurgia/fios2';
import { FIOS_3 } from './cirurgia/fios3';
import { FIOS_4 } from './cirurgia/fios4';
import { HERNIAS_1 } from './cirurgia/hernias1';
import { HERNIAS_2 } from './cirurgia/hernias2';
import { HERNIAS_3 } from './cirurgia/hernias3';
import { HERNIAS_4 } from './cirurgia/hernias4';
import { PANCREAS_1 } from './cirurgia/pancreas1';
import { PANCREAS_2 } from './cirurgia/pancreas2';
import { PANCREAS_3 } from './cirurgia/pancreas3';
import { PANCREAS_4 } from './cirurgia/pancreas4';
import { PROCTO_1 } from './cirurgia/procto1';
import { PROCTO_2 } from './cirurgia/procto2';
import { PROCTO_3 } from './cirurgia/procto3';
import { PROCTO_4 } from './cirurgia/procto4';
import { QUEIMADURA_1 } from './cirurgia/queimadura1';
import { QUEIMADURA_2 } from './cirurgia/queimadura2';
import { QUEIMADURA_3 } from './cirurgia/queimadura3';
import { QUEIMADURA_4 } from './cirurgia/queimadura4';
import { RISCO_1 } from './cirurgia/risco1';
import { RISCO_2 } from './cirurgia/risco2';
import { RISCO_3 } from './cirurgia/risco3';
import { RISCO_4 } from './cirurgia/risco4';
import { TRAUMA_A_1 } from './cirurgia/traumaA1';
import { TRAUMA_A_2 } from './cirurgia/traumaA2';
import { TRAUMA_A_3 } from './cirurgia/traumaA3';
import { TRAUMA_A_4 } from './cirurgia/traumaA4';
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
  ...montarQuestoes('cir-esofago', 'Cirurgia', 'Doenças do Esôfago', [
    ...ESOFAGO_1, ...ESOFAGO_2, ...ESOFAGO_3, ...ESOFAGO_4,
  ]),
  ...montarQuestoes('cir-estomago', 'Cirurgia', 'Doenças do Estômago', [
    ...ESTOMAGO_1, ...ESTOMAGO_2, ...ESTOMAGO_3, ...ESTOMAGO_4,
  ]),
  ...montarQuestoes('cir-figado', 'Cirurgia', 'Fígado e Vias Biliares', [
    ...FIGADO_1, ...FIGADO_2, ...FIGADO_3, ...FIGADO_4,
  ]),
  ...montarQuestoes('cir-fios', 'Cirurgia', 'Fios de Sutura', [
    ...FIOS_1, ...FIOS_2, ...FIOS_3, ...FIOS_4,
  ]),
  ...montarQuestoes('cir-hernias', 'Cirurgia', 'Hérnias da Parede Abdominal', [
    ...HERNIAS_1, ...HERNIAS_2, ...HERNIAS_3, ...HERNIAS_4,
  ]),
  ...montarQuestoes('cir-pancreas', 'Cirurgia', 'Pâncreas', [
    ...PANCREAS_1, ...PANCREAS_2, ...PANCREAS_3, ...PANCREAS_4,
  ]),
  ...montarQuestoes('cir-proctologia', 'Cirurgia', 'Proctologia', [
    ...PROCTO_1, ...PROCTO_2, ...PROCTO_3, ...PROCTO_4,
  ]),
  ...montarQuestoes('cir-queimadura', 'Cirurgia', 'Queimadura', [
    ...QUEIMADURA_1, ...QUEIMADURA_2, ...QUEIMADURA_3, ...QUEIMADURA_4,
  ]),
  ...montarQuestoes('cir-risco', 'Cirurgia', 'Risco Cirúrgico', [
    ...RISCO_1, ...RISCO_2, ...RISCO_3, ...RISCO_4,
  ]),
  ...montarQuestoes('cir-trauma-1', 'Cirurgia', 'Trauma I: Avaliação Inicial e Tórax', [
    ...TRAUMA_A_1, ...TRAUMA_A_2, ...TRAUMA_A_3, ...TRAUMA_A_4,
  ]),
];
