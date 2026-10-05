/*
# SantiSOFT — estado por perfil sincronizado na nuvem

Cria a tabela `profile_state`: uma linha por (perfil, chave) guardando em JSON
tudo o que o usuário mexe no app (aulas concluídas, revisões do Mentor,
respostas das questões, links personalizados). É ela que faz o progresso
aparecer igual em qualquer dispositivo.

Segue o mesmo modelo de segurança das tabelas `profiles` e `mentor_chats`
(app sem tela de login, acesso pelo papel anon).

Pode ser executado mais de uma vez sem problema.
*/

CREATE TABLE IF NOT EXISTS profile_state (
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, key)
);

ALTER TABLE profile_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profile_state" ON profile_state;
CREATE POLICY "anon_select_profile_state"
ON profile_state FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profile_state" ON profile_state;
CREATE POLICY "anon_insert_profile_state"
ON profile_state FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profile_state" ON profile_state;
CREATE POLICY "anon_update_profile_state"
ON profile_state FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profile_state" ON profile_state;
CREATE POLICY "anon_delete_profile_state"
ON profile_state FOR DELETE
TO anon, authenticated USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON profile_state TO anon, authenticated;
