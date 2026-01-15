import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, FileText, Calendar, Heart, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  diagnosis: string;
}

interface MedicalCondition {
  id: string;
  patientId: string;
  condition: string;
  type: string;
  status: string;
}

interface PatientDashboardHomeProps {
  userId: string;
  userName: string;
}

export default function PatientDashboardHome({ userId, userName }: PatientDashboardHomeProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVisits: 0,
    activeConditions: 0,
    upcomingAppointments: 0,
    recentVisits: [] as MedicalRecord[]
  });

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = () => {
    // Load medical records
    const recordsData = localStorage.getItem('medicalRecords');
    let totalVisits = 0;
    let recentVisits: MedicalRecord[] = [];
    
    if (recordsData) {
      const allRecords: MedicalRecord[] = JSON.parse(recordsData);
      const userRecords = allRecords.filter(r => r.patientId === userId);
      totalVisits = userRecords.length;
      recentVisits = userRecords
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
    }

    // Load medical conditions
    const historyData = localStorage.getItem('medicalHistory');
    let activeConditions = 0;
    
    if (historyData) {
      const allHistory: MedicalCondition[] = JSON.parse(historyData);
      activeConditions = allHistory.filter(
        h => h.patientId === userId && h.status === 'active'
      ).length;
    }

    // Load appointments (would be implemented if appointments exist for patients)
    const upcomingAppointments = 0;

    setStats({
      totalVisits,
      activeConditions,
      upcomingAppointments,
      recentVisits
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <div className="max-w-7xl">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow-lg p-8 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {userName}!
        </h1>
        <p className="text-blue-100">
          Chào mừng bạn đến với hệ thống quản lý hồ sơ sức khỏe
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<FileText className="w-8 h-8 text-blue-600" />}
          title="Tổng lượt khám"
          value={stats.totalVisits.toString()}
          bgColor="bg-blue-50"
          iconBg="bg-blue-100"
        />
        
        <StatCard
          icon={<Heart className="w-8 h-8 text-red-600" />}
          title="Bệnh lý đang điều trị"
          value={stats.activeConditions.toString()}
          bgColor="bg-red-50"
          iconBg="bg-red-100"
        />
        
        <StatCard
          icon={<Calendar className="w-8 h-8 text-green-600" />}
          title="Lịch hẹn sắp tới"
          value={stats.upcomingAppointments.toString()}
          bgColor="bg-green-50"
          iconBg="bg-green-100"
        />
        
        <StatCard
          icon={<Activity className="w-8 h-8 text-purple-600" />}
          title="Tình trạng"
          value="Tốt"
          bgColor="bg-purple-50"
          iconBg="bg-purple-100"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Visits */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Lượt khám gần đây
            </h2>
            <button
              onClick={() => navigate('/patient/records')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả →
            </button>
          </div>

          {stats.recentVisits.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Chưa có lượt khám nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentVisits.map(visit => (
                <div
                  key={visit.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer"
                  onClick={() => navigate('/patient/records')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{visit.diagnosis}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(visit.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">BS. {visit.doctorName}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Thao tác nhanh
          </h2>

          <div className="space-y-3">
            <QuickActionCard
              icon={<FileText className="w-6 h-6 text-blue-600" />}
              title="Tra cứu hồ sơ khám"
              description="Xem lịch sử khám bệnh và đơn thuốc"
              onClick={() => navigate('/patient/records')}
            />
            
            <QuickActionCard
              icon={<Activity className="w-6 h-6 text-purple-600" />}
              title="Cập nhật thông tin"
              description="Chỉnh sửa thông tin cá nhân"
              onClick={() => navigate('/patient')}
            />
            
            <QuickActionCard
              icon={<Heart className="w-6 h-6 text-red-600" />}
              title="Quản lý tiền sử bệnh"
              description="Thêm hoặc cập nhật tiền sử bệnh lý"
              onClick={() => navigate('/patient')}
            />
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm p-6 border border-green-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Lời khuyên sức khỏe hôm nay</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Uống đủ 2 lít nước mỗi ngày để duy trì sức khỏe</li>
              <li>• Tập thể dục ít nhất 30 phút mỗi ngày</li>
              <li>• Ngủ đủ 7-8 tiếng mỗi đêm</li>
              <li>• Ăn nhiều rau xanh và trái cây</li>
            </ul>
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
      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
