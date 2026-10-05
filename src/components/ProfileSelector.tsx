import { useState, useEffect, useCallback } from 'react';
import { Plus, Check, X, User as UserIcon, Loader2, Pencil, Trash2 } from 'lucide-react';
import { supabase, isSupabaseAvailable, type Profile } from '@/lib/supabase';
import { SantiSoftLogo } from '@/components/Logo';

interface ProfileSelectorProps {
  onSelectProfile: (profile: Profile) => void;
}

const AVATAR_COLORS = [
  '#dc2626', // red-600
  '#2563eb', // blue-600
  '#16a34a', // green-600
  '#ca8a04', // yellow-600
  '#9333ea', // purple-600
  '#0891b2', // cyan-600
  '#ea580c', // orange-600
  '#db2777', // pink-600
];

const STORAGE_KEY = 'active_profile_id';
const STORAGE_NAME_KEY = 'active_profile_name';
const STORAGE_AVATAR_KEY = 'active_profile_avatar';

export function ProfileSelector({ onSelectProfile }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(AVATAR_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Load profiles from Supabase (or localStorage fallback)
  const loadProfiles = useCallback(async () => {
    setLoading(true);

    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar, created_at')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setProfiles(data as Profile[]);
        setLoading(false);
        return;
      }
    }

    // Fallback: localStorage profiles
    try {
      const raw = localStorage.getItem('santisoft_profiles');
      const local = raw ? (JSON.parse(raw) as Profile[]) : [];
      setProfiles(local);
    } catch {
      setProfiles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const saveLocalProfiles = (list: Profile[]) => {
    try {
      localStorage.setItem('santisoft_profiles', JSON.stringify(list));
    } catch { /* ignore */ }
  };

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setCreating(true);

    if (isSupabaseAvailable && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .insert({ name: trimmed, avatar: newColor })
        .select('id, name, avatar, created_at')
        .maybeSingle();

      if (!error && data) {
        const newProfile = data as Profile;
        setProfiles((prev) => [...prev, newProfile]);
        setCreating(false);
        setNewName('');
        setShowCreateForm(false);
        return;
      }
    }

    // Fallback: create locally
    const localProfile: Profile = {
      id: crypto.randomUUID(),
      name: trimmed,
      avatar: newColor,
      created_at: new Date().toISOString(),
    };
    const updated = [...profiles, localProfile];
    setProfiles(updated);
    saveLocalProfiles(updated);
    setCreating(false);
    setNewName('');
    setShowCreateForm(false);
  };

  const handleSelect = (profile: Profile) => {
    localStorage.setItem(STORAGE_KEY, profile.id);
    localStorage.setItem(STORAGE_NAME_KEY, profile.name);
    localStorage.setItem(STORAGE_AVATAR_KEY, profile.avatar);
    onSelectProfile(profile);
  };

  const handleDelete = async (profileId: string) => {
    if (isSupabaseAvailable && supabase) {
      await supabase.from('profiles').delete().eq('id', profileId);
    }

    const updated = profiles.filter((p) => p.id !== profileId);
    setProfiles(updated);
    if (!isSupabaseAvailable) saveLocalProfiles(updated);

    const activeId = localStorage.getItem(STORAGE_KEY);
    if (activeId === profileId) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_NAME_KEY);
      localStorage.removeItem(STORAGE_AVATAR_KEY);
    }
  };

  const handleRename = async (profileId: string) => {
    const trimmed = editName.trim();
    if (!trimmed) return;

    if (isSupabaseAvailable && supabase) {
      await supabase.from('profiles').update({ name: trimmed }).eq('id', profileId);
    }

    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, name: trimmed } : p))
    );
    if (!isSupabaseAvailable) {
      const updated = profiles.map((p) => (p.id === profileId ? { ...p, name: trimmed } : p));
      saveLocalProfiles(updated);
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950 p-4 safe-top safe-bottom">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <SantiSoftLogo size={56} showText={true} />
          <p className="text-sm text-zinc-500">Quem esta estudando?</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-400">
            <Loader2 className="w-5 h-5 animate-spin text-red-500" />
            <span className="text-sm">Carregando perfis...</span>
          </div>
        ) : (
          <>
            {/* Profile Grid */}
            {profiles.length > 0 && (
              <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6 mb-6 max-w-xl">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="group flex flex-col items-center gap-2 relative"
                  >
                    <button
                      onClick={() => handleSelect(profile)}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all active:scale-95 hover:scale-105"
                      style={{ backgroundColor: profile.avatar + '30', border: `2px solid ${profile.avatar}` }}
                    >
                      <span
                        className="text-2xl sm:text-3xl font-extrabold"
                        style={{ color: profile.avatar }}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    </button>

                    {/* Edit / Delete buttons (appear on hover) */}
                    <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingId(profile.id); setEditName(profile.name); }}
                        className="w-6 h-6 rounded-lg bg-ink-850 border border-ink-800 flex items-center justify-center text-zinc-400 hover:text-white"
                        title="Renomear"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="w-6 h-6 rounded-lg bg-ink-850 border border-red-900/50 flex items-center justify-center text-red-400 hover:text-red-300"
                        title="Excluir"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {editingId === profile.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(profile.id);
                            if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                          }}
                          className="w-20 h-7 px-2 rounded-lg bg-ink-850 border border-ink-800 text-xs text-white text-center focus:outline-none focus:border-red-600/50"
                        />
                        <button
                          onClick={() => handleRename(profile.id)}
                          className="w-6 h-6 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-zinc-300 max-w-[80px] truncate text-center">
                        {profile.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Create New Profile */}
            {showCreateForm ? (
              <div className="w-full max-w-xs rounded-2xl bg-ink-900 border border-ink-800 p-5 space-y-4 animate-scale-up">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Novo Perfil</h3>
                  <button
                    onClick={() => { setShowCreateForm(false); setNewName(''); }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-ink-850"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                  placeholder="Digite o nome..."
                  maxLength={20}
                  className="w-full h-11 px-4 rounded-xl bg-ink-850 border border-ink-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/30 transition-all"
                />

                <div>
                  <p className="text-xs text-zinc-500 mb-2">Escolha uma cor:</p>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewColor(color)}
                        className={`w-8 h-8 rounded-full transition-all active:scale-90 ${
                          newColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-ink-900' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                  className="w-full h-11 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Criar Perfil
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-ink-700 hover:border-red-600/50 flex items-center justify-center text-zinc-600 hover:text-red-500 transition-all active:scale-95 group-hover:scale-105">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  Criar Novo Perfil
                </span>
              </button>
            )}

            {/* Empty state hint */}
            {profiles.length === 0 && !showCreateForm && (
              <div className="mt-6 flex flex-col items-center gap-2 text-center">
                <UserIcon className="w-8 h-8 text-zinc-700" />
                <p className="text-xs text-zinc-500 max-w-[260px]">
                  Crie um perfil para sincronizar seu progresso entre celular, iPad e computador.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
