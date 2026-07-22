import { RefObject } from 'react';
import { User } from 'lucide-react';
import type { TalentEducation, TalentExperience } from '../../hooks/useCompanyTalentBank';
import type { CompanyApplicant } from '../../types/companyDashboard';
import { calculateAge, parseCandidatePhoneData } from '../../utils/companyDashboardUtils';
import { formatExperienceDurationWithPeriod } from '../../utils/candidateResumeCalculations';

interface CompanyHiddenResumePrintProps {
  applicant: CompanyApplicant | null;
  resumePrintRef: RefObject<HTMLDivElement>;
}

export function CompanyResumeA4Document({ applicant }: { applicant: CompanyApplicant }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '297mm', width: '210mm', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'visible', boxSizing: 'border-box' }}>
      <div style={{ backgroundImage: 'linear-gradient(90deg, #5b36ff 0%, #8b6aff 100%)', backgroundColor: '#7044ff', width: '100%', height: '160px', position: 'relative', display: 'flex', items: 'center', boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', left: '50px', top: '75px', zIndex: 100 }}>
          <div style={{ width: '170px', height: '170px', borderRadius: '50%', border: '6px solid #FFFFFF', overflow: 'hidden', backgroundColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {applicant.profile_pic ? (
              <img src={applicant.profile_pic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                <User size={60} />
              </div>
            )}
          </div>
        </div>

        <div style={{ marginLeft: '260px', paddingRight: '40px', flex: 1, textAlign: 'left' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '2px', margin: 0, paddingBottom: '10px' }}>
            {applicant.candidate_name || 'Nome do Candidato'}
          </h1>
          <div style={{ width: '100%', height: '2px', backgroundColor: '#FFFFFF' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ width: '240px', backgroundColor: '#f3f0ff', paddingTop: '110px', paddingLeft: '30px', paddingRight: '30px', paddingBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '35px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Contato</h3>
            <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />

            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Telefone</p>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{parseCandidatePhoneData(applicant.candidate_phone).phone || '--'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>E-Mail</p>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{applicant.candidate_email || '--'}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Cidade</p>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{applicant.city ? `${applicant.city} - ${applicant.state || ''}` : '--'}</p>
            </div>

            <div>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Idade</p>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>
                {applicant.talentMatched?.birth_date
                  ? `${calculateAge(applicant.talentMatched.birth_date)} anos`
                  : applicant.talentMatched?.age
                  ? `${applicant.talentMatched.age} anos`
                  : '--'}
              </p>
            </div>
          </div>

          {applicant.talentMatched?.skills && applicant.talentMatched.skills.length > 0 && (
            <div style={{ width: '100%' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0', textAlign: 'center' }}>Habilidades</h3>
              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                {applicant.talentMatched.skills.map((skill: string, index: number) => (
                  <li key={index} style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, paddingLeft: '5px', textAlign: 'left' }}>
                    - {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: '40px 40px 40px 35px', display: 'flex', flexDirection: 'column', textAlign: 'left', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Perfil</h2>
            <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
            <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#334155', margin: 0, textAlign: 'justify', whiteSpace: 'pre-line' }}>
              {applicant.talentMatched?.summary || applicant.summary || 'Resumo profissional nao preenchido.'}
            </p>
          </div>

          {applicant.talentMatched?.experiences && applicant.talentMatched.experiences.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Experiencias</h2>
              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
              <div>
                {applicant.talentMatched.experiences.map((exp: TalentExperience, idx: number) => (
                  <div key={idx} style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 900, color: '#000000', textTransform: 'uppercase', margin: '0 0 4px 0' }}>{exp.role}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>{exp.company}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#000000' }}>{formatExperienceDurationWithPeriod(exp.startDate, exp.endDate, Boolean(exp.current)) || exp.duration || 'N/A'}</span>
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#475569', margin: 0, whiteSpace: 'pre-line', textAlign: 'justify' }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {applicant.talentMatched?.educations && applicant.talentMatched.educations.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#000000', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Educacao</h2>
              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
              <div>
                {applicant.talentMatched.educations.map((edu: TalentEducation, idx: number) => (
                  <div key={idx} style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#000000', margin: '0 0 4px 0' }}>{edu.course}</h4>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#000000', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                      {edu.gradYear || ''} - {edu.status}
                    </p>
                    <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CompanyHiddenResumePrint({ applicant, resumePrintRef }: CompanyHiddenResumePrintProps) {
  if (!applicant) return null;

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
        color: '#000000',
      }}
      className="font-sans"
    >
      <CompanyResumeA4Document applicant={applicant} />
    </div>
  );
}
