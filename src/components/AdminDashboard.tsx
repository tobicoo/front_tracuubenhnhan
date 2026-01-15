import { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Activity, Shield, Users, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { User } from '../App';
import AdminDashboardHome from './admin/AdminDashboardHome';
import UserManagement from './admin/UserManagement';
import SecuritySettings from './admin/SecuritySettings';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
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
              <Activity className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-purple-900">Quản trị hệ thống</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user.profile.name}</p>
              <p className="text-sm text-gray-600">Quản trị viên</p>
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
              to="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600"
            >
              <LayoutDashboard className="w-5 h-5" />
              Tổng quan
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600"
            >
              <Users className="w-5 h-5" />
              Quản lý người dùng
            </Link>
            <Link
              to="/admin/security"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600"
            >
              <Shield className="w-5 h-5" />
              Bảo mật & Master Key
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<AdminDashboardHome adminName={user.profile.name} />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/security" element={<SecuritySettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}