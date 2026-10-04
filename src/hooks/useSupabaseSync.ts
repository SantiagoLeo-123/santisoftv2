import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseAvailable, type Profile, type MentorMessage } from '@/lib/supabase';
import type { ProgressMap } from '@/types';

const LOCAL_PROGRESS_KEY = 'santisoft_completed_lessons';
const LOCAL_MENTOR_KEY = 'santisoft_mentor_chats';

interface UseSupabaseSyncReturn {
  // Lesson progress
  progress: ProgressMap;
  toggleLessonCompletion: (lessonId: string, currentStatus: boolean) => void;
  syncProgressFromCloud: () => Promise<void>;
  progressLoaded: boolean;

  // Mentor chats
  mentorMessages: MentorMessage[];
  addMentorMessage: (msg: Omit<MentorMessage, 'id' | 'created_at' | 'profile_id'>) => void;
  clearMentorMessages: () => void;
  mentorLoaded: boolean;
}

export function useSupabaseSync(activeProfile: Profile | null): UseSupabaseSyncReturn {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([]);
  const [mentorLoaded, setMentorLoaded] = useState(false);

  // ---- Load local progress as baseline ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
      setProgress(raw ? JSON.parse(raw) as ProgressMap : {});
    } catch {
      setProgress({});
    }
    setProgressLoaded(true);
  }, []);

  // ---- Sync lesson progress from cloud when profile is active ----
  const syncProgressFromCloud = useCallback(async () => {
    if (!activeProfile || !isSupabaseAvailable || !supabase) return;

    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select('lesson_id, completed')
      .eq('profile_id', activeProfile.id)
      .eq('completed', true);

    if (error || !data) return;

    const cloudMap: ProgressMap = {};
    for (const row of data) {
      cloudMap[(row as { lesson_id: string; completed: boolean }).lesson_id] =
        (row as { lesson_id: string; completed: boolean }).completed;
    }

    // Merge: cloud takes priority, but keep any local-only entries
    setProgress((prev) => {
      const merged = { ...prev };
      for (const [id, done] of Object.entries(cloudMap)) {
        merged[id] = done;
      }
      try {
        localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(merged));
      } catch { /* ignore */ }
      return merged;
    });
  }, [activeProfile]);

  useEffect(() => {
    if (activeProfile) {
      syncProgressFromCloud();
    }
  }, [activeProfile, syncProgressFromCloud]);

  // ---- Persist progress to localStorage on every change ----
  useEffect(() => {
    if (!progressLoaded) return;
    try {
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progress));
    } catch { /* ignore */ }
  }, [progress, progressLoaded]);

  // ---- Toggle lesson completion (local + cloud upsert) ----
  const toggleLessonCompletion = useCallback(
    (lessonId: string, currentStatus: boolean) => {
      const nextStatus = !currentStatus;

      // Update local state immediately
      setProgress((prev) => {
        const updated = { ...prev, [lessonId]: nextStatus };
        try {
          localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(updated));
        } catch { /* ignore */ }
        return updated;
      });

      // Sync to cloud if profile + supabase available
      if (activeProfile && isSupabaseAvailable && supabase) {
        if (nextStatus) {
          supabase
            .from('user_lesson_progress')
            .upsert(
              {
                profile_id: activeProfile.id,
                lesson_id: lessonId,
                completed: true,
              },
              { onConflict: 'profile_id,lesson_id' }
            )
            .then(({ error }) => {
              if (error) console.warn('[SantiSOFT] Erro ao salvar aula na nuvem:', error.message);
            });
        } else {
          supabase
            .from('user_lesson_progress')
            .delete()
            .eq('profile_id', activeProfile.id)
            .eq('lesson_id', lessonId)
            .then(({ error }) => {
              if (error) console.warn('[SantiSOFT] Erro ao remover aula da nuvem:', error.message);
            });
        }
      }
    },
    [activeProfile]
  );

  // ---- Load mentor chats from cloud ----
  useEffect(() => {
    // Always load local first
    try {
      const raw = localStorage.getItem(LOCAL_MENTOR_KEY);
      const local = raw ? (JSON.parse(raw) as MentorMessage[]) : [];
      setMentorMessages(local);
    } catch {
      setMentorMessages([]);
    }
    setMentorLoaded(true);

    // Then sync from cloud if profile is active
    if (!activeProfile || !isSupabaseAvailable || !supabase) return;

    (async () => {
      const { data, error } = await supabase
        .from('mentor_chats')
        .select('id, profile_id, role, content, created_at')
        .eq('profile_id', activeProfile.id)
        .order('created_at', { ascending: true });

      if (error || !data) return;

      const cloudMessages = data as MentorMessage[];
      setMentorMessages(cloudMessages);

      // Save to localStorage as backup
      try {
        localStorage.setItem(LOCAL_MENTOR_KEY, JSON.stringify(cloudMessages));
      } catch { /* ignore */ }
    })();
  }, [activeProfile]);

  // ---- Add mentor message (local + cloud) ----
  const addMentorMessage = useCallback(
    (msg: Omit<MentorMessage, 'id' | 'created_at' | 'profile_id'>) => {
      const fullMsg: MentorMessage = {
        ...msg,
        profile_id: activeProfile?.id ?? '',
        created_at: new Date().toISOString(),
      };

      setMentorMessages((prev) => {
        const updated = [...prev, fullMsg];
        try {
          localStorage.setItem(LOCAL_MENTOR_KEY, JSON.stringify(updated));
        } catch { /* ignore */ }
        return updated;
      });

      if (activeProfile && isSupabaseAvailable && supabase) {
        supabase
          .from('mentor_chats')
          .insert({
            profile_id: activeProfile.id,
            role: msg.role,
            content: msg.content,
          })
          .then(({ error }) => {
            if (error) console.warn('[SantiSOFT] Erro ao salvar mensagem na nuvem:', error.message);
          });
      }
    },
    [activeProfile]
  );

  // ---- Clear mentor messages ----
  const clearMentorMessages = useCallback(() => {
    setMentorMessages([]);
    localStorage.removeItem(LOCAL_MENTOR_KEY);

    if (activeProfile && isSupabaseAvailable && supabase) {
      supabase
        .from('mentor_chats')
        .delete()
        .eq('profile_id', activeProfile.id)
        .then(({ error }) => {
          if (error) console.warn('[SantiSOFT] Erro ao limpar mensagens da nuvem:', error.message);
        });
    }
  }, [activeProfile]);

  return {
    progress,
    toggleLessonCompletion,
    syncProgressFromCloud,
    progressLoaded,
    mentorMessages,
    addMentorMessage,
    clearMentorMessages,
    mentorLoaded,
  };
}
