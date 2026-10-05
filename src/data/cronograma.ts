export type AreaShort = 'Clínica' | 'GO' | 'Cirurgia' | 'Pediatria' | 'Preventiva';

export interface CronogramaEntry {
  id: string;
  semana: string;
  area: AreaShort;
  aula: string;
  bonus: string;
  driveId?: string;
  titulo?: string;
  driveUrl?: string;
}

export const AREA_COLORS: Record<AreaShort, { bg: string; text: string; border: string; dot: string }> = {
  'Clínica':    { bg: 'bg-red-600/15',   text: 'text-red-400',   border: 'border-red-600/30',   dot: 'bg-red-500' },
  'GO':         { bg: 'bg-pink-600/15',  text: 'text-pink-400',  border: 'border-pink-600/30',  dot: 'bg-pink-500' },
  'Cirurgia':   { bg: 'bg-orange-600/15',text: 'text-orange-400',border: 'border-orange-600/30',dot: 'bg-orange-500' },
  'Pediatria':  { bg: 'bg-cyan-600/15',  text: 'text-cyan-400',  border: 'border-cyan-600/30',  dot: 'bg-cyan-500' },
  'Preventiva': { bg: 'bg-emerald-600/15',text:'text-emerald-400',border:'border-emerald-600/30',dot:'bg-emerald-500' },
};

export const AREA_FILTERS: { label: string; value: AreaShort | 'Todas' }[] = [
  { label: 'Todas', value: 'Todas' },
  { label: 'Clínica', value: 'Clínica' },
  { label: 'GO', value: 'GO' },
  { label: 'Cirurgia', value: 'Cirurgia' },
  { label: 'Pediatria', value: 'Pediatria' },
  { label: 'Preventiva', value: 'Preventiva' },
];

type RawEntry = Omit<CronogramaEntry, 'id'> & { id?: string };

// Cronograma oficial MEDPlanner | MEDCURSO 2026 (91 temas, Semana 01 a 46; não há Semana 07).
// Os ids são fixos: o progresso de cada perfil é gravado por id, então não renumere.
const raw: RawEntry[] = [
  { id: 'cron-000', semana: 'Semana 01', area: 'Clínica', aula: 'Glomerulopatias I (Nefrítica, Alterações Assintomáticas, GNRP)', bonus: 'Alport' },
  { id: 'cron-001', semana: 'Semana 01', area: 'GO', aula: 'Ciclo Menstrual e Anticoncepção', bonus: 'Incongruência de Gênero, Síndrome Pré-Menstrual (SPM) e Síndrome Disfórica Pré-Menstrual (SDPM)', driveId: '1NAdDvXxWNxPDjpjfE57WSpv52SxVry5c' },
  { id: 'cron-002', semana: 'Semana 02', area: 'Clínica', aula: 'Glomerulopatias II (Síndrome Nefrótica, Glomerulopatias nas Desordens Sistêmicas)', bonus: '-' },
  { id: 'cron-003', semana: 'Semana 02', area: 'GO', aula: 'Amenorreia e Ovário Policístico', bonus: '-', driveId: '1xWFt7-79xlxGOFherNJeo_h_tN8_i_S6' },
  { id: 'cron-004', semana: 'Semana 03', area: 'Cirurgia', aula: 'Trauma I: Avaliação Inicial e Trauma de Tórax', bonus: 'Trauma Cervical, Trauma de Abdome - Lesões Específicas, Lesão de Extremidade, Atualização ATLS - 11ª Edição', driveId: '1uItgWmjwosN2BpLlgiGCqVaQm9zU_9cl' },
  { id: 'cron-005', semana: 'Semana 03', area: 'Cirurgia', aula: 'Trauma II: Trauma de Abdome, Pelve e TCE', bonus: 'As aulas correspondem às mesmas apresentadas no tema acima.', driveId: '1UxQC_o-NpXIL0FHp-tdU8Zg8GVd6x9tz' },
  { id: 'cron-006', semana: 'Semana 04', area: 'Clínica', aula: 'Distúrbio Hidroeletrolítico', bonus: 'Hipernatremia' },
  { id: 'cron-007', semana: 'Semana 04', area: 'GO', aula: 'Diagnóstico de Gravidez, Modificações do Organismo Materno e Pré-Natal', bonus: 'Aconselhamento Genético Pré-Natal', driveId: '1d_OCrXjH-uwYAlZoCXoluYekJBIAcbyi' },
  { id: 'cron-008', semana: 'Semana 05', area: 'Clínica', aula: 'Insuficiência Renal', bonus: 'Rabdomiólise, Terapia de Substituição Renal - HD e DP, Terapia de Substituição Renal - Transplante, Nefrotoxicidade por contraste' },
  { id: 'cron-009', semana: 'Semana 05', area: 'Clínica', aula: 'Distúrbio Ácido-Básico', bonus: 'Acidose tubular renal, Ateroembolismo e infarto renal, Estenose de artéria renal' },
  { id: 'cron-010', semana: 'Semana 06', area: 'Pediatria', aula: 'Neonatologia I', bonus: 'Triagem Neonatal, O Exame Físico Neonatal', driveId: '1mOuc7bA2ljk7f_q0MDDt5SkDHXCCJjsj' },
  { id: 'cron-011', semana: 'Semana 06', area: 'Preventiva', aula: 'Medidas de Saúde Coletiva', bonus: 'Indicadores demográficos, Daly, Near Miss' },
  { id: 'cron-013', semana: 'Semana 08', area: 'Preventiva', aula: 'Estudos Epidemiológicos', bonus: 'Variáveis e Testes Estatísticos, Estudos Descritivos e Metanálise, Fases do Ensaio Clínico' },
  { id: 'cron-014', semana: 'Semana 08', area: 'Cirurgia', aula: 'Urologia', bonus: 'Câncer de Rim, Câncer de Bexiga, Câncer do Testículo, Hipogonadismo Masculino e Testosterona, Disfunção Erétil', driveId: '1SlHzq15WLhhcj6uQ3SvRi_m8x-AJjjl1' },
  { id: 'cron-015', semana: 'Semana 09', area: 'Clínica', aula: 'Introdução à Reumatologia + Artrites (Artrite Reumatoide, Espondiloartropatias Soronegativas)', bonus: '-' },
  { id: 'cron-016', semana: 'Semana 09', area: 'Pediatria', aula: 'Neonatologia II', bonus: 'Enterocolite Necrosante, Miscelânea', driveId: '1K08_YemumJVvA9dgvtKv2Mv4xy9EeILn' },
  { id: 'cron-017', semana: 'Semana 10', area: 'Clínica', aula: 'Gota; Febre Reumática', bonus: 'Fibromialgia, Artrite Séptica' },
  { id: 'cron-018', semana: 'Semana 10', area: 'Preventiva', aula: 'Epidemiologia Clínica', bonus: 'Verossimilhança e Testes Múltiplos, Curva ROC e Variações no Ponto de Corte, Medidas de Tendência Central e de Dispersão' },
  { id: 'cron-019', semana: 'Semana 11', area: 'Cirurgia', aula: 'Queimadura e Cirurgia Plástica', bonus: 'REMIT, Nutrição perioperatória, Úlceras de pressão', driveId: '11JRO99JlMpkwd95f_ojQtM3FrH-BBlpS' },
  { id: 'cron-020', semana: 'Semana 11', area: 'GO', aula: 'Assistência Clínica ao Parto e Parto Prematuro', bonus: 'Estudo do Motor, Mecanismo de Parto, Cesariana', driveId: '1T-_xwlyLe3jbOIJb-K8vg0IAqRSHHRoi' },
  { id: 'cron-021', semana: 'Semana 12', area: 'Preventiva', aula: 'Vigilância da Saúde', bonus: 'Glossário de Doenças Infecciosas, Processo Epidêmico' },
  { id: 'cron-022', semana: 'Semana 12', area: 'Clínica', aula: 'Colagenoses', bonus: 'Amiloidoses, Síndrome de Sjögren, Doença Mista do Tecido Conjuntivo' },
  { id: 'cron-023', semana: 'Semana 13', area: 'Preventiva', aula: 'Saúde do Trabalhador + Ética Médica', bonus: 'Saúde do Trabalhador: Saturnismo, Hidrargirismo, Benzenismo e Cromo' },
  { id: 'cron-024', semana: 'Semana 13', area: 'Cirurgia', aula: 'Cirurgia Pediátrica', bonus: '-', driveId: '1n7QaeNDhcEak6zlp4-fSYtiN8XtyNume' },
  { id: 'cron-025', semana: 'Semana 14', area: 'Clínica', aula: 'Vasculites', bonus: '-' },
  { id: 'cron-026', semana: 'Semana 14', area: 'Pediatria', aula: 'Aleitamento Materno', bonus: 'Alimentação Complementar', driveId: '1fdegMAtulj0HLIwbmyhvi-9VS2iLnfW6' },
  { id: 'cron-027', semana: 'Semana 15', area: 'Clínica', aula: 'Anemias I - Introdução, Ferropriva, Doença Crônica, Megaloblástica', bonus: 'Mielodisplasia, Anemia Aplásica' },
  { id: 'cron-028', semana: 'Semana 15', area: 'Pediatria', aula: 'Crescimento e Desenvolvimento Normais; Puberdade Normal', bonus: 'Distúrbios Puberais (dever de casa: puberdade precoce)', driveId: '12oqAtsiwl-HssEB0pGNCsSplXLjYHW1k' },
  { id: 'cron-029', semana: 'Semana 16', area: 'Clínica', aula: 'Anemia II - Introdução às Anemias Hemolíticas / Anemia Falciforme e Outras Hemoglobinopatias', bonus: 'Porfiria, Hemoglobinúria Paroxística Noturna, Talassemias' },
  { id: 'cron-030', semana: 'Semana 16', area: 'Clínica', aula: 'Leucemias Agudas e Crônicas', bonus: 'Esplenomegalia, Doenças mieloproliferativas' },
  { id: 'cron-031', semana: 'Semana 17', area: 'Clínica', aula: 'Linfomas e Mieloma Múltiplo', bonus: '-' },
  { id: 'cron-032', semana: 'Semana 17', area: 'Cirurgia', aula: 'Preparo Pré-Operatório, Risco Cirúrgico e Complicações em Cirurgia', bonus: 'Anestesiologia, Fios de Sutura, Profilaxia de TEP e TVP', driveId: '1JRsHaxtAGg4Sd2Xianq7fmYZXtH0KseW' },
  { id: 'cron-033', semana: 'Semana 18', area: 'Clínica', aula: 'Distúrbios da Hemostasia', bonus: 'Hemofilias, Hemotransfusão, Trombofilias, Tromboelastograma' },
  { id: 'cron-034', semana: 'Semana 18', area: 'Cirurgia', aula: 'Hérnias da Parede Abdominal', bonus: 'Abordagem Laparoscópica, Hérnias na Infância, Tipos de tela, Hérnia incisional', driveId: '1NCcBQEWfnu-BTb6YhLzMf4-cGGozoMns' },
  { id: 'cron-035', semana: 'Semana 19', area: 'Clínica', aula: 'Doenças do Esôfago', bonus: 'Perfuração Esofágica (Boerhaave), Esofagites', driveId: '1gQei_JMuG8jfLGDEm1GI2qwAuD7Q0CrK' },
  { id: 'cron-036', semana: 'Semana 19', area: 'GO', aula: 'Sangramento Uterino Anormal, Endometriose e Infertilidade', bonus: 'Infertilidade, Dismenorreia e os Pólipos Endometriais', driveId: '1QSpTTDscZfRphnPbdPuFmQniieDdVRb7' },
  { id: 'cron-037', semana: 'Semana 20', area: 'Clínica', aula: 'Doenças do Estômago', bonus: 'Hemorragia Digestiva Alta, GIST, Linfoma Gástrico, Síndrome de Zollinger-Ellison', driveId: '1NQM04y6hkpsxnjyGxjuUr4Gk3JiQK9mX' },
  { id: 'cron-038', semana: 'Semana 20', area: 'Clínica', aula: 'Doenças Clínicas do Intestino', bonus: 'Colite Pseudomembranosa, Síndrome do Intestino Irritável', driveId: '1fdlXnVUnan8cx7l3Nwmyk00G7xAY4JIl' },
  { id: 'cron-039', semana: 'Semana 21', area: 'Clínica', aula: 'Doenças Cirúrgicas do Intestino I - Vascular e Obstrução', bonus: 'Ingestão de Corpo Estranho', driveId: '1_p5oHxLzjnXM2Ym-d_lEbG67fOY6oauP' },
  { id: 'cron-040', semana: 'Semana 21', area: 'GO', aula: 'Sangramentos na Gravidez - Parte I', bonus: '-', driveId: '1URlsIuQYWg9s7nEtj97R_UHa7dnklObs' },
  { id: 'cron-041', semana: 'Semana 22', area: 'Clínica', aula: 'Doenças Cirúrgicas do Intestino II - Diverticulose, Polipose, Câncer e Apendicite Aguda', bonus: 'Hemorragia Digestiva Baixa, Síndrome Carcinoide, Tumores do Apêndice', driveId: '1xQvV7EawmFWfUj5qyxWokBpyHmhCqsbh' },
  { id: 'cron-042', semana: 'Semana 22', area: 'GO', aula: 'Sangramentos na Gravidez - Parte II e Doença Hemolítica Perinatal', bonus: '-', driveId: '1ULZoEYlur3h3OKTRFey_OkzlfM3Pa5BM' },
  { id: 'cron-043', semana: 'Semana 23', area: 'Clínica', aula: 'Pancreatite Aguda e Crônica; Câncer de Pâncreas', bonus: 'Tumores Neuroendócrinos do Pâncreas, Neoplasias Císticas do Pâncreas, Neoplasias das Vias Biliares, Lesão Iatrogênica da Via Biliar, Cistos de Via Biliar, Colangite Esclerosante Primária, Tumores Hepáticos Benignos', driveId: '1qk2yHEn2CrYlwReUZyxFIdH6l02ntLvg' },
  { id: 'cron-044', semana: 'Semana 23', area: 'Clínica', aula: 'Doença das Vias Biliares', bonus: 'As aulas correspondem às mesmas apresentadas no tema acima.', driveId: '1ZdpqCOUBWNAfy_UxgvceCSOXhTBXJGEb' },
  { id: 'cron-045', semana: 'Semana 24', area: 'Clínica', aula: 'Introdução à Hepatologia; Hepatites Virais', bonus: 'Insuficiência Hepática Aguda' },
  { id: 'cron-046', semana: 'Semana 24', area: 'Clínica', aula: 'Cirrose e suas Causas', bonus: 'Hepatite Medicamentosa' },
  { id: 'cron-047', semana: 'Semana 25', area: 'Clínica', aula: 'Cirrose e suas Complicações / Hipertensão Porta (Tratamento Clínico e Cirúrgico); Ascite; Encefalopatia', bonus: 'Tumores Hepáticos Malignos, Transplante Hepático' },
  { id: 'cron-048', semana: 'Semana 25', area: 'GO', aula: 'Climatério, Distopia e Incontinência Urinária', bonus: 'Osteoporose, Fístulas Genitais e Síndrome da Bexiga Dolorosa, Anatomia em GO - Pelve Óssea, Assoalho e Períneo, Anatomia em GO - Estruturas Pélvicas', driveId: '1uB_ZvKDrWb5q8n29b-ZTXiVXpuYA3RUU' },
  { id: 'cron-049', semana: 'Semana 26', area: 'Clínica', aula: 'Arritmias I (Taquiarritmias)', bonus: 'Bloqueios de Ramo' },
  { id: 'cron-050', semana: 'Semana 26', area: 'Pediatria', aula: 'Distúrbios do Crescimento: Desnutrição e Baixa Estatura', bonus: 'Carência de Micronutrientes, Síndromes Genéticas', driveId: '1F7KuoL17uLsEYSUqk3Hqaika16a4CfZb' },
  { id: 'cron-051', semana: 'Semana 27', area: 'Clínica', aula: 'Arritmias II (Bradiarritmias) + PCR', bonus: 'Marca-Passo: Conceitos Básicos, Marca-Passo: Funcionamento do Marca-Passo Definitivo, Síncope' },
  { id: 'cron-052', semana: 'Semana 27', area: 'Pediatria', aula: 'Imunização', bonus: 'Profilaxia para Raiva, Profilaxia para o Tétano Acidental', driveId: '1twV2Pn6-heypPWW9mWkd1QaYEUAq6oLr' },
  { id: 'cron-053', semana: 'Semana 28', area: 'Clínica', aula: 'Insuficiência Cardíaca', bonus: 'Choque em Pediatria, Hipertensão Pulmonar, Cardiomiopatia Dilatada, Cardiomiopatia Hipertrófica, Cardiomiopatia Restritiva, Cardiomiopatia de Estresse (Takotsubo), Insuficiência Cardíaca Aguda, Choque: Monitorização Hemodinâmica e Perfusional, Choque: Tratamento' },
  { id: 'cron-054', semana: 'Semana 28', area: 'GO', aula: 'Doença das Mamas e Ovários', bonus: '-', driveId: '1amDj4Z91efkZhjM-lwJzz30d94s_J6Ib' },
  { id: 'cron-055', semana: 'Semana 29', area: 'Clínica', aula: 'Hipertensão Arterial Sistêmica; Crise Hipertensiva', bonus: '-' },
  { id: 'cron-056', semana: 'Semana 29', area: 'Clínica', aula: 'Valvopatias', bonus: '-' },
  { id: 'cron-057', semana: 'Semana 30', area: 'Clínica', aula: 'Doença Arterial Coronariana: IAM e Angina', bonus: 'Complicações Pós-IAM, Pericardiopatias' },
  { id: 'cron-058', semana: 'Semana 30', area: 'Pediatria', aula: 'Diarreia Aguda e Desidratação na Infância', bonus: 'Constipação na Infância, Diarreia Crônica', driveId: '1g8eI7QbmknoXz6hjK0pIGFnkBRvaN-1T' },
  { id: 'cron-059', semana: 'Semana 31', area: 'Preventiva', aula: 'SUS I - Evolução Histórica e Legislação', bonus: 'Decreto 7.508' },
  { id: 'cron-go-colo-endometrio', semana: 'Semana 31', area: 'GO', aula: 'Lesões Precursoras, Câncer de Colo Uterino e Endométrio', bonus: 'Câncer de Vulva', driveId: '1amDj4Z91efkZhjM-lwJzz30d94s_J6Ib' },
  { id: 'cron-060', semana: 'Semana 32', area: 'Clínica', aula: 'Tireoide', bonus: 'Hipotireoidismo Congênito' },
  { id: 'cron-061', semana: 'Semana 32', area: 'Preventiva', aula: 'SUS II - Atenção Básica e Financiamento', bonus: 'Instrumentos de AB (Tipos de Família), Instrumentos de AB (Ciclo de Vida Familiar), Instrumentos de AB (Apgar Familiar, Practice e Firo), Instrumentos de AB (Escala de Coelho Savassi), Método SOAP, Cofinanciamento Federal da APS' },
  { id: 'cron-062', semana: 'Semana 33', area: 'Pediatria', aula: 'Infecções Respiratórias Agudas - Parte I', bonus: 'Rinite Alérgica, Estridor Crônico e Aspiração de Corpo Estranho, Epistaxe', driveId: '1Bry1uf9pPJ08dJmUduHBk0kIma_I7AhJ' },
  { id: 'cron-063', semana: 'Semana 33', area: 'Clínica', aula: 'Doenças da Suprarrenal', bonus: 'Hipotálamo e Hipófise, Hiperaldosteronismo Primário' },
  { id: 'cron-064', semana: 'Semana 34', area: 'Clínica', aula: 'Diabetes Mellitus', bonus: 'Hipoglicemia, Doença Renal do Diabetes e Retinopatia Diabética, Neuropatia Diabética e Pé Diabético, Dislipidemia' },
  { id: 'cron-065', semana: 'Semana 34', area: 'Pediatria', aula: 'Infecções Respiratórias Agudas - Parte II', bonus: 'Fibrose Cística', driveId: '1aQOxOLJEqVSA80U9j3UeoGVjqMnoe2RT' },
  { id: 'cron-066', semana: 'Semana 35', area: 'Clínica', aula: 'Asma e DPOC', bonus: 'Ventilação Mecânica, Capnografia, USG de Tórax, Insuficiência Respiratória, Síndrome do Desconforto Respiratório Agudo, Provas de Função Pulmonar' },
  { id: 'cron-067', semana: 'Semana 35', area: 'GO', aula: 'Distúrbios Hipertensivos da Gestação, Diabetes e Gemelaridade', bonus: 'Doenças Intercorrentes na Gestação', driveId: '1CPvkV_8svpVD_kNYRtPvdwYvX8Px2zbR' },
  { id: 'cron-068', semana: 'Semana 36', area: 'Clínica', aula: 'Câncer de Pulmão, TEP', bonus: 'Nódulo Pulmonar Solitário, Embolia Gordurosa, Tumores do Mediastino, Pneumopatias Intersticiais Difusas, Sarcoidose, Hemoptise' },
  { id: 'cron-069', semana: 'Semana 36', area: 'Pediatria', aula: 'Nefrologia Pediátrica', bonus: 'Parada Cardiorrespiratória na Infância, Cardiopatias Congênitas, HAS na infância', driveId: '13c2npdUFzPeFf9ODvCZECu9R6TzbxjzX' },
  { id: 'cron-070', semana: 'Semana 37', area: 'Clínica', aula: 'Tuberculose', bonus: 'Influenza, Aspergilose, Histoplasmose, Paracoccidioidomicose, Derrame pleural' },
  { id: 'cron-071', semana: 'Semana 37', area: 'Clínica', aula: 'Pneumonia e Complicações', bonus: 'As aulas correspondem às mesmas apresentadas no tema acima.' },
  { id: 'cron-072', semana: 'Semana 38', area: 'Clínica', aula: 'AIDS', bonus: 'Gastroids, HIV na infância, HTLV, Citomegalovírus' },
  { id: 'cron-073', semana: 'Semana 38', area: 'Clínica', aula: 'Parasitoses Intestinais', bonus: 'Esquistossomose, Toxoplasmose, Acidente por Animais Peçonhentos' },
  { id: 'cron-074', semana: 'Semana 39', area: 'Clínica', aula: 'Endocardite Infecciosa / Meningite', bonus: 'Infecção Relacionada a Cateter, Meningoencefalite Herpética, Abscesso Cerebral, ITU, Sepse e Choque Séptico' },
  { id: 'cron-075', semana: 'Semana 39', area: 'GO', aula: 'Sofrimento Fetal, Avaliação da Vitalidade Fetal, Fórcipe e Puerpério', bonus: 'Distúrbios do Humor e Tromboembolismo', driveId: '1f-s3T30HRFTlDs4g-me1GUhE_6MdwP9u' },
  { id: 'cron-077', semana: 'Semana 40', area: 'Clínica', aula: 'Síndromes Febris', bonus: 'Febre Tifoide, Malária, Febre Maculosa Brasileira, Covid-19, Febre do Oropouche, Doença de Chagas, Leishmaniose Visceral' },
  { id: 'go-ist', semana: 'Semana 40', area: 'GO', aula: 'IST', bonus: 'Síndrome das verrugas genitais', driveId: '13TqD669KoNzlaEqY4bogRFkDLksZKnbY' },
  { id: 'cron-079', semana: 'Semana 41', area: 'Clínica', aula: 'Neurologia I (Cefaleias, Epilepsias)', bonus: 'Tumores do SNC, Vertigem, Hipertensão Intracraniana, Coma, Trombose Venosa Cerebral, Ataque isquêmico transitório, Morte encefálica' },
  { id: 'cron-080', semana: 'Semana 41', area: 'Clínica', aula: 'Neurologia II (Síndromes Neurológicas e AVE)', bonus: 'As aulas correspondem às mesmas apresentadas no tema acima.' },
  { id: 'cron-081', semana: 'Semana 42', area: 'Clínica', aula: 'Neurologia III (Polineuropatias, Demência, Parkinson)', bonus: 'Cuidados paliativos, Distrofias musculares, Hipertermia maligna, Hérnia de disco, Doenças da placa motora' },
  { id: 'cron-082', semana: 'Semana 42', area: 'Pediatria', aula: 'Doenças Exantemáticas na Infância', bonus: 'Febre Sem Sinais de Localização, Erros Inatos da Imunidade, Tumores Abdominais na Infância, Prevenção de Acidentes e Maus-Tratos na Infância', driveId: '1G48v3jMRSWFObFADTPUbhkqn1szomMoC' },
  { id: 'cron-083', semana: 'Semana 43', area: 'Clínica', aula: 'Psiquiatria I', bonus: 'Intoxicações Exógenas, Suicídio, Transtorno de personalidade, Transtornos do Neurodesenvolvimento' },
  { id: 'cron-084', semana: 'Semana 43', area: 'Clínica', aula: 'Psiquiatria II', bonus: 'As aulas correspondem às mesmas apresentadas no tema acima.' },
  { id: 'cron-085', semana: 'Semana 43', area: 'Cirurgia', aula: 'Oftalmologia', bonus: '-' },
  { id: 'cron-086', semana: 'Semana 44', area: 'Cirurgia', aula: 'Especialidade Cirúrgica - Parte I', bonus: 'Cirurgia de Cabeça e Pescoço, Cisto Pilonidal, Câncer de Canal Anal' },
  { id: 'cron-087', semana: 'Semana 44', area: 'Cirurgia', aula: 'Especialidade Cirúrgica - Parte II', bonus: 'As aulas correspondem às mesmas apresentadas no tema acima.' },
  { id: 'cron-088', semana: 'Semana 45', area: 'Clínica', aula: 'Dermatologia I', bonus: 'Anafilaxia, Piodermites, Acne vulgar, Mpox, Herpes-Zóster, Angioedema Hereditário' },
  { id: 'cron-089', semana: 'Semana 45', area: 'Clínica', aula: 'Dermatologia II', bonus: 'As aulas correspondem às mesmas apresentadas no tema acima.' },
  { id: 'cron-090', semana: 'Semana 46', area: 'Cirurgia', aula: 'Ortopedia I', bonus: 'Ortopedia - Doenças periarticulares' },
  { id: 'cron-091', semana: 'Semana 46', area: 'Cirurgia', aula: 'Ortopedia II', bonus: 'As aulas correspondem às mesmas apresentadas no tema acima.' },
];

export const cronogramaData: CronogramaEntry[] = raw.map((r, i) => ({
  ...r,
  id: r.id || `cron-x${String(i).padStart(3, '0')}`,
  aula: r.aula || r.titulo || '',
}));
