import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
} from 'lucide-react';
import type { CompanyRecord } from '../../../services/companyService';
import type { TalentProfile } from '../../../hooks/useCompanyTalentBank';
import type { CompanyApplicant } from '../../../types/companyDashboard';
import { calculateAge } from '../../../utils/companyDashboardUtils';
import { supabasePublicRead } from '../../../lib/supabase';
import { LoadingAnimation } from '../../Loader';

const TALENTS_PER_PAGE = 50;

interface TalentBankTabProps {
  filteredTalents: TalentProfile[];
  isFetchingTalents: boolean;
  setSelectedResumeApplicant: (val: CompanyApplicant | null) => void;
  selectedCompany?: CompanyRecord | null;
  handleToggleSaveTalent: (talentId: string) => void;
  talentSubTab: 'all' | 'saved';
  canUseDirectWhatsApp: boolean;
  onPlanFeatureBlocked: (feature: string) => void;
}

const getTalentInitials = (name?: string | null) => {
  if (!name) return 'TA';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const getLocation = (talent: TalentProfile) => [talent.city, talent.state].filter(Boolean).join(', ') || 'Local não informado';

const getAge = (talent: TalentProfile) => talent.age || calculateAge(talent.birth_date);

const buildWhatsappUrl = (talent: TalentProfile) => {
  const cleanPhone = talent.phone ? talent.phone.replace(/\D/g, '') : '';
  const message = `Olá ${talent.name || ''}, gostamos do seu perfil na Colaborh!`;
  return `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(message)}`;
};

const buildApplicantFromTalent = (talent: TalentProfile): CompanyApplicant => ({
  id: talent.id,
  candidate_name: talent.name,
  candidate_email: talent.email,
  candidate_phone: talent.phone,
  city: talent.city,
  state: talent.state,
  profile_pic: talent.profile_pic,
  talentMatched: talent,
});

export const TalentBankTab = ({
  filteredTalents,
  isFetchingTalents,
  setSelectedResumeApplicant,
  selectedCompany,
  handleToggleSaveTalent,
  talentSubTab,
  canUseDirectWhatsApp,
  onPlanFeatureBlocked
}: TalentBankTabProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [profilePicturesByTalentId, setProfilePicturesByTalentId] = useState<Record<string, string | null>>({});
  const resultLabel = filteredTalents.length === 1 ? 'talento encontrado' : 'talentos encontrados';
  const totalPages = Math.max(1, Math.ceil(filteredTalents.length / TALENTS_PER_PAGE));
  const filteredTalentIds = filteredTalents.map((talent) => talent.id).join('|');
  const pageStart = (currentPage - 1) * TALENTS_PER_PAGE;
  const paginatedTalents = filteredTalents.slice(pageStart, pageStart + TALENTS_PER_PAGE);
  const paginatedTalentIds = paginatedTalents.map((talent) => talent.id).filter(Boolean).join('|');
  const visiblePageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

    const candidates = [1, currentPage - 1, currentPage, currentPage + 1, totalPages]
      .filter((page) => page >= 1 && page <= totalPages);
    return [...new Set(candidates)].sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTalentIds, talentSubTab]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    let isActive = true;
    const visibleIds = paginatedTalentIds.split('|').filter(Boolean);
    const missingIds = visibleIds.filter((id) => !(id in profilePicturesByTalentId));

    if (missingIds.length === 0) return undefined;

    async function loadVisibleProfilePictures() {
      const { data, error } = await supabasePublicRead
        .from('talents')
        .select('id, profile_pic')
        .in('id', missingIds);

      if (!isActive) return;

      if (error) {
        console.warn('Não foi possível carregar as fotos da página de talentos:', error);
        setProfilePicturesByTalentId((current) => ({
          ...current,
          ...Object.fromEntries(missingIds.map((id) => [id, null])),
        }));
        return;
      }

      const loadedPictures = Object.fromEntries(
        (data || []).map((row) => [row.id, row.profile_pic || null]),
      );
      setProfilePicturesByTalentId((current) => ({
        ...current,
        ...Object.fromEntries(missingIds.map((id) => [id, null])),
        ...loadedPictures,
      }));
    }

    void loadVisibleProfilePictures();
    return () => {
      isActive = false;
    };
  }, [paginatedTalentIds]);

  const getTalentWithPicture = (talent: TalentProfile): TalentProfile => ({
    ...talent,
    profile_pic: talent.profile_pic || profilePicturesByTalentId[talent.id] || undefined,
  });

  const openTalentProfile = (talent: TalentProfile) => {
    setSelectedResumeApplicant(buildApplicantFromTalent(getTalentWithPicture(talent)));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderEmptyState = () => {
    const isSaved = talentSubTab === 'saved';

    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white/85 px-6 py-20 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#940dff]/12 bg-[#f3e5ff] text-[#940dff]">
          {isSaved ? <Bookmark size={24} /> : <Search size={24} />}
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-[#343241]">
          {isSaved ? 'Nenhum candidato salvo' : 'Nenhum talento encontrado'}
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm font-medium leading-relaxed text-slate-400">
          {isSaved
            ? 'Favorite candidatos no Banco de Talentos para encontrá-los rapidamente depois.'
            : 'Tente ajustar a busca no cabeçalho ou abrir os filtros para refinar os resultados.'}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      key="banco-talentos"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3 px-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#63e1a5]" />
          <p className="text-[12px] font-semibold text-slate-500">
            <span className="text-[#343241]">{filteredTalents.length}</span> {resultLabel}
          </p>
        </div>

      </div>

      {isFetchingTalents ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white/85 px-6 py-16 text-center shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <LoadingAnimation message="Buscando perfis cadastrados." />
        </div>
      ) : filteredTalents.length > 0 ? (
        <div className="w-full overflow-visible text-left">
          <div className="hidden xl:grid grid-cols-[minmax(260px,1.2fr)_minmax(150px,0.8fr)_90px_minmax(130px,0.75fr)_minmax(190px,0.9fr)_190px] items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            <span>Candidato</span>
            <span className="inline-flex items-center justify-center gap-1.5"><MapPin size={12} /> Local</span>
            <span className="text-center">Idade</span>
            <span className="inline-flex items-center justify-center gap-1.5"><DollarSign size={12} /> Pretensão</span>
            <span className="text-center">Contato</span>
            <span className="sr-only">Ações</span>
          </div>

          <div className="overflow-visible rounded-2xl border border-slate-200/70 bg-white/75 shadow-[0_10px_28px_rgba(15,23,42,0.035)] divide-y divide-slate-200/80">
            {paginatedTalents.map((talent, index) => {
              const isSaved = selectedCompany?.savedTalents?.includes(talent.id) || false;
              const age = getAge(talent);
              const rowKey = talent.id || `${talent.email}-${index}`;
              const profilePicture = talent.profile_pic || profilePicturesByTalentId[talent.id];

              return (
                <motion.div
                  key={rowKey}
                  whileHover={{ y: -2 }}
                  className={`group relative px-4 py-3 backdrop-blur-md transition-all duration-300 hover:bg-white ${index % 2 === 0 ? 'bg-white/95' : 'bg-slate-50/60'}`}
                >
                  <div className="xl:hidden">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => openTalentProfile(talent)}
                        className="flex min-w-0 flex-1 items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff] select-none">
                          {profilePicture ? (
                            <img src={profilePicture} alt={talent.name || 'Foto do talento'} className="h-full w-full object-cover" />
                          ) : (
                            talent.name ? getTalentInitials(talent.name) : <User size={17} className="stroke-[2.4]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold tracking-tight text-[#343241] transition-colors group-hover:text-[#940dff]">
                            {talent.name || 'Talento sem nome'}
                          </p>
                          <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
                            {talent.role || talent.education || 'Perfil profissional não informado'}
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl border border-slate-100 bg-white/70 p-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Local</p>
                        <p className="mt-1 truncate text-[12px] font-medium text-slate-500">{getLocation(talent)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Idade</p>
                        <p className="mt-1 text-[12px] font-medium text-slate-500">{age ? age + ' anos' : 'Não informada'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Pretensão</p>
                        <p className="mt-1 truncate text-[12px] font-medium text-slate-500">{talent.salary || 'Não informada'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Contato</p>
                        <p className="mt-1 truncate text-[12px] font-medium text-slate-500">{talent.phone || 'Não informado'}</p>
                      </div>
                    </div>
                    <p className="mt-3 truncate text-[11px] font-medium text-slate-500"><Mail size={12} className="mr-1 inline text-slate-400" />{talent.email || 'E-mail não informado'}</p>

                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => openTalentProfile(talent)}
                        className="flex h-8 flex-1 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                      >
                        Perfil
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleSaveTalent(talent.id);
                        }}
                        className={'flex h-8 w-10 items-center justify-center rounded-xl border transition-all ' + (
                          isSaved
                            ? 'border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]'
                            : 'border-slate-200/70 bg-white text-slate-400 hover:border-[#940dff]/18 hover:bg-[#f3e5ff] hover:text-[#940dff]'
                        )}
                        title={isSaved ? 'Remover dos salvos' : 'Salvar candidato'}
                      >
                        <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                      </button>
                      {talent.phone && (
                        <a
                          href={canUseDirectWhatsApp ? buildWhatsappUrl(talent) : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => {
                            if (!canUseDirectWhatsApp) {
                              event.preventDefault();
                              onPlanFeatureBlocked('Contato direto por WhatsApp');
                            }
                          }}
                          className="flex h-8 w-10 items-center justify-center rounded-xl border border-[#63e1a5]/35 bg-[#63e1a5]/14 text-[#40b87f] transition-all hover:border-[#63e1a5]/55 hover:bg-[#63e1a5] hover:text-white"
                          title="Chamar no WhatsApp"
                        >
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12.031 2C6.49 2 2 6.47 2 12.01c0 1.91.53 3.78 1.56 5.42L2 23l5.76-1.51c1.58.86 3.37 1.31 5.27 1.31 5.54 0 10.03-4.47 10.03-10.01C23.06 6.47 18.57 2 12.031 2zm5.73 14.1c-.24.68-1.24 1.25-1.9 1.34-.54.07-1.24.08-2 .17-1.24-.16-2.5-1.06-3.69-2.25-1.19-1.19-2.09-2.45-2.25-3.69.09-.76.1-1.46.17-2 .09-.66.66-1.66 1.34-1.9.18-.06.39-.08.57-.08.18 0 .37.01.52.33.21.46.72 1.77.79 1.91.07.15.12.32.02.5-.1.18-.15.3-.3.47-.15.17-.32.39-.46.52-.16.16-.33.33-.14.65.19.32.84 1.39 1.8 2.25.96.86 1.77 1.41 2.09 1.57.32.16.51.12.67-.06.17-.18.72-.84.92-1.12.19-.28.39-.23.65-.13.26.1 1.66.78 1.94.92.28.14.47.21.54.34.08.13.08.76-.16 1.44z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="hidden gap-3 xl:grid xl:grid-cols-[minmax(260px,1.2fr)_minmax(150px,0.8fr)_90px_minmax(130px,0.75fr)_minmax(190px,0.9fr)_190px] xl:items-center">
                    <button
                      type="button"
                      onClick={() => openTalentProfile(talent)}
                      className="flex min-w-0 items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[12px] font-semibold text-[#940dff] select-none">
                        {profilePicture ? (
                          <img src={profilePicture} alt={talent.name || 'Foto do talento'} className="h-full w-full object-cover" />
                        ) : (
                          talent.name ? getTalentInitials(talent.name) : <User size={17} className="stroke-[2.4]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold tracking-tight text-[#343241] transition-colors group-hover:text-[#940dff]">
                          {talent.name || 'Talento sem nome'}
                        </p>
                        <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
                          {talent.role || talent.education || 'Perfil profissional não informado'}
                        </p>
                      </div>
                    </button>

                    <span className="truncate text-center text-[12px] font-medium text-slate-500">{getLocation(talent)}</span>
                    <span className="text-center text-[12px] font-medium text-slate-500">{age ? `${age} anos` : 'Não informada'}</span>
                    <span className="truncate text-center text-[12px] font-medium text-slate-500">{talent.salary || 'Não informada'}</span>
                    <div className="min-w-0 space-y-1 text-center">
                      <p className="truncate text-[11px] font-medium text-slate-500"><Mail size={12} className="mr-1 inline text-slate-400" />{talent.email || 'E-mail não informado'}</p>
                      <p className="truncate text-[11px] font-medium text-slate-400"><Phone size={12} className="mr-1 inline text-slate-400" />{talent.phone || 'Telefone não informado'}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openTalentProfile(talent)}
                        className="flex h-8 items-center justify-center rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-4 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12"
                      >
                        Perfil
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleSaveTalent(talent.id);
                        }}
                        className={`flex h-8 w-9 items-center justify-center rounded-xl border transition-all ${
                          isSaved
                            ? 'border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff]'
                            : 'border-slate-200/70 bg-white text-slate-400 hover:border-[#940dff]/18 hover:bg-[#f3e5ff] hover:text-[#940dff]'
                        }`}
                        title={isSaved ? 'Remover dos salvos' : 'Salvar candidato'}
                      >
                        <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
                      </button>

                      {talent.phone && (
                        <a
                          href={canUseDirectWhatsApp ? buildWhatsappUrl(talent) : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => {
                            if (!canUseDirectWhatsApp) {
                              event.preventDefault();
                              onPlanFeatureBlocked('Contato direto por WhatsApp');
                            }
                          }}
                          className="flex h-8 w-9 items-center justify-center rounded-xl border border-white/80 bg-[#63e1a5]/14 text-[#40b87f] transition-all hover:bg-[#63e1a5] hover:text-white"
                          title="Chamar no WhatsApp"
                        >
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12.031 2C6.49 2 2 6.47 2 12.01c0 1.91.53 3.78 1.56 5.42L2 23l5.76-1.51c1.58.86 3.37 1.31 5.27 1.31 5.54 0 10.03-4.47 10.03-10.01C23.06 6.47 18.57 2 12.031 2zm5.73 14.1c-.24.68-1.24 1.25-1.9 1.34-.54.07-1.24.08-2 .17-1.24-.16-2.5-1.06-3.69-2.25-1.19-1.19-2.09-2.45-2.25-3.69.09-.76.1-1.46.17-2 .09-.66.66-1.66 1.34-1.9.18-.06.39-.08.57-.08.18 0 .37.01.52.33.21.46.72 1.77.79 1.91.07.15.12.32.02.5-.1.18-.15.3-.3.47-.15.17-.32.39-.46.52-.16.16-.33.33-.14.65.19.32.84 1.39 1.8 2.25.96.86 1.77 1.41 2.09 1.57.32.16.51.12.67-.06.17-.18.72-.84.92-1.12.19-.28.39-.23.65-.13.26.1 1.66.78 1.94.92.28.14.47.21.54.34.08.13.08.76-.16 1.44z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.035)] sm:flex-row sm:items-center sm:justify-between"
              aria-label="Paginação do banco de talentos"
            >
              <p className="text-center text-[11px] font-medium text-slate-400 sm:text-left">
                Exibindo <span className="font-semibold text-[#343241]">{pageStart + 1}–{Math.min(pageStart + TALENTS_PER_PAGE, filteredTalents.length)}</span> de{' '}
                <span className="font-semibold text-[#343241]">{filteredTalents.length}</span> candidatos
              </p>

              <div className="flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex h-8 items-center gap-1 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {visiblePageNumbers.map((page, index) => {
                  const previousPage = visiblePageNumbers[index - 1];
                  return (
                    <React.Fragment key={page}>
                      {previousPage && page - previousPage > 1 && (
                        <span className="flex h-8 w-6 items-center justify-center text-[12px] font-semibold text-slate-300">…</span>
                      )}
                      <button
                        type="button"
                        onClick={() => goToPage(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`h-8 min-w-8 rounded-xl border px-2 text-[12px] font-semibold transition-all ${
                          currentPage === page
                            ? 'border-[#940dff] bg-[#940dff] text-white shadow-[0_8px_18px_rgba(148,13,255,0.18)]'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-[#940dff]/24 hover:bg-[#f3e5ff] hover:text-[#940dff]'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex h-8 items-center gap-1 rounded-xl border border-[#940dff]/16 bg-[#f3e5ff] px-3 text-[12px] font-semibold text-[#940dff] transition-all hover:border-[#940dff]/28 hover:bg-[#940dff]/12 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-300"
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </nav>
          )}
        </div>
      ) : (
        renderEmptyState()
      )}
    </motion.div>
  );
};
