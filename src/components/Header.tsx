import { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Calendar,
  BookOpen,
  Brain,
  RotateCcw,
  FileText,
  RefreshCw,
  Users,
} from 'lucide-react';
import type { Profile } from '@/lib/supabase';
import { SantiSoftLogo } from '@/components/Logo';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { useSyncStatus } from '@/hooks/useProfileState';

interface HeaderProps {
  onToggleSidebar: () => void;
  onSelectCronograma: () => void;
  onSelectQuestoes: () => void;
  onSelectMentor?: () => void;
  onSelectCasalMed?: () => void;
  isCronograma: boolean;
  isQuestoes: boolean;
  isMentor?: boolean;
  isCasalMed?: boolean;
  onResetProgress?: () => void;
  activeProfile: Profile | null;
  onSwitchProfile: () => void;
}

export function Header({
  onToggleSidebar,
  onSelectCronograma,
  onSelectQuestoes,
  onSelectMentor,
  onSelectCasalMed,
  isCronograma,
  isQuestoes,
  isMentor,
  isCasalMed,
  onResetProgress,
  activeProfile,
  onSwitchProfile,
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showProfileMenu]);

  const sync = useSyncStatus();
  const syncLabel =
    sync.status === 'synced'
      ? 'Sincronizado na nuvem'
      : sync.status === 'syncing'
        ? 'Sincronizando...'
        : sync.status === 'error'
          ? 'Sem conexão com a nuvem'
          : 'Salvo só neste aparelho';
  const syncColor =
    sync.status === 'synced'
      ? 'text-emerald-500'
      : sync.status === 'syncing'
        ? 'text-zinc-400'
        : 'text-amber-500';

  const profileName = activeProfile?.name ?? '';
  const profileInitial = profileName.charAt(0).toUpperCase();
  const profileAvatar = activeProfile?.avatar ?? '#dc2626';

  return (
    <header className="bg-ink-900/95 backdrop-blur-md border-b border-ink-875 px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2.5 sm:gap-4 shrink-0 safe-top select-none z-20 hide-on-landscape">
      {/* Left: SantiSOFT Brand Logo */}
      <div className="flex items-center gap-2">
        <SantiSoftLogo size={36} showText={true} />
      </div>

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Desktop Quick Nav Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onSelectCronograma}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              isCronograma
                ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                : 'text-zinc-300 hover:text-white bg-ink-850 border border-ink-800 hover:border-ink-700'
            }`}
            title="Ir para o Cronograma"
          >
            <Calendar className={`w-3.5 h-3.5 ${isCronograma ? 'text-white' : 'text-red-500'}`} />
            <span>Cronograma</span>
          </button>

          <button
            onClick={onSelectQuestoes}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              isQuestoes
                ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                : 'text-zinc-300 hover:text-white bg-ink-850 border border-ink-800 hover:border-ink-700'
            }`}
            title="Abrir Banco de Questões"
          >
            <BookOpen className={`w-3.5 h-3.5 ${isQuestoes ? 'text-white' : 'text-red-500'}`} />
            <span>Questões</span>
          </button>

          {onSelectMentor && (
            <button
              onClick={onSelectMentor}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                isMentor
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'text-zinc-300 hover:text-white bg-ink-850 border border-ink-800 hover:border-ink-700'
              }`}
              title="Abrir Aba do Mentor Inteligente"
            >
              <Brain className={`w-3.5 h-3.5 ${isMentor ? 'text-white' : 'text-red-500'}`} />
              <span>Mentor</span>
            </button>
          )}

          {onSelectCasalMed && (
            <button
              onClick={onSelectCasalMed}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                isCasalMed
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                  : 'text-zinc-300 hover:text-white bg-ink-850 border border-ink-800 hover:border-ink-700'
              }`}
              title="CASALMED — Resumos 2026"
            >
              <FileText className={`w-3.5 h-3.5 ${isCasalMed ? 'text-white' : 'text-red-500'}`} />
              <span>CasalMed</span>
            </button>
          )}

          {/* Profile Selector + Switch (Desktop) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-ink-850 border border-ink-800 hover:border-ink-700 text-zinc-300 hover:text-white transition-all"
              title={profileName}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 text-white"
                style={{ backgroundColor: profileAvatar }}
              >
                {profileInitial}
              </span>
              <span className="hidden lg:inline max-w-[100px] truncate">{profileName}</span>
              <RefreshCw className="w-3 h-3 text-emerald-500 shrink-0" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-ink-900 border border-ink-800 shadow-2xl overflow-hidden z-50 animate-scale-up">
                <div className="px-4 py-3 border-b border-ink-875">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: profileAvatar }}
                    >
                      {profileInitial}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{profileName}</div>
                      <div
                        className={`text-[10px] ${syncColor} flex items-center gap-1`}
                        title={sync.error || undefined}
                      >
                        <RefreshCw className={`w-3 h-3 ${sync.status === 'syncing' ? 'animate-spin' : ''}`} />
                        {syncLabel}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setShowProfileMenu(false); onSwitchProfile(); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-ink-850 transition-colors"
                >
                  <Users className="w-4 h-4 text-red-500" />
                  Trocar Perfil
                </button>
              </div>
            )}
          </div>

          <PWAInstallButton />

          {onResetProgress && (
            <button
              onClick={onResetProgress}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-ink-850 transition-colors"
              title="Limpar Progresso (Resetar)"
              aria-label="Limpar Progresso"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Profile avatar button (mobile) */}
          <button
            onClick={onSwitchProfile}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold text-white shrink-0 active:scale-95 transition-all shadow-sm"
            style={{ backgroundColor: profileAvatar }}
            title={`Perfil: ${profileName} (trocar)`}
            aria-label="Trocar perfil"
          >
            {profileInitial}
          </button>
          <PWAInstallButton />

          {onResetProgress && (
            <button
              onClick={onResetProgress}
              className="w-10 h-10 rounded-xl bg-ink-850 border border-ink-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 active:bg-ink-800 active:scale-95 transition-all shadow-sm shrink-0"
              title="Limpar Progresso"
              aria-label="Limpar Progresso"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Hamburger Drawer Button */}
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 rounded-xl bg-ink-850 border border-ink-800 flex items-center justify-center text-zinc-200 hover:text-white active:bg-ink-800 active:scale-95 transition-all shadow-sm shrink-0"
            aria-label="Abrir Menu de Disciplinas"
            title="Menu"
          >
            <Menu className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
