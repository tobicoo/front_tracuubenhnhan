import { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Activity, Search, FileText, Calendar, LogOut, Menu, X, Stethoscope, LayoutDashboard } from 'lucide-react';
import { User } from '../App';
import DoctorDashboardHome from './doctor/DoctorDashboardHome';
import SearchPatients from './doctor/SearchPatients';
import ManageRecords from './doctor/ManageRecords';
import TreatmentPlans from './doctor/TreatmentPlans';
import DoctorSchedule from './doctor/DoctorSchedule';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
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
              <Activity className="w-8 h-8 text-green-600" />
              <span className="text-xl font-bold text-green-900">Hệ thống bác sĩ</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user.profile.name}</p>
              <p className="text-sm text-gray-600">{user.profile.specialization}</p>
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
              to="/doctor"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
            >
              <LayoutDashboard className="w-5 h-5" />
              Tổng quan
            </Link>
            <Link
              to="/doctor/search"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
            >
              <Search className="w-5 h-5" />
              Tìm kiếm bệnh nhân
            </Link>
            <Link
              to="/doctor/records"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
            >
              <FileText className="w-5 h-5" />
              Quản lý hồ sơ bệnh án
            </Link>
            <Link
              to="/doctor/treatments"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
            >
              <Stethoscope className="w-5 h-5" />
              Phác đồ điều trị
            </Link>
            <Link
              to="/doctor/schedule"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600"
            >
              <Calendar className="w-5 h-5" />
              Lịch khám
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<DoctorDashboardHome doctorId={user.id} doctorName={user.profile.name} />} />
            <Route path="/search" element={<SearchPatients doctorId={user.id} />} />
            <Route path="/records" element={<ManageRecords doctorId={user.id} />} />
            <Route path="/treatments" element={<TreatmentPlans doctorId={user.id} />} />
            <Route path="/schedule" element={<DoctorSchedule doctorId={user.id} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}