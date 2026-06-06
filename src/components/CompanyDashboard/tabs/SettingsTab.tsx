import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  PlusCircle, 
  Settings, 
  Mail, 
  Phone, 
  Trash2, 
  Zap, 
  Building 
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const [notifications, setNotifications] = useState({
    newApplications: true,
    aiAlerts: true,
    weeklySummary: false,
  });

  const [formData, setFormData] = useState({
    fullName: 'João Silva',
    email: 'joao@empresa.com',
    phone: '(61) 99999-9999'
  });

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Configurações salvas com sucesso! (Simulação)');
  };

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      alert('Conta excluída (Simulação).');
    }
  };

  return (
    <motion.div 
      key="configuracoes"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Perfil Summary Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white flex flex-col items-center">
          <div className="w-24 h-24 bg-primary-50 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-primary-300 relative group mb-4">
             <User size={40} />
             <div className="absolute inset-0 bg-primary-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
               <PlusCircle size={20} className="text-white" />
             </div>
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">{formData.fullName}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Recrutador Principal</p>
          
          <div className="w-full pt-6 border-t border-slate-50 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Status</span>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Ativo</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Membro desde</span>
              <span className="text-slate-700">Maio 2024</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sleek border border-white">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
               <Settings size={20} />
             </div>
             <div>
               <h3 className="text-lg font-black text-slate-900 tracking-tight">Informações Pessoais</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Atualize seus dados de contato</p>
             </div>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="col-span-full">
               <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">Nome Completo</label>
               <div className="relative">
                 <User size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400" />
                 <input 
                   type="text" 
                   value={formData.fullName}
                   onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                   placeholder="João Silva" 
                   className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" 
                 />
               </div>
             </div>
             <div>
               <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">E-mail Corporativo</label>
               <div className="relative">
                 <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400" />
                 <input 
                   type="email" 
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   placeholder="joao@empresa.com" 
                   className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" 
                 />
               </div>
             </div>
             <div>
               <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 block pl-2">WhatsApp / Telefone</label>
               <div className="relative">
                 <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-400" />
                 <input 
                   type="tel" 
                   value={formData.phone}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   placeholder="(61) 99999-9999" 
                   className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 transition-all font-bold text-slate-700 text-sm shadow-sm" 
                 />
               </div>
             </div>
             
             <div className="col-span-full mt-4 flex gap-4">
               <button 
                 type="submit"
                 className="flex-1 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all text-[9px]"
               >
                 Salvar Alterações
               </button>
               <button 
                 type="button"
                 onClick={handleDeleteAccount}
                 className="px-6 py-4 bg-white border border-slate-100 text-red-500 font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-50 transition-all text-[9px] flex items-center justify-center gap-2"
               >
                 <Trash2 size={16} /> Excluir Conta
               </button>
             </div>
          </form>
        </div>
      </div>

      {/* Additional Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
         <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Zap size={16} />
              </div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Notificações</h4>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Novas Candidaturas', key: 'newApplications' as const },
                { label: 'Alertas de IA', key: 'aiAlerts' as const },
                { label: 'Resumo Semanal', key: 'weeklySummary' as const },
              ].map((pref) => {
                const active = notifications[pref.key];
                return (
                  <div key={pref.key} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{pref.label}</span>
                    <div 
                      onClick={() => handleToggleNotification(pref.key)}
                      className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${active ? 'bg-primary-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] shadow-sleek border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Building size={16} />
              </div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Segurança</h4>
            </div>
            <button 
              type="button"
              onClick={() => alert('Simulação: Alterar senha.')}
              className="w-full py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all mb-3"
            >
              Alterar Senha
            </button>
            <button 
              type="button"
              onClick={() => alert('Simulação: Ativar 2FA.')}
              className="w-full py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
            >
              Ativar Autenticação 2FA
            </button>
         </div>
      </div>
    </motion.div>
  );
};
