import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  Bell,
  Building,
  Check,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  User,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { colaborhConfirm } from '../../../utils/colaborhAlerts';

const fieldClass = 'h-10 w-full rounded-xl border border-slate-200/80 bg-white px-4 pl-10 text-[12px] font-medium text-[#343241] outline-none transition-all placeholder:text-slate-400 focus:border-[#940dff]/35 focus:ring-2 focus:ring-[#940dff]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';
const labelClass = 'mb-2 block text-[11px] font-semibold text-slate-500';

type AccountFormData = {
  fullName: string;
  email: string;
  phone: string;
};

type NotificationKey = 'newApplications' | 'aiAlerts' | 'weeklySummary';

const emptyFormData: AccountFormData = {
  fullName: '',
  email: '',
  phone: '',
};

const firstString = (...values: unknown[]) => {
  const value = values.find(item => typeof item === 'string' && item.trim().length > 0);
  return typeof value === 'string' ? value.trim() : '';
};

const buildFormDataFromUser = (user: SupabaseUser | null): AccountFormData => {
  const metadata = user?.user_metadata ?? {};

  return {
    fullName: firstString(
      metadata.full_name,
      metadata.name,
      metadata.display_name,
      metadata.contact_name,
      metadata.company_name,
      user?.email?.split('@')[0]
    ),
    email: firstString(user?.email),
    phone: firstString(user?.phone, metadata.whatsapp, metadata.phone, metadata.telefone, metadata.phone_number),
  };
};

const formatMemberSince = (createdAt?: string) => {
  if (!createdAt) return 'Não informado';

  const formatted = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(createdAt));

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const SettingsTab: React.FC = () => {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    newApplications: true,
    aiAlerts: true,
    weeklySummary: false,
  });

  const [formData, setFormData] = useState<AccountFormData>(emptyFormData);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      setIsLoadingUser(true);
      setUserError(null);

      const { data, error } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (error) {
        setUserError('Não foi possível carregar os dados do usuário.');
        setAuthUser(null);
        setFormData(emptyFormData);
      } else {
        setAuthUser(data.user);
        setFormData(buildFormDataFromUser(data.user));
      }

      setIsLoadingUser(false);
    };

    void loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      const user = session?.user ?? null;
      setAuthUser(user);
      setFormData(buildFormDataFromUser(user));
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleToggleNotification = (key: NotificationKey) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!authUser) {
      alert('Não foi possível identificar o usuário logado. Faça login novamente e tente salvar.');
      return;
    }

    setIsSaving(true);

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const shouldUpdateEmail = trimmedEmail.length > 0 && trimmedEmail !== authUser.email;

    const { data, error } = await supabase.auth.updateUser({
      ...(shouldUpdateEmail ? { email: trimmedEmail } : {}),
      data: {
        ...authUser.user_metadata,
        full_name: trimmedName,
        name: trimmedName,
        whatsapp: trimmedPhone,
        phone: trimmedPhone,
      },
    });

    setIsSaving(false);

    if (error) {
      alert(`Não foi possível salvar as configurações: ${error.message}`);
      return;
    }

    const updatedUser = data.user ?? authUser;
    setAuthUser(updatedUser);
    setFormData(prev => ({
      ...buildFormDataFromUser(updatedUser),
      email: trimmedEmail || prev.email,
    }));

    alert(shouldUpdateEmail
      ? 'Dados salvos. Confirme o novo e-mail para concluir a alteração de endereço.'
      : 'Configurações salvas com sucesso!'
    );
  };

  const handleDeleteAccount = async () => {
    const confirmed = await colaborhConfirm({
      title: 'Excluir conta?',
      message: 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      variant: 'danger',
      confirmLabel: 'Excluir conta',
    });

    if (confirmed) {
      alert('Exclusão de conta ainda precisa ser feita por uma rotina segura no servidor.');
    }
  };

  const notificationOptions = [
    { label: 'Novas candidaturas', description: 'Receba avisos quando candidatos se inscreverem nas vagas.', key: 'newApplications' as const },
    { label: 'Alertas de IA', description: 'Notificações sobre análises e recomendações automáticas.', key: 'aiAlerts' as const },
    { label: 'Resumo semanal', description: 'Resumo periódico com movimentações do recrutamento.', key: 'weeklySummary' as const },
  ];

  const displayName = formData.fullName || (isLoadingUser ? 'Carregando...' : 'Usuário');
  const memberSince = formatMemberSince(authUser?.created_at);
  const isFormDisabled = isLoadingUser || isSaving;

  return (
    <motion.div
      key="configuracoes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="company-dashboard-surface w-full space-y-5 pb-10 text-left"
    >
      {userError && (
        <div className="rounded-2xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 px-4 py-3 text-[12px] font-semibold text-[#ff4b8c]">
          {userError}
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#940dff]/18 bg-[#f3e5ff] text-[#940dff] shadow-sm">
              <User size={30} className="stroke-[2.3]" />
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl border border-white bg-[#63e1a5] text-white shadow-sm">
                <Check size={14} className="stroke-[3]" />
              </span>
            </div>
            <h3 className="text-[18px] font-semibold tracking-tight text-[#343241]">{displayName}</h3>
            <p className="mt-1 text-[12px] font-medium text-slate-400">Recrutador principal</p>
          </div>

          <div className="mt-5 divide-y divide-slate-200/70 rounded-2xl border border-slate-200/70 bg-[#fbf9ff]">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-[12px] font-medium text-slate-400">Status</span>
              <span className="text-[12px] font-semibold text-[#40b87f]">Ativo</span>
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-[12px] font-medium text-slate-400">Membro desde</span>
              <span className="text-[12px] font-semibold text-slate-500">{memberSince}</span>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[20px] font-semibold tracking-tight text-[#343241]">Dados da conta</h3>
              <p className="mt-1 text-[12px] font-medium text-slate-400">Atualize as informações usadas para contato e identificação.</p>
            </div>
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f3e5ff] text-[#940dff] sm:flex">
              <User size={18} />
            </div>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className={labelClass}>Nome completo</span>
              <span className="relative block">
                <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                  placeholder="Nome do usuário"
                  className={fieldClass}
                  disabled={isFormDisabled}
                />
              </span>
            </label>

            <label>
              <span className={labelClass}>E-mail corporativo</span>
              <span className="relative block">
                <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="email@empresa.com"
                  className={fieldClass}
                  disabled={isFormDisabled}
                />
              </span>
            </label>

            <label>
              <span className={labelClass}>WhatsApp / telefone</span>
              <span className="relative block">
                <Phone size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  placeholder="(61) 99999-9999"
                  className={fieldClass}
                  disabled={isFormDisabled}
                />
              </span>
            </label>

            <div className="mt-2 flex flex-wrap items-center justify-end gap-3 md:col-span-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex h-8 items-center justify-center gap-2 rounded-xl border border-[#ff4b8c]/18 bg-[#ff4b8c]/10 px-4 text-[12px] font-semibold text-[#ff4b8c] transition-all hover:border-[#ff4b8c]/30 hover:bg-[#ff4b8c]/14 active:scale-95"
              >
                <Trash2 size={14} />
                Excluir conta
              </button>
              <button
                type="submit"
                disabled={isFormDisabled}
                className="h-8 rounded-xl bg-[#940dff] px-5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(148,13,255,0.22)] transition-all hover:bg-[#8200e6] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        </section>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffc24b]/16 text-[#ffa303]">
              <Bell size={18} />
            </span>
            <div>
              <h3 className="text-[18px] font-semibold tracking-tight text-[#343241]">Notificações</h3>
              <p className="text-[12px] font-medium text-slate-400">Escolha quais avisos deseja acompanhar.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-200/70 rounded-2xl border border-slate-200/70 bg-white/70">
            {notificationOptions.map((pref) => {
              const active = notifications[pref.key];
              return (
                <button
                  key={pref.key}
                  type="button"
                  onClick={() => handleToggleNotification(pref.key)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-[#fbf9ff]"
                >
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-[#343241]">{pref.label}</span>
                    <span className="mt-0.5 block text-[12px] font-medium text-slate-400">{pref.description}</span>
                  </span>
                  <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${active ? 'bg-[#940dff]' : 'bg-slate-200'}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${active ? 'left-[18px]' : 'left-0.5'}`} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.035)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#533af6]/10 text-[#533af6]">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h3 className="text-[18px] font-semibold tracking-tight text-[#343241]">Segurança</h3>
              <p className="text-[12px] font-medium text-slate-400">Gerencie proteção de acesso e credenciais.</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => alert('Fluxo de alteração de senha ainda será conectado ao Supabase.')}
              className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200/70 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/20 hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-[0.99]"
            >
              <span className="flex items-center gap-2"><KeyRound size={15} /> Alterar senha</span>
              <span className="text-slate-300">Editar</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Autenticação em dois fatores ainda será configurada no Supabase.')}
              className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200/70 bg-white px-4 text-[12px] font-semibold text-slate-500 transition-all hover:border-[#940dff]/20 hover:bg-[#f3e5ff] hover:text-[#940dff] active:scale-[0.99]"
            >
              <span className="flex items-center gap-2"><Building size={15} /> Ativar autenticação 2FA</span>
              <span className="text-slate-300">Configurar</span>
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
