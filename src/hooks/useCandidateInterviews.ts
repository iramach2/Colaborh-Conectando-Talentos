import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CANDIDATE_INTERVIEW_COLUMNS } from '../services/queryColumns';
import type { CompanyInterview } from '../types/companyDashboard';

export const useCandidateInterviews = (candidateEmail?: string) => {
  const [interviews, setInterviews] = useState<CompanyInterview[]>([]);
  const [isFetchingInterviews, setIsFetchingInterviews] = useState(false);
  const [activeVideoMeeting, setActiveVideoMeeting] = useState<{ roomName: string; userName: string; interviewId?: string } | null>(null);

  const loadInterviews = useCallback(async () => {
    if (!candidateEmail) {
      setInterviews([]);
      return;
    }

    setIsFetchingInterviews(true);

    try {
      const { data, error } = await supabase
        .from('interviews')
        .select(CANDIDATE_INTERVIEW_COLUMNS)
        .eq('candidate_email', candidateEmail)
        .order('date_time', { ascending: true });

      if (error) throw error;
      setInterviews((data || []) as CompanyInterview[]);
    } catch (error) {
      console.error('Erro ao carregar entrevistas do candidato:', error);
    } finally {
      setIsFetchingInterviews(false);
    }
  }, [candidateEmail]);

  useEffect(() => {
    loadInterviews();
  }, [loadInterviews]);

  return {
    interviews,
    isFetchingInterviews,
    activeVideoMeeting,
    setActiveVideoMeeting,
    loadInterviews,
  };
};
