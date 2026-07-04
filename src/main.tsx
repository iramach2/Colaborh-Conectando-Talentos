import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ColaborhAlertProvider } from './components/ColaborhAlertProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ColaborhAlertProvider>
    <App />
  </ColaborhAlertProvider>,
);
