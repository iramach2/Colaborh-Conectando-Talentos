import { Dispatch, RefObject, SetStateAction } from 'react';
import { Bell, LogOut, Menu, MessageSquare, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface CandidateHeaderProps {
  activeTab: string;
  resumeData: {
    fullName?: string;
    email?: string;
    profilePic?: string;
  };
  profileMenuRef: RefObject<HTMLDivElement>;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: Dispatch<SetStateAction<boolean>>;
  unreadChatCount: number;
  unreadNotificationsCount: number;
  onOpenMenu: () => void;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onSelectSettings: () => void;
  onLogout: () => void;
}

export function CandidateHeader({
  activeTab,
  resumeData,
  profileMenuRef,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  unreadChatCount,
  unreadNotificationsCount,
  onOpenMenu,
  onOpenChat,
  onOpenNotifications,
  onSelectSettings,
  onLogout,
}: CandidateHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex w-full flex-col gap-0 rounded-none bg-transparent px-4 py-3 transition-all duration-300 lg:px-10">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 shadow-sm transition-all hover:text-[#940dff] lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0 text-left">
            <h1 className="truncate text-xl font-semibold tracking-tight text-[#343241]">{activeTab}</h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={onOpenChat}
            className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-sm shadow-[#940dff]/15 transition-all hover:scale-105 hover:bg-[#8200e6] active:scale-95"
            title="Conversas"
          >
            <MessageSquare size={15} />
            {unreadChatCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white bg-[#ff4b8c] text-[8px] font-semibold text-white">
                {unreadChatCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#940dff] bg-[#940dff] text-white shadow-sm shadow-[#940dff]/15 transition-all hover:scale-105 hover:bg-[#8200e6] active:scale-95"
            title="Notificações"
          >
            <Bell size={15} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white bg-[#ff4b8c] text-[8px] font-semibold text-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <div className="hidden h-6 w-px bg-slate-200 md:block" />

          <div className="relative hidden lg:block" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-white p-0 shadow-sm ring-2 ring-white transition-transform hover:scale-105 active:scale-95"
              title={resumeData.fullName}
            >
              {resumeData.profilePic ? (
                <img src={resumeData.profilePic} alt="Perfil" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-slate-600">
                  {resumeData.fullName ? resumeData.fullName.substring(0, 2).toUpperCase() : 'CA'}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200/70 bg-white/95 px-2 py-3 text-left shadow-[0_18px_50px_rgba(106,66,220,0.10)] backdrop-blur-md"
                >
                  <div className="mb-2 border-b border-slate-100 px-3 py-2.5">
                    <p className="mb-1 text-[10px] font-semibold leading-none tracking-wide text-[#940dff]">Candidato</p>
                    <p className="truncate text-xs font-semibold text-[#343241]">{resumeData.fullName || 'Cadastrado'}</p>
                    <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">{resumeData.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectSettings();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent px-3 py-2.5 text-left text-sm font-semibold text-slate-500 transition-all hover:bg-[#f3e5ff] hover:text-[#940dff] focus:outline-none"
                  >
                    <Settings size={17} className="text-slate-400" />
                    <span>Configurações</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-transparent px-3 py-2.5 text-left text-sm font-semibold text-[#ff4b8c] transition-all hover:bg-[#ff4b8c]/10 focus:outline-none"
                  >
                    <LogOut size={17} />
                    <span>Sair</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}