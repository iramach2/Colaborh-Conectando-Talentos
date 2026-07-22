import { User } from 'lucide-react';
import type {
  CandidateAchievement,
  CandidateEducation,
  CandidateExperience,
  CandidateLanguage,
  CandidateResumeData,
} from '../../types/candidate';
import { formatExperienceDurationWithPeriod } from '../../utils/candidateResumeCalculations';

interface ResumeA4PreviewProps {
  resumeData: CandidateResumeData;
  calculateAge: (birthDate: string) => string | number;
  calculateDuration: (start: string, end: string | null | undefined, current: boolean) => string;
}

export const ResumeA4Preview = ({ resumeData, calculateAge, calculateDuration }: ResumeA4PreviewProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '297mm', width: '210mm', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'visible', boxSizing: 'border-box', fontFamily: '"Inter", sans-serif', textRendering: 'geometricPrecision', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}>
      {/* Header Zone */}
      <div style={{ backgroundImage: 'linear-gradient(90deg, #5b36ff 0%, #8b6aff 100%)', backgroundColor: '#7044ff', width: '100%', height: '160px', position: 'relative', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
        {/* Circular Photo */}
        <div style={{ position: 'absolute', left: '35px', top: '75px', zIndex: 100 }}>
          <div style={{ width: '170px', height: '170px', borderRadius: '50%', border: '6px solid #FFFFFF', overflow: 'hidden', backgroundColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {resumeData.profilePic ? (
              <img src={resumeData.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#cbd5e1' }}>
                <User size={60} style={{ color: '#cbd5e1', margin: 'auto' }} />
              </div>
            )}
          </div>
        </div>

        {/* Name Header */}
        <div style={{ marginLeft: '260px', paddingRight: '15px', flex: 1, textAlign: 'left' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', letterSpacing: '2px', margin: 0, paddingBottom: '10px' }}>
            {resumeData.fullName || 'Seu Nome'}
          </h1>
          <div style={{ width: '100%', height: '2px', backgroundColor: '#FFFFFF' }} />
        </div>
      </div>

      {/* Columns Zone */}
      <div style={{ display: 'flex', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        {/* Sidebar Column */}
        <div style={{ width: '240px', backgroundColor: '#f3f0ff', paddingTop: '100px', paddingLeft: '12px', paddingRight: '12px', paddingBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
          {/* CONTATO SECTION */}
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '35px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Contato</h3>
            <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Telefone</p>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{resumeData.phone || '--'}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>E-Mail</p>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, wordBreak: 'break-all' }}>{resumeData.email || '--'}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Cidade</p>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{resumeData.city ? `${resumeData.city} - ${resumeData.state || ''}` : '--'}</p>
            </div>
            
            <div>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#7044ff', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Idade</p>
              <p style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0 }}>{calculateAge(resumeData.birthDate) || '--'}</p>
            </div>
          </div>

          {/* HABILIDADES SECTION */}
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0', textAlign: 'center' }}>Habilidades</h3>
            <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
            
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
              {resumeData.skills.map((skill: string, index: number) => (
                <li key={index} style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, paddingLeft: '5px' }}>
                  • {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* IDIOMAS SECTION */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div style={{ width: '100%', marginTop: '35px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#7044ff', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 6px 0', textAlign: 'center' }}>Idiomas</h3>
              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '18px' }} />
              
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', width: '100%' }}>
                {resumeData.languages.map((item: CandidateLanguage) => (
                  <li key={item.id} style={{ fontSize: '13px', color: '#334155', fontWeight: 500, margin: 0, paddingLeft: '5px' }}>
                    • {item.language} ({item.level})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content Column */}
        <div style={{ flex: 1, padding: '30px 15px 30px 15px', display: 'flex', flexDirection: 'column', textAlign: 'left', boxSizing: 'border-box' }}>
          {/* PERFIL SECTION */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Perfil</h2>
            <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
            <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: '#334155', margin: 0, textAlign: 'left', whiteSpace: 'pre-line' }}>
              {resumeData.summary || 'Resumo profissional não preenchido.'}
            </p>
          </div>

          {/* EXPERIÊNCIAS SECTION */}
          {resumeData.experiences && resumeData.experiences.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Experiências</h2>
              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
              <div>
                {resumeData.experiences.map((exp: CandidateExperience) => (
                  <div key={exp.id} style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', margin: '0 0 4px 0' }}>{exp.role}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{exp.company}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{formatExperienceDurationWithPeriod(exp.startDate, exp.endDate, Boolean(exp.current)) || calculateDuration(exp.startDate || '', exp.endDate, Boolean(exp.current))}</span>
                    </div>
                    <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#475569', margin: 0, whiteSpace: 'pre-line', textAlign: 'left' }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCAÇÃO SECTION */}
          {resumeData.educations && resumeData.educations.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Educação</h2>
              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
              <div>
                {resumeData.educations.map((edu: CandidateEducation) => (
                  <div key={edu.id} style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{edu.course}</h4>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#334155', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                      {edu.gradYear} - {edu.status}
                    </p>
                    <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CURSOS OU CERTIFICADOS SECTION */}
          {resumeData.achievements && resumeData.achievements.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>Cursos ou certificados</h2>
              <div style={{ width: '100%', height: '3px', backgroundColor: '#906bf9', marginBottom: '16px' }} />
              <div>
                {resumeData.achievements.map((item: CandidateAchievement) => (
                  <div key={item.id} style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', margin: '0 0 4px 0' }}>{item.title}</h4>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#334155', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                      {item.type}
                    </p>
                    {item.description && <p style={{ fontSize: '12px', color: '#475569', margin: 0, whiteSpace: 'pre-line', textAlign: 'left' }}>{item.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
