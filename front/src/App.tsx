import { BrowserRouter as Router, Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner.tsx'
import { Home, Plus, List, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardPage from './pages/dashboard';
import { NewMaintenance } from './pages/NewMaintenance';
import MaintenanceList from './pages/MaintenanceList';
import { Reports } from './pages/Reports';
import { MaintenanceDialog } from './components/maintenance/MaintenanceDialog';

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Nova Manutenção", href: "/new-maintenance", icon: Plus },
  { name: "Lista de Manutenções", href: "/maintenance-list", icon: List },
  { name: "Relatórios", href: "/reports", icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen flex flex-col justify-between bg-white shadow-lg border-r border-slate-200 hidden md:flex z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Settings className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">MaintControl</h2>
            <p className="text-sm text-slate-500">Sistema de Manutenções</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-6 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
            <Settings className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">Admin User</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-auto">
      <aside className="w-[255px] h-full bg-slate-800 text-white">
        <Sidebar />
      </aside>
      <main className="flex-1 h-full">
        <Outlet />
      </main>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new-maintenance" element={<NewMaintenance />} />
          <Route path="/maintenance-list" element={<MaintenanceList />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;