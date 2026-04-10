import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { BottomNav } from './components/layout/BottomNav';
import './styles/global.css';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const RecordPage = lazy(() => import('./pages/RecordPage').then(m => ({ default: m.RecordPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const base = import.meta.env.BASE_URL;

function PageLoader() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      <div className="skeleton" style={{ height: '200px', borderRadius: '20px' }} />
      <div className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
      <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={base}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Suspense>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
