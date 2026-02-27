import { RTLProvider } from './RTLProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Dashboard } from './components/Dashboard/Dashboard';

import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/AuthGuard';

function Main() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 text-gray-900">
      <header className="p-4 bg-blue-600 text-white shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">Miri AI Dashboard</h1>
      </header>
      <main className="flex-1 overflow-hidden p-4">
        <Routes>
          <Route path="/" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RTLProvider>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </RTLProvider>
    </AuthProvider>
  );
}

export default App;
