import { useState, useMemo, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { VideoPlayer } from '@/components/VideoPlayer';
import { CronogramaScreen } from '@/components/CronogramaScreen';
import { QuestoesScreen, type RevisionExamConfig } from '@/components/QuestoesScreen';
import { MentorInteligenteTab } from '@/components/MentorInteligenteTab';
import { CasalMedView } from '@/components/CasalMedView';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ProfileSelector } from '@/components/ProfileSelector';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { curriculum } from '@/data/curriculum';
import type { FlatLessonItem } from '@/components/VideoPlayer';
import type { Profile } from '@/lib/supabase';
import {
  registrarConclusaoAula,
  removerConclusaoAula,
  saveMentorStore,
  type RevisaoPendente,
} from '@/services/mentorService';
import { isLessonCompleted } from '@/types';

type ActiveTab = 'cronograma' | 'aula' | 'questoes' | 'mentor' | 'casalmed';

interface Selection {
  areaId: string;
  moduleId: string;
  lessonId: string;
}

export default function App() {
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Navigation active tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('cronograma');
  const [currentRevision, setCurrentRevision] = useState<RevisionExamConfig | null>(null);

  // Default lesson selection
  const [selection, setSelection] = useState<Selection>(() => {
    const pedArea = curriculum.find((a) => a.id === 'pediatria') ?? curriculum[0];
    const firstMod = pedArea.modules[0];
    const firstLesson = firstMod.lessons[0];
    return { areaId: pedArea.id, moduleId: firstMod.id, lessonId: firstLesson.id };
  });

  const {
    progress,
    toggleLessonCompletion,
    clearProgress,
    mentorMessages,
    addMentorMessage,
    clearMentorMessages,
  } = useSupabaseSync(activeProfile);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Check for active profile in localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem('active_profile_id');
    const savedName = localStorage.getItem('active_profile_name');
    const savedAvatar = localStorage.getItem('active_profile_avatar');

    if (savedId && savedName) {
      setActiveProfile({
        id: savedId,
        name: savedName,
        avatar: savedAvatar || '#dc2626',
      });
    } else {
      setShowProfileSelector(true);
    }
  }, []);

  const handleSelectProfile = useCallback((profile: Profile) => {
    setActiveProfile(profile);
    setShowProfileSelector(false);
  }, []);

  const handleSwitchProfile = useCallback(() => {
    setShowProfileSelector(true);
  }, []);

  const currentArea = useMemo(
    () => curriculum.find((a) => a.id === selection?.areaId) ?? null,
    [selection],
  );

  const currentLesson = useMemo(() => {
    if (!currentArea || !selection) return null;
    const mod = currentArea.modules.find((m) => m.id === selection.moduleId);
    return mod?.lessons.find((l) => l.id === selection.lessonId) ?? null;
  }, [currentArea, selection]);

  const isCurrentCompleted = useMemo(() => {
    if (!selection) return false;
    return isLessonCompleted(progress, selection.lessonId);
  }, [selection, progress]);

  // Flat list of all lessons with metadata for the lesson selector
  const flatLessonList = useMemo<FlatLessonItem[]>(() => {
    const list: FlatLessonItem[] = [];
    for (const area of curriculum) {
      for (const mod of area.modules) {
        for (const lesson of mod.lessons) {
          list.push({
            areaId: area.id,
            moduleId: mod.id,
            lessonId: lesson.id,
            areaName: area.name,
            lessonNumber: lesson.number,
            lessonTitle: lesson.title,
          });
        }
      }
    }
    return list;
  }, []);

  const currentIndex = useMemo(
    () => flatLessonList.findIndex((l) => l.lessonId === selection?.lessonId),
    [flatLessonList, selection],
  );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < flatLessonList.length - 1;

  const handleSelectLesson = useCallback((areaId: string, moduleId: string, lessonId: string) => {
    setSelection({ areaId, moduleId, lessonId });
    setActiveTab('aula');
    setMobileSidebarOpen(false);
  }, []);

  const handleSelectCronograma = useCallback(() => {
    setActiveTab('cronograma');
    setMobileSidebarOpen(false);
  }, []);

  const handleSelectQuestoes = useCallback(() => {
    setCurrentRevision(null);
    setActiveTab('questoes');
    setMobileSidebarOpen(false);
  }, []);

  const handleSelectMentor = useCallback(() => {
    setActiveTab('mentor');
    setMobileSidebarOpen(false);
  }, []);

  const handleSelectCasalMed = useCallback(() => {
    setActiveTab('casalmed');
    setMobileSidebarOpen(false);
  }, []);

  // Inicia revisão agendada pelo Mentor Inteligente
  const handleStartRevision = useCallback((revisao: RevisaoPendente) => {
    setCurrentRevision({
      temaId: revisao.temaId,
      tema: revisao.tema,
      especialidade: revisao.especialidade,
      ciclo: revisao.ciclo,
      diasCiclo: revisao.diasCiclo,
      autoStart: true,
    });
    setActiveTab('questoes');
    setMobileSidebarOpen(false);
  }, []);

  // Toggle lesson completion — updates local state + syncs to Supabase in background
  const handleToggleComplete = useCallback(
    (id: string) => {
      const isDone = isLessonCompleted(progress, id);
      toggleLessonCompletion(id, isDone);

      if (!isDone) {
        registrarConclusaoAula(id);
      } else {
        removerConclusaoAula(id);
      }
    },
    [progress, toggleLessonCompletion],
  );

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      const item = flatLessonList[currentIndex - 1];
      setSelection({ areaId: item.areaId, moduleId: item.moduleId, lessonId: item.lessonId });
      setActiveTab('aula');
      setMobileSidebarOpen(false);
    }
  }, [hasPrev, flatLessonList, currentIndex]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      const item = flatLessonList[currentIndex + 1];
      setSelection({ areaId: item.areaId, moduleId: item.moduleId, lessonId: item.lessonId });
      setActiveTab('aula');
      setMobileSidebarOpen(false);
    }
  }, [hasNext, flatLessonList, currentIndex]);

  const handleJumpToLesson = useCallback((item: FlatLessonItem) => {
    setSelection({ areaId: item.areaId, moduleId: item.moduleId, lessonId: item.lessonId });
    setActiveTab('aula');
    setMobileSidebarOpen(false);
  }, []);

  // Fecho automático da barra lateral ao rodar o ecrã (Landscape) ou ao redimensionar
  useEffect(() => {
    const handleOrientationOrResize = () => {
      if (typeof window === 'undefined') return;
      const isLandscape =
        (window.matchMedia && window.matchMedia('(orientation: landscape)').matches) ||
        (window.innerHeight < 500 && window.innerWidth > window.innerHeight);

      if (isLandscape) {
        setMobileSidebarOpen(false);
      }
    };

    handleOrientationOrResize();

    window.addEventListener('resize', handleOrientationOrResize);
    window.addEventListener('orientationchange', handleOrientationOrResize);

    const mql =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(orientation: landscape)')
        : null;
    mql?.addEventListener?.('change', handleOrientationOrResize);

    return () => {
      window.removeEventListener('resize', handleOrientationOrResize);
      window.removeEventListener('orientationchange', handleOrientationOrResize);
      mql?.removeEventListener?.('change', handleOrientationOrResize);
    };
  }, []);

  // Fecho automático da barra lateral ao entrar na visualização da Aula
  useEffect(() => {
    if (activeTab === 'aula') {
      setMobileSidebarOpen(false);
    }
  }, [activeTab]);

  const handleResetAllData = useCallback(() => {
    // Limpa aulas concluídas e revisões agendadas do perfil atual (local + nuvem)
    clearProgress();
    saveMentorStore({});
    setShowResetConfirm(false);
  }, [clearProgress]);

  // Show profile selector as blocking screen if no profile is active
  if (showProfileSelector || !activeProfile) {
    return <ProfileSelector onSelectProfile={handleSelectProfile} />;
  }

  return (
    <div className="h-screen flex flex-col bg-ink-950 overflow-hidden text-white font-sans antialiased overflow-x-hidden w-full">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
        onSelectCronograma={handleSelectCronograma}
        onSelectQuestoes={handleSelectQuestoes}
        onSelectMentor={handleSelectMentor}
        onSelectCasalMed={handleSelectCasalMed}
        isCronograma={activeTab === 'cronograma'}
        isQuestoes={activeTab === 'questoes'}
        isMentor={activeTab === 'mentor'}
        isCasalMed={activeTab === 'casalmed'}
        onResetProgress={() => setShowResetConfirm(true)}
        activeProfile={activeProfile}
        onSwitchProfile={handleSwitchProfile}
      />

      {/* Main Container */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative overflow-x-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex hide-on-landscape">
          <Sidebar
            curriculum={curriculum}
            selectedLessonId={selection?.lessonId ?? null}
            progress={progress}
            onSelectLesson={handleSelectLesson}
            onSelectCronograma={handleSelectCronograma}
            onSelectQuestoes={handleSelectQuestoes}
            onSelectMentor={handleSelectMentor}
            onSelectCasalMed={handleSelectCasalMed}
            isCronogramaActive={activeTab === 'cronograma'}
            isQuestoesActive={activeTab === 'questoes'}
            isMentorActive={activeTab === 'mentor'}
            isCasalMedActive={activeTab === 'casalmed'}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
            activeProfile={activeProfile}
            onSwitchProfile={handleSwitchProfile}
          />
        </div>

        {/* Mobile / Landscape Overlay Drawer with Backdrop */}
        {mobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm h-full bg-ink-900 shadow-2xl animate-slide-in flex flex-col overflow-hidden md:hidden">
              <Sidebar
                curriculum={curriculum}
                selectedLessonId={selection?.lessonId ?? null}
                progress={progress}
                onSelectLesson={handleSelectLesson}
                onSelectCronograma={handleSelectCronograma}
                onSelectQuestoes={handleSelectQuestoes}
                onSelectMentor={handleSelectMentor}
                onSelectCasalMed={handleSelectCasalMed}
                isCronogramaActive={activeTab === 'cronograma'}
                isQuestoesActive={activeTab === 'questoes'}
                isMentorActive={activeTab === 'mentor'}
                isCasalMedActive={activeTab === 'casalmed'}
                collapsed={false}
                onToggleCollapse={() => setMobileSidebarOpen(false)}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setMobileSidebarOpen(false)}
                activeProfile={activeProfile}
                onSwitchProfile={handleSwitchProfile}
              />
            </div>
          </>
        )}

        {/* Center Content */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto relative z-0 overflow-x-hidden pb-14 md:pb-0">
          {activeTab === 'cronograma' && (
            <CronogramaScreen
              progress={progress}
              onToggleComplete={handleToggleComplete}
            />
          )}

          {activeTab === 'aula' && (
            <VideoPlayer
              lesson={currentLesson}
              isCompleted={isCurrentCompleted}
              onToggleComplete={() => selection && handleToggleComplete(selection.lessonId)}
              onPrev={handlePrev}
              onNext={handleNext}
              hasPrev={hasPrev}
              hasNext={hasNext}
              flatLessonList={flatLessonList}
              currentIndex={currentIndex}
              onJumpToLesson={handleJumpToLesson}
            />
          )}

          {activeTab === 'questoes' && (
            <QuestoesScreen
              initialRevision={currentRevision}
              onClearRevision={() => setCurrentRevision(null)}
              onGoBackToCronograma={() => {
                setCurrentRevision(null);
                setActiveTab('cronograma');
              }}
            />
          )}

          {activeTab === 'mentor' && (
            <MentorInteligenteTab
              onIniciarRevisao={handleStartRevision}
              onGoBackToCronograma={handleSelectCronograma}
              onGoToQuestoes={handleSelectQuestoes}
              mentorMessages={mentorMessages}
              onAddMentorMessage={addMentorMessage}
              onClearMentorMessages={clearMentorMessages}
            />
          )}

          {activeTab === 'casalmed' && (
            <CasalMedView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectCronograma={handleSelectCronograma}
        onSelectVideoPlayer={() => {
          setActiveTab('aula');
          setMobileSidebarOpen(false);
        }}
        onSelectQuestoes={handleSelectQuestoes}
        onSelectMentor={handleSelectMentor}
        onSelectCasalMed={handleSelectCasalMed}
      />

      {/* Confirmation Modal to Reset Local Progress */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm safe-top safe-bottom">
          <div className="w-full max-w-sm rounded-2xl bg-ink-900 border border-ink-850 p-6 shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-base font-bold text-white">
              Limpar aulas concluídas?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Todas as marcações de aulas concluídas serão resetadas. Esta ação remove o progresso local e na nuvem do perfil atual.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold bg-ink-850 text-zinc-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleResetAllData}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/30"
              >
                Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
