import { supabase, type Profile } from '@/lib/supabase';

/**
 * Estado do usuário por perfil.
 *
 * Cada chave é gravada no localStorage (com o id do perfil no nome, para um
 * perfil nunca enxergar os dados de outro) e espelhada na tabela
 * `profile_state` do Supabase. Ao abrir o app, trocar de perfil ou voltar para
 * a aba, o estado é baixado da nuvem — é isso que mantém tudo igual entre
 * dispositivos.
 */

export type StateKey =
  | 'lesson_progress'
  | 'mentor_revisoes'
  | 'custom_drive_urls'
  | 'question_answers';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error';

const ALL_KEYS: StateKey[] = [
  'lesson_progress',
  'mentor_revisoes',
  'custom_drive_urls',
  'question_answers',
];

// Chaves antigas (sem perfil) usadas antes da sincronização por perfil
const LEGACY_KEYS: Partial<Record<StateKey, string>> = {
  lesson_progress: 'santisoft_completed_lessons',
  mentor_revisoes: 'santisoft_mentor_revisoes',
  custom_drive_urls: 'santisoft_custom_drive_urls',
};

const TABLE = 'profile_state';
const LEGACY_FLAG = 'santisoft:legacy_migrated';
const FLUSH_DELAY_MS = 800;
const RETRY_DELAY_MS = 15000;
const MIN_PULL_INTERVAL_MS = 5000;

type Listener = (changed: StateKey | '*') => void;

let active: Profile | null = null;
let status: SyncStatus = 'local';
let lastError = '';
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;
let flushAgain = false;
let lastPullAt = 0;

const listeners = new Set<Listener>();
const statusListeners = new Set<() => void>();

// ---------- localStorage helpers ----------

function storageKey(profileId: string, key: string): string {
  return `santisoft:${profileId}:${key}`;
}

function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* quota / modo privado */
  }
}

function readList(profileId: string, name: string): string[] {
  try {
    const raw = lsGet(storageKey(profileId, name));
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function writeList(profileId: string, name: string, list: string[]): void {
  lsSet(storageKey(profileId, name), JSON.stringify([...new Set(list)]));
}

// ---------- notifications ----------

function emit(changed: StateKey | '*'): void {
  listeners.forEach((l) => l(changed));
  if (typeof window !== 'undefined' && (changed === '*' || changed === 'mentor_revisoes')) {
    window.dispatchEvent(new CustomEvent('santisoft_mentor_updated'));
  }
}

function setStatus(next: SyncStatus, error = ''): void {
  if (status === next && lastError === error) return;
  status = next;
  lastError = error;
  if (error) console.warn('[SantiSOFT] Falha na sincronizacao:', error);
  statusListeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function subscribeStatus(listener: () => void): () => void {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

export function getSyncStatus(): SyncStatus {
  return status;
}

export function getSyncError(): string {
  return lastError;
}

export function getActiveProfileId(): string | null {
  return active?.id ?? null;
}

// ---------- read / write ----------

export function readState<T>(key: StateKey, fallback: T): T {
  if (!active) return fallback;
  try {
    const raw = lsGet(storageKey(active.id, key));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeState<T>(key: StateKey, value: T): void {
  if (!active) return;
  lsSet(storageKey(active.id, key), JSON.stringify(value));
  writeList(active.id, '__dirty', [...readList(active.id, '__dirty'), key]);
  emit(key);
  scheduleFlush(FLUSH_DELAY_MS);
}

// ---------- cloud ----------

function scheduleFlush(delay: number): void {
  if (!supabase) return;
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, delay);
}

/** Envia para a nuvem tudo o que foi alterado neste dispositivo. */
export async function flush(): Promise<void> {
  if (!supabase || !active) return;
  if (flushing) {
    flushAgain = true;
    return;
  }

  const profile = active;
  const dirty = readList(profile.id, '__dirty');
  if (dirty.length === 0) {
    if (status === 'syncing') setStatus('synced');
    return;
  }

  flushing = true;
  setStatus('syncing');

  const snapshot = dirty
    .map((key) => ({ key, json: lsGet(storageKey(profile.id, key)) }))
    .filter((s): s is { key: string; json: string } => s.json !== null);

  const rows = snapshot.map((s) => ({
    profile_id: profile.id,
    key: s.key,
    value: JSON.parse(s.json) as unknown,
    updated_at: new Date().toISOString(),
  }));

  let errorMessage = '';
  try {
    let { error } = await supabase.from(TABLE).upsert(rows, { onConflict: 'profile_id,key' });

    // Perfil criado offline (ou apagado na nuvem): recria e tenta de novo
    if (error && error.code === '23503') {
      const created = await supabase
        .from('profiles')
        .upsert({ id: profile.id, name: profile.name, avatar: profile.avatar }, { onConflict: 'id' });
      if (!created.error) {
        ({ error } = await supabase.from(TABLE).upsert(rows, { onConflict: 'profile_id,key' }));
      }
    }
    if (error) errorMessage = error.message;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  flushing = false;

  if (errorMessage) {
    setStatus('error', errorMessage);
    scheduleFlush(RETRY_DELAY_MS);
  } else {
    // Mantém marcado o que mudou de novo enquanto o envio acontecia
    const still = readList(profile.id, '__dirty').filter((key) => {
      const sent = snapshot.find((s) => s.key === key);
      return !sent || lsGet(storageKey(profile.id, key)) !== sent.json;
    });
    writeList(profile.id, '__dirty', still);
    if (still.length > 0 || flushAgain) scheduleFlush(FLUSH_DELAY_MS);
    else setStatus('synced');
  }
  flushAgain = false;
}

/** Baixa o estado do perfil ativo da nuvem e aplica neste dispositivo. */
export async function pull(force = false): Promise<void> {
  if (!supabase || !active) return;
  const now = Date.now();
  if (!force && now - lastPullAt < MIN_PULL_INTERVAL_MS) return;
  lastPullAt = now;

  const profileId = active.id;
  setStatus('syncing');

  let rows: { key: string; value: unknown }[] | null = null;
  let errorMessage = '';
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('key, value')
      .eq('profile_id', profileId);
    if (error) errorMessage = error.message;
    else rows = (data ?? []) as { key: string; value: unknown }[];
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  if (active?.id !== profileId) return; // trocou de perfil no meio do caminho
  if (!rows) {
    setStatus('error', errorMessage || 'sem resposta');
    return;
  }

  const cloud = new Map(rows.map((r) => [r.key, r.value]));
  const dirty = new Set(readList(profileId, '__dirty'));
  const toMerge = new Set(readList(profileId, '__merge'));
  let changed = false;

  for (const key of ALL_KEYS) {
    const lsKey = storageKey(profileId, key);
    const localJson = lsGet(lsKey);

    if (cloud.has(key)) {
      const cloudValue = cloud.get(key);
      if (toMerge.has(key) && localJson) {
        // Primeira sincronização deste aparelho: junta o que já existia aqui
        const merged = {
          ...(cloudValue as Record<string, unknown>),
          ...(JSON.parse(localJson) as Record<string, unknown>),
        };
        lsSet(lsKey, JSON.stringify(merged));
        dirty.add(key);
        changed = true;
      } else if (!dirty.has(key)) {
        const cloudJson = JSON.stringify(cloudValue);
        if (cloudJson !== localJson) {
          lsSet(lsKey, cloudJson);
          changed = true;
        }
      }
    } else if (localJson && localJson !== '{}' && localJson !== '[]') {
      dirty.add(key); // existe só neste aparelho: envia
    }
  }

  writeList(profileId, '__merge', []);
  writeList(profileId, '__dirty', [...dirty]);
  if (changed) emit('*');

  if (dirty.size > 0) await flush();
  else setStatus('synced');
}

// ---------- profile lifecycle ----------

function migrateLegacy(profileId: string): void {
  if (lsGet(LEGACY_FLAG)) return;
  const merged: string[] = [];
  for (const key of ALL_KEYS) {
    const legacyKey = LEGACY_KEYS[key];
    if (!legacyKey) continue;
    const raw = lsGet(legacyKey);
    if (raw && raw !== '{}' && !lsGet(storageKey(profileId, key))) {
      lsSet(storageKey(profileId, key), raw);
      merged.push(key);
    }
  }
  writeList(profileId, '__merge', merged);
  lsSet(LEGACY_FLAG, '1');
}

export function activateProfile(profile: Profile | null): void {
  if ((profile?.id ?? null) === (active?.id ?? null)) {
    if (profile) active = profile;
    return;
  }

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (active) void flush(); // garante o envio do perfil anterior

  active = profile;
  setStatus('local');
  if (profile) migrateLegacy(profile.id);
  emit('*');
  if (profile) void pull(true);
}

if (typeof window !== 'undefined') {
  const refresh = () => {
    if (document.visibilityState === 'visible') void pull();
    else void flush();
  };
  window.addEventListener('focus', () => void pull());
  window.addEventListener('online', () => void pull(true));
  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('pagehide', () => void flush());
}
