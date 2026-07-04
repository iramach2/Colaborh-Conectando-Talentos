import React, { RefObject } from 'react';
import type { CandidateResumeData } from '../../types/candidate';
import { ResumeA4Preview } from './ResumeA4Preview';

interface CandidateHiddenResumePrintProps {
  resumePrintRef: RefObject<HTMLDivElement>;
  resumeData: CandidateResumeData;
  calculateAge: (birthDate: string) => number | string;
  calculateDuration: (startDate: string, endDate: string | null | undefined, current: boolean) => string;
}

export function CandidateHiddenResumePrint({
  resumePrintRef,
  resumeData,
  calculateAge,
  calculateDuration
}: CandidateHiddenResumePrintProps) {
  return (
    <div
      ref={resumePrintRef}
      style={{
        display: 'none',
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#FFFFFF',
        color: '#000000'
      }}
      className="font-sans"
    >
      <ResumeA4Preview
        resumeData={resumeData}
        calculateAge={calculateAge}
        calculateDuration={calculateDuration}
      />
    </div>
  );
}
