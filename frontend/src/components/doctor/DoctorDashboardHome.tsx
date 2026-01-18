import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, TrendingUp, Clock, Activity, CheckCircle } from 'lucide-react';

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientName?: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

interface MedicalRecord {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
}

interface DoctorDashboardHomeProps {
  doctorId: string;
  doctorName: string;
}

export default function DoctorDashboardHome({ doctorId, doctorName }: DoctorDashboardHomeProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    thisWeekAppointments: 0,
    totalRecords: 0,
    todaySchedule: [] as Appointment[]
  });

  useEffect(() => {
    loadStats();
  }, [doctorId]);

  const loadStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const startOfWeek = getStartOfWeek();

    // Load appointments
    const appointmentsData = localStorage.getItem('appointments');
    let todayAppointments = 0;
    let thisWeekAppointments = 0;
    let todaySchedule: Appointment[] = [];

    if (appointmentsData) {
      const allAppointments: Appointment[] = JSON.parse(appointmentsData);
      const doctorAppointments = allAppointments.filter(a => a.doctorId === doctorId);
      
      todayAppointments = doctorAppointments.filter(a => a.date === today && a.status === 'scheduled').length;
      thisWeekAppointments = doctorAppointments.filter(a => {
        const aptDate = new Date(a.date);
        return aptDate >= startOfWeek && aptDate <= new Date() && a.status === 'scheduled';
      }).length;

      // Get today's schedule
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        todaySchedule = doctorAppointments
          .filter(a => a.date === today)
          .map(apt => ({
            ...apt,
            patientName: users.find((u: any) => u.id === apt.patientId)?.profile.name || 'Unknown'
          }))
          .sort((a, b) => a.time.localeCompare(b.time))
          .slice(0, 5);
      }
    }

    // Load medical records
    const recordsData = localStorage.getItem('medicalRecords');
    let totalRecords = 0;
    let uniquePatients = new Set<string>();

    if (recordsData) {
      const allRecords: MedicalRecord[] = JSON.parse(recordsData);
      const doctorRecords = allRecords.filter(r => r.doctorName.includes(doctorName.split(' ').pop() || ''));
      totalRecords = doctorRecords.length;
      doctorRecords.forEach(r => uniquePatients.add(r.patientId));
    }

    setStats({
      totalPatients: uniquePatients.size,
      todayAppointments,
      thisWeekAppointments,
      totalRecords,
      todaySchedule
    });
  };

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    return new Date(now.setDate(diff));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-xl shadow-lg p-8 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {doctorName}!
        </h1>
        <p className="text-green-100">
          Hôm nay bạn có {stats.todayAppointments} lịch khám
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title="Tổng bệnh nhân"
          value={stats.totalPatients.toString()}
          bgColor="bg-blue-50"
          iconBg="bg-blue-100"
        />
        
        <StatCard
          icon={<Calendar className="w-8 h-8 text-green-600" />}
          title="Lịch khám hôm nay"
          value={stats.todayAppointments.toString()}
          bgColor="bg-green-50"
          iconBg="bg-green-100"
        />
        
        <StatCard
          icon={<TrendingUp className="w-8 h-8 text-purple-600" />}
          title="Lịch khám tuần này"
          value={stats.thisWeekAppointments.toString()}
          bgColor="bg-purple-50"
          iconBg="bg-purple-100"
        />
        
        <StatCard
          icon={<FileText className="w-8 h-8 text-orange-600" />}
          title="Hồ sơ đã tạo"
          value={stats.totalRecords.toString()}
          bgColor="bg-orange-50"
          iconBg="bg-orange-100"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Lịch khám hôm nay
            </h2>
            <button
              onClick={() => navigate('/doctor/schedule')}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Xem tất cả →
            </button>
          </div>

          {stats.todaySchedule.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Không có lịch khám hôm nay</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.todaySchedule.map(apt => (
                <div
                  key={apt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded">
                        {apt.time}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{apt.patientName}</h3>
                        <p className="text-sm text-gray-600">{apt.type}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(apt.status)}`}>
                      {getStatusLabel(apt.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Thao tác nhanh
          </h2>

          <div className="space-y-3">
            <QuickActionCard
              icon={<Users className="w-6 h-6 text-blue-600" />}
              title="Tìm kiếm bệnh nhân"
              description="Tra cứu thông tin bệnh nhân"
              onClick={() => navigate('/doctor')}
            />
            
            <QuickActionCard
              icon={<FileText className="w-6 h-6 text-green-600" />}
              title="Quản lý hồ sơ bệnh án"
              description="Thêm hoặc chỉnh sửa hồ sơ"
              onClick={() => navigate('/doctor/records')}
            />
            
            <QuickActionCard
              icon={<Activity className="w-6 h-6 text-purple-600" />}
              title="Lập phác đồ điều trị"
              description="Tạo kế hoạch điều trị cho bệnh nhân"
              onClick={() => navigate('/doctor/treatments')}
            />

            <QuickActionCard
              icon={<Calendar className="w-6 h-6 text-orange-600" />}
              title="Quản lý lịch khám"
              description="Xem và cập nhật lịch khám"
              onClick={() => navigate('/doctor/schedule')}
            />
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Tổng quan hoạt động
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Bệnh nhân đã khám</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            <p className="text-xs text-gray-500 mt-1">Tổng số bệnh nhân</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Hồ sơ bệnh án</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
            <p className="text-xs text-gray-500 mt-1">Hồ sơ đã tạo</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Lịch khám tuần này</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.thisWeekAppointments}</p>
            <p className="text-xs text-gray-500 mt-1">Cuộc hẹn trong tuần</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bgColor, iconBg }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
  iconBg: string;
}) {
  return (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-100`}>
      <div className={`${iconBg} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuickActionCard({ icon, title, description, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
