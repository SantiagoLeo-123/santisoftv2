import type { Question } from '@/types';
import { montarQuestoes } from './questoesCompactas';
import { HAS_1 } from './clinica/cmHas1';
import { HAS_2 } from './clinica/cmHas2';
import { HAS_3 } from './clinica/cmHas3';
import { HAS_4 } from './clinica/cmHas4';
import { CORONARIA_1 } from './clinica/cmCoronaria1';
import { CORONARIA_2 } from './clinica/cmCoronaria2';
import { CORONARIA_3 } from './clinica/cmCoronaria3';
import { CORONARIA_4 } from './clinica/cmCoronaria4';
import { INFARTO_1 } from './clinica/cmInfarto1';
import { INFARTO_2 } from './clinica/cmInfarto2';
import { INFARTO_3 } from './clinica/cmInfarto3';
import { INFARTO_4 } from './clinica/cmInfarto4';
import { IC_1 } from './clinica/cmIc1';
import { IC_2 } from './clinica/cmIc2';
import { IC_3 } from './clinica/cmIc3';
import { IC_4 } from './clinica/cmIc4';
import { ARRITMIAS_1 } from './clinica/cmArritmias1';
import { ARRITMIAS_2 } from './clinica/cmArritmias2';
import { ARRITMIAS_3 } from './clinica/cmArritmias3';
import { ARRITMIAS_4 } from './clinica/cmArritmias4';
import { VALVAS_1 } from './clinica/cmValvas1';
import { VALVAS_2 } from './clinica/cmValvas2';
import { VALVAS_3 } from './clinica/cmValvas3';
import { VALVAS_4 } from './clinica/cmValvas4';
import { PCR_1 } from './clinica/cmPcr1';
import { PCR_2 } from './clinica/cmPcr2';
import { PCR_3 } from './clinica/cmPcr3';
import { PCR_4 } from './clinica/cmPcr4';
import { CHOQUE_1 } from './clinica/cmChoque1';
import { CHOQUE_2 } from './clinica/cmChoque2';
import { CHOQUE_3 } from './clinica/cmChoque3';
import { CHOQUE_4 } from './clinica/cmChoque4';
import { ASMA_1 } from './clinica/cmAsma1';
import { ASMA_2 } from './clinica/cmAsma2';
import { ASMA_3 } from './clinica/cmAsma3';
import { ASMA_4 } from './clinica/cmAsma4';

// Banco de Clínica Médica 2 e complementos de Pediatria (100 questões por tema)
export const QUESTOES_CLINICA: Question[] = [
  ...montarQuestoes('cm-has', 'Clínica Médica', 'Cardiologia: Hipertensão Arterial', [
    ...HAS_1, ...HAS_2, ...HAS_3, ...HAS_4,
  ]),
  ...montarQuestoes('cm-coronaria', 'Clínica Médica', 'Cardiologia: Doença Coronariana', [
    ...CORONARIA_1, ...CORONARIA_2, ...CORONARIA_3, ...CORONARIA_4,
  ]),
  ...montarQuestoes('cm-infarto', 'Clínica Médica', 'Cardiologia: Definição Universal do Infarto do Miocárdio', [
    ...INFARTO_1, ...INFARTO_2, ...INFARTO_3, ...INFARTO_4,
  ]),
  ...montarQuestoes('cm-ic', 'Clínica Médica', 'Cardiologia: Insuficiência Cardíaca', [
    ...IC_1, ...IC_2, ...IC_3, ...IC_4,
  ]),
  ...montarQuestoes('cm-arritmias', 'Clínica Médica', 'Cardiologia: Arritmias Cardíacas', [
    ...ARRITMIAS_1, ...ARRITMIAS_2, ...ARRITMIAS_3, ...ARRITMIAS_4,
  ]),
  ...montarQuestoes('cm-valvas', 'Clínica Médica', 'Cardiologia: Cardiomiopatias, Valvopatias e Pericardite Aguda', [
    ...VALVAS_1, ...VALVAS_2, ...VALVAS_3, ...VALVAS_4,
  ]),
  ...montarQuestoes('cm-pcr', 'Clínica Médica', 'Cardiologia: Parada Cardiorrespiratória', [
    ...PCR_1, ...PCR_2, ...PCR_3, ...PCR_4,
  ]),
  ...montarQuestoes('cm-choque', 'Clínica Médica', 'Terapia Intensiva: Instabilidade Hemodinâmica', [
    ...CHOQUE_1, ...CHOQUE_2, ...CHOQUE_3, ...CHOQUE_4,
  ]),
  ...montarQuestoes('cm-asma', 'Clínica Médica', 'Pneumologia: Asma', [
    ...ASMA_1, ...ASMA_2, ...ASMA_3, ...ASMA_4,
  ]),
];
