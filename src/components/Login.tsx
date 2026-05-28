import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Mail, Lock, Phone, Building, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: (role: 'candidate' | 'company') => void;
  initialMode?: 'login' | 'register';
}

export default function Login({ onBack, onLoginSuccess, initialMode = 'login' }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [regType, setRegType] = useState<'candidate' | 'company'>('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    whatsapp: '',
    password: '',
    confirmPassword: ''
  });

  const toggleMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage(null);
  };

  const toggleRegType = (newType: 'candidate' | 'company') => {
    setRegType(newType);
    setErrorMessage(null);
  };

  const handleAuth = async () => {
    setErrorMessage(null);
    if (!formData.email || !formData.password) {
      setErrorMessage('Por favor, preencha e-mail e senha.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'register') {
        if (!formData.fullName) {
          setErrorMessage('Por favor, preencha seu nome completo.');
          setIsLoading(false);
          return;
        }

        if (regType === 'company' && !formData.companyName) {
          setErrorMessage('Por favor, preencha o nome da empresa.');
          setIsLoading(false);
          return;
        }

        if (!formData.whatsapp) {
          setErrorMessage('Por favor, preencha seu celular/WhatsApp.');
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setErrorMessage('As senhas não coincidem. Verifique e tente novamente.');
          setIsLoading(false);
          return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(formData.password)) {
          setErrorMessage('A senha deve conter pelo menos 6 caracteres, uma letra maiúscula e um número.');
          setIsLoading(false);
          return;
        }

        // Verificar se já existe cadastro com o mesmo email ou celular na base de dados
        if (import.meta.env.VITE_SUPABASE_URL) {
          const { data: existingTalents, error: checkError } = await supabase
            .from('talents')
            .select('email, phone');

          if (!checkError && existingTalents) {
            const emailDup = existingTalents.find(t => 
              t.email && t.email.toLowerCase().trim() === formData.email.toLowerCase().trim()
            );
            if (emailDup) {
              setErrorMessage('Este e-mail já está cadastrado em nosso sistema.');
              setIsLoading(false);
              return;
            }

            const cleanInputPhone = formData.whatsapp.replace(/\D/g, '');
            if (cleanInputPhone) {
              const phoneDup = existingTalents.find(t => {
                if (!t.phone) return false;
                const cleanExistingPhone = t.phone.replace(/\D/g, '');
                return cleanExistingPhone === cleanInputPhone;
              });
              if (phoneDup) {
                setErrorMessage('Este número de celular/WhatsApp já está cadastrado.');
                setIsLoading(false);
                return;
              }
            }
          }
        }

        // 1. Sign up user
        const { error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: regType,
              company_name: formData.companyName,
              whatsapp: formData.whatsapp
            }
          }
        });

        if (authError) throw authError;

        // Salvar dados básicos na tabela 'talents' para validação futura de duplicados de e-mail/celular
        if (import.meta.env.VITE_SUPABASE_URL) {
          await supabase.from('talents').upsert([{
            email: formData.email,
            phone: formData.whatsapp,
            name: formData.fullName,
            role: regType === 'company' ? 'Empresa' : 'Candidato',
            skills: [],
            city: '',
            state: ''
          }], { onConflict: 'email' });
        }

        setOtpEmail(formData.email);
        setIsVerifyingOtp(true);
        alert('Cadastro realizado! Por favor, insira o código enviado para o seu e-mail.');
      } else {
        // Login
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          if (authError.message.includes('Email not confirmed')) {
            setOtpEmail(formData.email);
            setIsVerifyingOtp(true);
            throw new Error('E-mail não confirmado. Enviamos um código para você.');
          }
          throw authError;
        }

        // Try to get role from metadata
        const role = authData.user?.user_metadata?.role || 'candidate';
        onLoginSuccess(role);
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      setErrorMessage(error.message || 'Ocorreu um erro no processo.');
      
      // Fallback for demo if Supabase Auth is not fully configured (no tables/etc)
      if (error.message?.includes('not found') || error.message?.includes('Database error')) {
        console.warn('Usando fallback para demonstração...');
        onLoginSuccess(mode === 'register' ? regType : 'candidate');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      alert('Por favor, insira o código de verificação recebido.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: otpCode,
        type: 'signup'
      });

      if (error) throw error;

      alert('E-mail confirmado com sucesso!');
      
      // Get role and finish
      const role = data.user?.user_metadata?.role || regType || 'candidate';
      onLoginSuccess(role);
    } catch (error: any) {
      console.error('Erro na verificação:', error);
      alert(error.message || 'Código inválido ou expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f0ff] relative overflow-hidden flex flex-col">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[120px] opacity-40" />
      
      {/* Navigation Header for Login */}
      <header className="p-4 md:p-6 relative z-10 grid grid-cols-3 items-center w-full">
        <div className="flex justify-start">
          <button 
            onClick={onBack}
            className="text-primary-600 hover:text-primary-700 transition-colors group p-2 -ml-2 flex items-center justify-center"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
          </button>
        </div>
        <div className="flex justify-center">
          <img 
            src="/logo.png" 
            alt="Colaborh Logo" 
            className="h-8 md:h-12 w-auto object-contain"
          />
        </div>
        <div className="flex justify-end" />
      </header>

      {/* Auth Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:py-4 py-8 relative z-10 md:-mt-6 mt-2">
        <motion.div 
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className={`bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(124,58,237,0.15)] overflow-hidden flex flex-col md:flex-row max-w-[1100px] w-full md:h-[650px] h-auto min-h-0 md:max-h-[95vh] max-h-none ${mode === 'register' ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Form Side (60%) */}
          <motion.div 
            layout
            className="md:flex-[1.5] p-6 md:p-10 flex flex-col items-center justify-center bg-white md:overflow-y-auto overflow-visible w-full min-h-0"
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${mode}-${regType}`}
                initial={{ opacity: 0, x: mode === 'login' ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 15 : -15 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-[650px]"
              >
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-2 md:whitespace-nowrap">
                    {isVerifyingOtp ? 'Confirme seu E-mail' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
                  </h1>
                  <div className="w-12 h-1 rounded-full bg-highlight-500 mx-auto" />
                </div>

                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl"
                  >
                    <p className="text-xs font-bold text-red-600">
                      {errorMessage}
                    </p>
                  </motion.div>
                )}

                {isVerifyingOtp ? (
                  <div className="space-y-6 max-w-[400px] mx-auto text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-loose">
                      Enviamos um código de 8 dígitos para <br/>
                      <span className="text-primary-600 underline">{otpEmail}</span>
                    </p>
                    
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-4">Código de Verificação</label>
                      <input 
                        type="text" 
                        maxLength={8}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-black text-2xl tracking-[0.5em] text-center"
                        placeholder="00000000"
                      />
                    </div>

                    <button 
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isLoading}
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar Código'}
                    </button>

                    <button 
                      onClick={() => setIsVerifyingOtp(false)}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors"
                    >
                      Voltar e corrigir e-mail
                    </button>
                  </div>
                ) : (
                  <>
                    {mode === 'register' && (
                  <div className="flex bg-slate-100 p-1 rounded-full mb-6 max-w-[300px] mx-auto">
                    <button 
                      onClick={() => toggleRegType('candidate')}
                      className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${regType === 'candidate' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      Candidato
                    </button>
                    <button 
                      onClick={() => toggleRegType('company')}
                      className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${regType === 'company' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      Empresa
                    </button>
                  </div>
                )}

                <form className="space-y-4">
                  <div className={`grid grid-cols-1 ${mode === 'register' ? 'sm:grid-cols-2' : ''} gap-4`}>
                    {mode === 'register' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-4">Nome Completo</label>
                        <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text" 
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-medium text-sm"
                            placeholder="Seu nome"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-4">E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-medium text-sm"
                          placeholder="exemplo@email.com"
                        />
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-4">WhatsApp</label>
                        <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="tel" 
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                            className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-medium text-sm"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                      </div>
                    )}

                    {mode === 'register' && regType === 'company' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-4">Nome da Primeira Empresa</label>
                        <div className="relative">
                          <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text" 
                            value={formData.companyName}
                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-medium text-sm"
                            placeholder="Nome da empresa"
                          />
                        </div>
                      </div>
                    )}

                    {mode === 'register' && regType === 'candidate' && <div className="hidden sm:block" />}

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-4">Senha</label>
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all text-slate-900 font-medium text-sm"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {mode === 'register' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest pl-4">Confirmar Senha</label>
                        <div className="relative">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className={`w-full pl-12 pr-12 py-3 bg-slate-50 border-2 rounded-xl outline-none transition-all text-slate-900 font-medium text-sm ${
                              formData.confirmPassword && formData.password === formData.confirmPassword 
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-50' 
                              : 'border-transparent focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50'
                            }`}
                            placeholder="••••••••"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                              <CheckCircle2 size={16} className="text-green-500" />
                            )}
                            <button 
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="text-slate-400 hover:text-primary-500 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {mode === 'login' && (
                    <div className="text-center">
                      <button type="button" className="text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors border-b-2 border-slate-200 border-dashed pb-0.5">
                        Esqueceu sua senha?
                      </button>
                    </div>
                  )}

                  <div className={`space-y-3 pt-3 max-w-[380px] mx-auto ${mode === 'register' ? 'sm:col-span-2' : ''}`}>
                    {mode === 'register' && (
                      <p className="text-[10px] text-slate-400 text-center mb-2 px-4 leading-tight">
                        Ao clicar em cadastrar, você aceita nossos termos de uso.
                      </p>
                    )}
                    <button 
                      type="button"
                      onClick={handleAuth}
                      disabled={isLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-highlight-500 text-white font-bold rounded-full shadow-lg shadow-highlight-500/20 hover:shadow-xl hover:shadow-highlight-500/30 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        mode === 'login' ? 'Entrar' : 'Cadastrar'
                      )}
                    </button>

                    {mode === 'login' && (
                      <button 
                        type="button"
                        className="w-full py-3 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-50 transition-all flex items-center justify-center uppercase tracking-widest text-[10px]"
                      >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuar com Google
                      </button>
                    )}
                  </div>
                </form>

                {/* Mobile alternator link - visible ONLY on mobile */}
                <div className="mt-6 text-center block md:hidden">
                  <p className="text-xs text-slate-500 font-semibold">
                    {mode === 'login' ? 'Não tem uma conta?' : 'Já possui uma conta?'}
                    <button
                      type="button"
                      onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')}
                      className="ml-1.5 font-bold text-primary-600 hover:text-primary-700 focus:outline-none"
                    >
                      {mode === 'login' ? 'Criar nova conta' : 'Fazer Login'}
                    </button>
                  </p>
                </div>
                </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Welcome/Decoration Side (40%) */}
          <motion.div 
            layout
            className="hidden md:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-highlight-600 p-8 relative items-center justify-center overflow-hidden"
          >
            {/* Decorative shapes and blobs */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
               {[...Array(12)].map((_, i) => (
                 <div 
                   key={i}
                   className="absolute bg-white rounded-xl border-2 border-white/20"
                   style={{
                     width: `${Math.random() * 30 + 15}px`,
                     height: `${Math.random() * 30 + 15}px`,
                     top: `${Math.random() * 100}%`,
                     left: `${Math.random() * 100}%`,
                     transform: `rotate(${Math.random() * 90}deg)`,
                     opacity: Math.random() * 0.4 + 0.1
                   }}
                 />
               ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 text-center text-white w-full max-w-[280px]"
              >
                <h2 className="text-3xl font-extrabold mb-4 leading-tight">
                  {mode === 'login' ? 'Olá, amigo(a)' : 'Seja bem-vindo!'}
                </h2>
                <p className="text-sm text-primary-50 font-medium mb-8 leading-relaxed opacity-90 mx-auto">
                  {mode === 'login' 
                    ? 'Informe seu e-mail e senha para entrar na plataforma' 
                    : 'Cadastre-se para começar sua jornada com a gente.'}
                </p>

                <div className="space-y-4 pt-4 border-t border-white/20">
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                    {mode === 'login' ? 'Não tem uma conta?' : 'Já possui conta?'}
                  </p>
                  <button 
                    type="button"
                    onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')}
                    className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all uppercase tracking-widest text-[10px]"
                  >
                    {mode === 'login' ? 'Criar nova conta' : 'Fazer Login'}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[60px]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Footer mimic */}
      <footer className="p-4 md:p-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] relative z-10">
        © {new Date().getFullYear()} Colaborh - Tecnologia e Empatia
      </footer>
    </div>
  );
}
