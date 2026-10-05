import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseAvailable, type Profile, type MentorMessage } from '@/lib/supabase';
import { activateProfile } from '@/lib/profileStore';
import { useProfileState } from '@/hooks/useProfileState';
import type { ProgressMap } from '@/types';

const mentorCacheKey = (profileId: string) => `santisoft:${profileId}:mentor_chats`;

function readMentorCache(profileId: string): MentorMessage[] {
  try {
    const raw = localStorage.getItem(mentorCacheKey(profileId));
    return raw ? (JSON.parse(raw) as MentorMessage[]) : [];
  } catch {
    return [];
  }
}

function writeMentorCache(profileId: string, messages: MentorMessage[]): void {
  try {
    localStorage.setItem(mentorCacheKey(profileId), JSON.stringify(messages));
  } catch { /* ignore */ }
}

interface UseSupabaseSyncReturn {
  // Lesson progress
  progress: ProgressMap;
  toggleLessonCompletion: (lessonId: string, currentStatus: boolean) => void;
  clearProgress: () => void;
  progressLoaded: boolean;

  // Mentor chats
  mentorMessages: MentorMessage[];
  addMentorMessage: (msg: Omit<MentorMessage, 'id' | 'created_at' | 'profile_id'>) => void;
  clearMentorMessages: () => void;
  mentorLoaded: boolean;
}

export function useSupabaseSync(activeProfile: Profile | null): UseSupabaseSyncReturn {
  const profileId = activeProfile?.id ?? null;

  // Liga o armazenamento ao perfil ativo: carrega o que está salvo neste
  // dispositivo e baixa a versão mais recente da nuvem.
  useEffect(() => {
    activateProfile(activeProfile);
  }, [activeProfile]);

  // ---- Aulas concluídas (por perfil, sincronizadas) ----
  const [progress, setProgress] = useProfileState<ProgressMap>('lesson_progress', {});

  const toggleLessonCompletion = useCallback(
    (lessonId: string, currentStatus: boolean) => {
      setProgress((prev) => {
        const updated = { ...prev };
        if (currentStatus) delete updated[lessonId];
        else updated[lessonId] = true;
        return updated;
      });
    },
    [setProgress],
  );

  const clearProgress = useCallback(() => {
    setProgress({});
  }, [setProgress]);

  // ---- Conversas do Mentor (tabela mentor_chats, cache local por perfil) ----
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([]);
  const [mentorLoaded, setMentorLoaded] = useState(false);

  useEffect(() => {
    if (!profileId) {
      setMentorMessages([]);
      return;
    }

    setMentorMessages(readMentorCache(profileId));
    setMentorLoaded(true);

    if (!isSupabaseAvailable || !supabase) return;

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('mentor_chats')
        .select('id, profile_id, role, content, created_at')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: true });

      if (cancelled || error || !data) return;

      const cloudMessages = data as MentorMessage[];
      setMentorMessages(cloudMessages);
      writeMentorCache(profileId, cloudMessages);
    })();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const addMentorMessage = useCallback(
    (msg: Omit<MentorMessage, 'id' | 'created_at' | 'profile_id'>) => {
      const fullMsg: MentorMessage = {
        ...msg,
        profile_id: profileId ?? '',
        created_at: new Date().toISOString(),
      };

      setMentorMessages((prev) => {
        const updated = [...prev, fullMsg];
        if (profileId) writeMentorCache(profileId, updated);
        return updated;
      });

      if (profileId && isSupabaseAvailable && supabase) {
        supabase
          .from('mentor_chats')
          .insert({
            profile_id: profileId,
            role: msg.role,
            content: msg.content,
          })
          .then(({ error }) => {
            if (error) console.warn('[SantiSOFT] Erro ao salvar mensagem na nuvem:', error.message);
          });
      }
    },
    [profileId],
  );

  const clearMentorMessages = useCallback(() => {
    setMentorMessages([]);
    if (profileId) writeMentorCache(profileId, []);

    if (profileId && isSupabaseAvailable && supabase) {
      supabase
        .from('mentor_chats')
        .delete()
        .eq('profile_id', profileId)
        .then(({ error }) => {
          if (error) console.warn('[SantiSOFT] Erro ao limpar mensagens da nuvem:', error.message);
        });
    }
  }, [profileId]);

  return {
    progress,
    toggleLessonCompletion,
    clearProgress,
    progressLoaded: true,
    mentorMessages,
    addMentorMessage,
    clearMentorMessages,
    mentorLoaded,
  };
}
