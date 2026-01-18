import { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Activity, User as UserIcon, FileText, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { User } from '../App';
import PatientDashboardHome from './patient/PatientDashboardHome';
import PatientProfile from './patient/PatientProfile';
import PatientRecords from './patient/PatientRecords';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function PatientDashboard({ user, onLogout }: PatientDashboardProps) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-900">Hệ thống bệnh nhân</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user.profile.name}</p>
              <p className="text-sm text-gray-600">Người bệnh - {user.patientId || (user.profile as any)?.patientId}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 mt-[73px] lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            <Link
              to="/patient"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
            >
              <LayoutDashboard className="w-5 h-5" />
              Tổng quan
            </Link>
            <Link
              to="/patient/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
            >
              <UserIcon className="w-5 h-5" />
              Thông tin cá nhân
            </Link>
            <Link
              to="/patient/records"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600"
            >
              <FileText className="w-5 h-5" />
              Tra cứu hồ sơ khám
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<PatientDashboardHome userId={user.id} userName={user.profile.name} />} />
            <Route path="/profile" element={<PatientProfile user={user} />} />
            <Route path="/records" element={<PatientRecords userId={user.id} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}