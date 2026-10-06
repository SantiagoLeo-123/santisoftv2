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
import { TEP_1 } from './clinica/cmTep1';
import { TEP_2 } from './clinica/cmTep2';
import { TEP_3 } from './clinica/cmTep3';
import { TEP_4 } from './clinica/cmTep4';
import { TB_1 } from './clinica/cmTb1';
import { TB_2 } from './clinica/cmTb2';
import { TB_3 } from './clinica/cmTb3';
import { TB_4 } from './clinica/cmTb4';
import { CA_PULMAO_1 } from './clinica/cmCaPulmao1';
import { CA_PULMAO_2 } from './clinica/cmCaPulmao2';
import { CA_PULMAO_3 } from './clinica/cmCaPulmao3';
import { CA_PULMAO_4 } from './clinica/cmCaPulmao4';
import { DPOC_1 } from './clinica/cmDpoc1';
import { DPOC_2 } from './clinica/cmDpoc2';
import { DPOC_3 } from './clinica/cmDpoc3';
import { DPOC_4 } from './clinica/cmDpoc4';
import { IRPA_1 } from './clinica/cmIrpa1';
import { IRPA_2 } from './clinica/cmIrpa2';
import { IRPA_3 } from './clinica/cmIrpa3';
import { IRPA_4 } from './clinica/cmIrpa4';
import { DM_1 } from './clinica/cmDm1';
import { DM_2 } from './clinica/cmDm2';
import { DM_3 } from './clinica/cmDm3';
import { DM_4 } from './clinica/cmDm4';
import { TIREOIDE_1 } from './clinica/cmTireoide1';
import { TIREOIDE_2 } from './clinica/cmTireoide2';
import { TIREOIDE_3 } from './clinica/cmTireoide3';
import { TIREOIDE_4 } from './clinica/cmTireoide4';
import { PARATIREOIDE_1 } from './clinica/cmParatireoide1';
import { PARATIREOIDE_2 } from './clinica/cmParatireoide2';
import { PARATIREOIDE_3 } from './clinica/cmParatireoide3';
import { PARATIREOIDE_4 } from './clinica/cmParatireoide4';
import { HEP_AGUDA_1 } from './clinica/cmHepAguda1';
import { HEP_AGUDA_2 } from './clinica/cmHepAguda2';
import { HEP_AGUDA_3 } from './clinica/cmHepAguda3';
import { HEP_AGUDA_4 } from './clinica/cmHepAguda4';
import { CIRROSE_1 } from './clinica/cmCirrose1';
import { CIRROSE_2 } from './clinica/cmCirrose2';
import { CIRROSE_3 } from './clinica/cmCirrose3';
import { CIRROSE_4 } from './clinica/cmCirrose4';
import { HIP_PORTAL_1 } from './clinica/cmHipPortal1';
import { HIP_PORTAL_2 } from './clinica/cmHipPortal2';
import { HIP_PORTAL_3 } from './clinica/cmHipPortal3';
import { HIP_PORTAL_4 } from './clinica/cmHipPortal4';
import { AVE_1 } from './clinica/cmAve1';
import { AVE_2 } from './clinica/cmAve2';
import { AVE_3 } from './clinica/cmAve3';
import { AVE_4 } from './clinica/cmAve4';
import { CEFALEIA_1 } from './clinica/cmCefaleia1';
import { CEFALEIA_2 } from './clinica/cmCefaleia2';
import { CEFALEIA_3 } from './clinica/cmCefaleia3';
import { CEFALEIA_4 } from './clinica/cmCefaleia4';
import { DEMENCIA_1 } from './clinica/cmDemencia1';
import { DEMENCIA_2 } from './clinica/cmDemencia2';
import { DEMENCIA_3 } from './clinica/cmDemencia3';
import { DEMENCIA_4 } from './clinica/cmDemencia4';
import { MOTORAS_1 } from './clinica/cmMotoras1';
import { MOTORAS_2 } from './clinica/cmMotoras2';
import { MOTORAS_3 } from './clinica/cmMotoras3';
import { MOTORAS_4 } from './clinica/cmMotoras4';
import { EPILEPSIA_1 } from './clinica/cmEpilepsia1';
import { EPILEPSIA_2 } from './clinica/cmEpilepsia2';
import { EPILEPSIA_3 } from './clinica/cmEpilepsia3';
import { EPILEPSIA_4 } from './clinica/cmEpilepsia4';
import { PED_INFECTO_1 } from './clinica/pedInfecto1';
import { PED_INFECTO_2 } from './clinica/pedInfecto2';
import { PED_INFECTO_3 } from './clinica/pedInfecto3';
import { PED_INFECTO_4 } from './clinica/pedInfecto4';
import { PED_ALEITAMENTO_1 } from './clinica/pedAleitamento1';
import { PED_ALEITAMENTO_2 } from './clinica/pedAleitamento2';
import { PED_ALEITAMENTO_3 } from './clinica/pedAleitamento3';
import { PED_ALEITAMENTO_4 } from './clinica/pedAleitamento4';
import { GLOMERULAR_1 } from './clinica/cm1Glomerular1';
import { GLOMERULAR_2 } from './clinica/cm1Glomerular2';
import { GLOMERULAR_3 } from './clinica/cm1Glomerular3';
import { GLOMERULAR_4 } from './clinica/cm1Glomerular4';
import { TUBULAR_1 } from './clinica/cm1Tubular1';
import { TUBULAR_2 } from './clinica/cm1Tubular2';
import { TUBULAR_3 } from './clinica/cm1Tubular3';
import { TUBULAR_4 } from './clinica/cm1Tubular4';
import { UREMICA_1 } from './clinica/cm1Uremica1';
import { UREMICA_2 } from './clinica/cm1Uremica2';
import { UREMICA_3 } from './clinica/cm1Uremica3';
import { UREMICA_4 } from './clinica/cm1Uremica4';
import { ELETROLITOS_1 } from './clinica/cm1Eletrolitos1';
import { ELETROLITOS_2 } from './clinica/cm1Eletrolitos2';
import { ELETROLITOS_3 } from './clinica/cm1Eletrolitos3';
import { ELETROLITOS_4 } from './clinica/cm1Eletrolitos4';
import { ACIDO_BASE_1 } from './clinica/cm1AcidoBase1';
import { ACIDO_BASE_2 } from './clinica/cm1AcidoBase2';
import { ACIDO_BASE_3 } from './clinica/cm1AcidoBase3';
import { ACIDO_BASE_4 } from './clinica/cm1AcidoBase4';
import { ANEMIAS_1 } from './clinica/cm1Anemias1';
import { ANEMIAS_2 } from './clinica/cm1Anemias2';
import { ANEMIAS_3 } from './clinica/cm1Anemias3';
import { ANEMIAS_4 } from './clinica/cm1Anemias4';
import { LINFOMAS_1 } from './clinica/cm1Linfomas1';
import { LINFOMAS_2 } from './clinica/cm1Linfomas2';
import { LINFOMAS_3 } from './clinica/cm1Linfomas3';
import { LINFOMAS_4 } from './clinica/cm1Linfomas4';
import { PLAQUETAS_1 } from './clinica/cm1Plaquetas1';
import { PLAQUETAS_2 } from './clinica/cm1Plaquetas2';
import { PLAQUETAS_3 } from './clinica/cm1Plaquetas3';
import { PLAQUETAS_4 } from './clinica/cm1Plaquetas4';
import { FEBRIS_1 } from './clinica/cm1Febris1';
import { FEBRIS_2 } from './clinica/cm1Febris2';
import { FEBRIS_3 } from './clinica/cm1Febris3';
import { FEBRIS_4 } from './clinica/cm1Febris4';
import { HIV_1 } from './clinica/cm1Hiv1';
import { HIV_2 } from './clinica/cm1Hiv2';
import { HIV_3 } from './clinica/cm1Hiv3';
import { HIV_4 } from './clinica/cm1Hiv4';
import { ENDOCARDITE_1 } from './clinica/cm1Endocardite1';
import { ENDOCARDITE_2 } from './clinica/cm1Endocardite2';
import { ENDOCARDITE_3 } from './clinica/cm1Endocardite3';
import { ENDOCARDITE_4 } from './clinica/cm1Endocardite4';
import { MENINGITES_1 } from './clinica/cm1Meningites1';
import { MENINGITES_2 } from './clinica/cm1Meningites2';
import { MENINGITES_3 } from './clinica/cm1Meningites3';
import { MENINGITES_4 } from './clinica/cm1Meningites4';
import { PNEUMONIA_1 } from './clinica/cm1Pneumonia1';
import { PNEUMONIA_2 } from './clinica/cm1Pneumonia2';
import { PNEUMONIA_3 } from './clinica/cm1Pneumonia3';
import { PNEUMONIA_4 } from './clinica/cm1Pneumonia4';

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
  ...montarQuestoes('cm-tep', 'Clínica Médica', 'Pneumologia: Tromboembolia Pulmonar', [
    ...TEP_1, ...TEP_2, ...TEP_3, ...TEP_4,
  ]),
  ...montarQuestoes('cm-tb', 'Clínica Médica', 'Pneumologia: Tuberculose', [
    ...TB_1, ...TB_2, ...TB_3, ...TB_4,
  ]),
  ...montarQuestoes('cm-ca-pulmao', 'Clínica Médica', 'Pneumologia: Câncer de Pulmão', [
    ...CA_PULMAO_1, ...CA_PULMAO_2, ...CA_PULMAO_3, ...CA_PULMAO_4,
  ]),
  ...montarQuestoes('cm-dpoc', 'Clínica Médica', 'Pneumologia: DPOC', [
    ...DPOC_1, ...DPOC_2, ...DPOC_3, ...DPOC_4,
  ]),
  ...montarQuestoes('cm-irpa', 'Clínica Médica', 'Pneumologia: Insuficiência Respiratória Aguda', [
    ...IRPA_1, ...IRPA_2, ...IRPA_3, ...IRPA_4,
  ]),
  ...montarQuestoes('cm-dm', 'Clínica Médica', 'Endocrinologia: Diabetes Mellitus', [
    ...DM_1, ...DM_2, ...DM_3, ...DM_4,
  ]),
  ...montarQuestoes('cm-tireoide', 'Clínica Médica', 'Endocrinologia: Tireoide', [
    ...TIREOIDE_1, ...TIREOIDE_2, ...TIREOIDE_3, ...TIREOIDE_4,
  ]),
  ...montarQuestoes('cm-paratireoide', 'Clínica Médica', 'Endocrinologia: Paratireoide e Suprarrenal', [
    ...PARATIREOIDE_1, ...PARATIREOIDE_2, ...PARATIREOIDE_3, ...PARATIREOIDE_4,
  ]),
  ...montarQuestoes('cm-hep-aguda', 'Clínica Médica', 'Hepatologia: Hepatopatias Agudas', [
    ...HEP_AGUDA_1, ...HEP_AGUDA_2, ...HEP_AGUDA_3, ...HEP_AGUDA_4,
  ]),
  ...montarQuestoes('cm-cirrose', 'Clínica Médica', 'Hepatologia: Hepatopatias Crônicas e Cirrose', [
    ...CIRROSE_1, ...CIRROSE_2, ...CIRROSE_3, ...CIRROSE_4,
  ]),
  ...montarQuestoes('cm-hip-portal', 'Clínica Médica', 'Hepatologia: Síndrome da Hipertensão Portal', [
    ...HIP_PORTAL_1, ...HIP_PORTAL_2, ...HIP_PORTAL_3, ...HIP_PORTAL_4,
  ]),
  ...montarQuestoes('cm-ave', 'Clínica Médica', 'Neurologia: Acidente Vascular Encefálico', [
    ...AVE_1, ...AVE_2, ...AVE_3, ...AVE_4,
  ]),
  ...montarQuestoes('cm-cefaleia', 'Clínica Médica', 'Neurologia: Cefaleia', [
    ...CEFALEIA_1, ...CEFALEIA_2, ...CEFALEIA_3, ...CEFALEIA_4,
  ]),
  ...montarQuestoes('cm-demencia', 'Clínica Médica', 'Neurologia: Demência', [
    ...DEMENCIA_1, ...DEMENCIA_2, ...DEMENCIA_3, ...DEMENCIA_4,
  ]),
  ...montarQuestoes('cm-motoras', 'Clínica Médica', 'Neurologia: Doenças Motoras', [
    ...MOTORAS_1, ...MOTORAS_2, ...MOTORAS_3, ...MOTORAS_4,
  ]),
  ...montarQuestoes('cm-epilepsia', 'Clínica Médica', 'Neurologia: Estado de Mal Epiléptico e Crise Febril', [
    ...EPILEPSIA_1, ...EPILEPSIA_2, ...EPILEPSIA_3, ...EPILEPSIA_4,
  ]),
  ...montarQuestoes('ped-infecto', 'Pediatria', 'Infectologia Pediátrica', [
    ...PED_INFECTO_1, ...PED_INFECTO_2, ...PED_INFECTO_3, ...PED_INFECTO_4,
  ]),
  ...montarQuestoes('ped-aleitamento', 'Pediatria', 'Aleitamento Materno', [
    ...PED_ALEITAMENTO_1, ...PED_ALEITAMENTO_2, ...PED_ALEITAMENTO_3, ...PED_ALEITAMENTO_4,
  ]),
  ...montarQuestoes('cm1-glomerular', 'Clínica Médica', 'Nefrologia: Síndromes Glomerulares', [
    ...GLOMERULAR_1, ...GLOMERULAR_2, ...GLOMERULAR_3, ...GLOMERULAR_4,
  ]),
  ...montarQuestoes('cm1-tubular', 'Clínica Médica', 'Nefrologia: Síndromes Tubulares e Vasculares', [
    ...TUBULAR_1, ...TUBULAR_2, ...TUBULAR_3, ...TUBULAR_4,
  ]),
  ...montarQuestoes('cm1-uremica', 'Clínica Médica', 'Nefrologia: Síndrome Urêmica', [
    ...UREMICA_1, ...UREMICA_2, ...UREMICA_3, ...UREMICA_4,
  ]),
  ...montarQuestoes('cm1-eletrolitos', 'Clínica Médica', 'Nefrologia: Equilíbrio Eletrolítico', [
    ...ELETROLITOS_1, ...ELETROLITOS_2, ...ELETROLITOS_3, ...ELETROLITOS_4,
  ]),
  ...montarQuestoes('cm1-acido-base', 'Clínica Médica', 'Nefrologia: Equilíbrio Ácido-Básico', [
    ...ACIDO_BASE_1, ...ACIDO_BASE_2, ...ACIDO_BASE_3, ...ACIDO_BASE_4,
  ]),
  ...montarQuestoes('cm1-anemias', 'Clínica Médica', 'Hematologia: Série Vermelha (Anemias)', [
    ...ANEMIAS_1, ...ANEMIAS_2, ...ANEMIAS_3, ...ANEMIAS_4,
  ]),
  ...montarQuestoes('cm1-linfomas', 'Clínica Médica', 'Hematologia: Série Branca (Linfoma e Mieloma)', [
    ...LINFOMAS_1, ...LINFOMAS_2, ...LINFOMAS_3, ...LINFOMAS_4,
  ]),
  ...montarQuestoes('cm1-plaquetas', 'Clínica Médica', 'Hematologia: Série Plaquetária', [
    ...PLAQUETAS_1, ...PLAQUETAS_2, ...PLAQUETAS_3, ...PLAQUETAS_4,
  ]),
  ...montarQuestoes('cm1-febris', 'Clínica Médica', 'Infectologia: Síndromes Febris', [
    ...FEBRIS_1, ...FEBRIS_2, ...FEBRIS_3, ...FEBRIS_4,
  ]),
  ...montarQuestoes('cm1-hiv', 'Clínica Médica', 'Infectologia: HIV e AIDS', [
    ...HIV_1, ...HIV_2, ...HIV_3, ...HIV_4,
  ]),
  ...montarQuestoes('cm1-endocardite', 'Clínica Médica', 'Infectologia: Endocardite Infecciosa', [
    ...ENDOCARDITE_1, ...ENDOCARDITE_2, ...ENDOCARDITE_3, ...ENDOCARDITE_4,
  ]),
  ...montarQuestoes('cm1-meningites', 'Clínica Médica', 'Infectologia: Meningites', [
    ...MENINGITES_1, ...MENINGITES_2, ...MENINGITES_3, ...MENINGITES_4,
  ]),
  ...montarQuestoes('cm1-pneumonia', 'Clínica Médica', 'Infectologia: Pneumonia', [
    ...PNEUMONIA_1, ...PNEUMONIA_2, ...PNEUMONIA_3, ...PNEUMONIA_4,
  ]),
];
