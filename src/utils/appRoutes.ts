const COMPANY_TAB_ASSESSMENTS = 'Avaliações';
const COMPANY_TAB_SETTINGS = 'Configurações';
const CANDIDATE_TAB_RESUME = 'Meu Currículo';
const CANDIDATE_TAB_SETTINGS = 'Configurações';

export const COMPANY_ROUTES = [
  { tab: 'Dashboard', path: '/empresa/dashboard' },
  { tab: 'Cadastrar Vaga', path: '/empresa/cadastrar-vaga' },
  { tab: 'Minhas Vagas', path: '/empresa/minhas-vagas' },
  { tab: 'Banco de Talentos', path: '/empresa/banco-de-talentos' },
  { tab: 'Empresas', path: '/empresa/empresas' },
  { tab: COMPANY_TAB_ASSESSMENTS, path: '/empresa/avaliacoes' },
  { tab: 'Entrevistas', path: '/empresa/entrevistas' },
  { tab: 'Faturamento', path: '/empresa/faturamento' },
  { tab: COMPANY_TAB_SETTINGS, path: '/empresa/configuracoes' },
] as const;

export const CANDIDATE_ROUTES = [
  { tab: CANDIDATE_TAB_RESUME, path: '/candidato/curriculo' },
  { tab: 'Vagas', path: '/candidato/vagas' },
  { tab: 'Testes', path: '/candidato/testes' },
  { tab: 'Entrevistas', path: '/candidato/entrevistas' },
  { tab: CANDIDATE_TAB_SETTINGS, path: '/candidato/configuracoes' },
] as const;

const companyAliases = new Map<string, string>([]);

const candidateAliases = new Map<string, string>([]);

const trailingSlashPattern = new RegExp('/+$');
const sharedJobPathPattern = new RegExp('^/vaga/([^/]+)$');

const normalizePath = (path: string) => {
  const cleaned = path.split('?')[0].split('#')[0].replace(trailingSlashPattern, '');
  return cleaned || '/';
};

const getRoutePath = (routes: readonly { tab: string; path: string }[], tab: string, aliases: Map<string, string>) => {
  const normalizedTab = aliases.get(tab) || tab;
  return routes.find((route) => route.tab === normalizedTab)?.path;
};

export const getCompanyTabFromPath = (path: string) => {
  const normalizedPath = normalizePath(path);
  return COMPANY_ROUTES.find((route) => route.path === normalizedPath)?.tab || null;
};

export const getCandidateTabFromPath = (path: string) => {
  const normalizedPath = normalizePath(path);
  return CANDIDATE_ROUTES.find((route) => route.path === normalizedPath)?.tab || null;
};

export const getCompanyPathForTab = (tab: string) => getRoutePath(COMPANY_ROUTES, tab, companyAliases);
export const getCandidatePathForTab = (tab: string) => getRoutePath(CANDIDATE_ROUTES, tab, candidateAliases);

export const pushAppPath = (path: string, replace = false) => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === path && !window.location.search && !window.location.hash) return;
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', path);
};

export const navigateToCompanyTab = (tab: string, replace = false) => {
  const path = getCompanyPathForTab(tab);
  if (path) pushAppPath(path, replace);
};

export const navigateToCandidateTab = (tab: string, replace = false) => {
  const path = getCandidatePathForTab(tab);
  if (path) pushAppPath(path, replace);
};

export const getSharedJobIdFromLocation = () => {
  if (typeof window === 'undefined') return null;
  const pathMatch = normalizePath(window.location.pathname).match(sharedJobPathPattern);
  if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);

  const params = new URLSearchParams(window.location.search);
  return params.get('vaga') || params.get('jobId');
};

export const isLoginPath = () => typeof window !== 'undefined' && normalizePath(window.location.pathname) === '/login';
export const isRegisterPath = () => typeof window !== 'undefined' && normalizePath(window.location.pathname) === '/cadastro';
export const isResetPasswordPath = () => typeof window !== 'undefined' && normalizePath(window.location.pathname) === '/reset-password';
