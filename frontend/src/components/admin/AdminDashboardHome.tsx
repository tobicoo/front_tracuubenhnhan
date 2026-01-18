import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Activity, TrendingUp, UserPlus, Lock, Key, AlertCircle, BarChart3 } from 'lucide-react';

interface User {
  id: string;
  username: string;
  role: string;
  profile: {
    name: string;
  };
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

interface AdminDashboardHomeProps {
  adminName: string;
}

export default function AdminDashboardHome({ adminName }: AdminDashboardHomeProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalAdmins: 0,
    recentActivities: [] as AuditEntry[],
    encryptionEnabled: false,
    twoFactorAuth: false
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Load users
    const usersData = localStorage.getItem('users');
    let totalUsers = 0;
    let totalPatients = 0;
    let totalDoctors = 0;
    let totalAdmins = 0;

    if (usersData) {
      const users: User[] = JSON.parse(usersData);
      totalUsers = users.length;
      totalPatients = users.filter(u => u.role === 'patient').length;
      totalDoctors = users.filter(u => u.role === 'doctor').length;
      totalAdmins = users.filter(u => u.role === 'admin').length;
    }

    // Load security settings
    const securityData = localStorage.getItem('securitySettings');
    let encryptionEnabled = false;
    let twoFactorAuth = false;
    let recentActivities: AuditEntry[] = [];

    if (securityData) {
      const settings = JSON.parse(securityData);
      encryptionEnabled = settings.encryptionEnabled || false;
      twoFactorAuth = settings.twoFactorAuth || false;
      recentActivities = (settings.auditLog || []).slice(0, 5);
    }

    setStats({
      totalUsers,
      totalPatients,
      totalDoctors,
      totalAdmins,
      recentActivities,
      encryptionEnabled,
      twoFactorAuth
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const getRoleDistribution = () => {
    const total = stats.totalUsers;
    if (total === 0) return { patients: 0, doctors: 0, admins: 0 };
    
    return {
      patients: Math.round((stats.totalPatients / total) * 100),
      doctors: Math.round((stats.totalDoctors / total) * 100),
      admins: Math.round((stats.totalAdmins / total) * 100)
    };
  };

  const distribution = getRoleDistribution();

  return (
    <div className="max-w-7xl">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl shadow-lg p-8 mb-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {adminName}!
        </h1>
        <p className="text-purple-100">
          Quản trị hệ thống - Tổng quan hoạt động
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<Users className="w-8 h-8 text-blue-600" />}
          title="Tổng người dùng"
          value={stats.totalUsers.toString()}
          bgColor="bg-blue-50"
          iconBg="bg-blue-100"
          trend="+0%"
        />
        
        <StatCard
          icon={<Activity className="w-8 h-8 text-green-600" />}
          title="Bệnh nhân"
          value={stats.totalPatients.toString()}
          bgColor="bg-green-50"
          iconBg="bg-green-100"
          trend={`${distribution.patients}%`}
        />
        
        <StatCard
          icon={<Shield className="w-8 h-8 text-orange-600" />}
          title="Bác sĩ"
          value={stats.totalDoctors.toString()}
          bgColor="bg-orange-50"
          iconBg="bg-orange-100"
          trend={`${distribution.doctors}%`}
        />
        
        <StatCard
          icon={<Key className="w-8 h-8 text-purple-600" />}
          title="Quản trị viên"
          value={stats.totalAdmins.toString()}
          bgColor="bg-purple-50"
          iconBg="bg-purple-100"
          trend={`${distribution.admins}%`}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Phân bố người dùng
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Bệnh nhân</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalPatients} ({distribution.patients}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${distribution.patients}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Bác sĩ</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalDoctors} ({distribution.doctors}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${distribution.doctors}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Quản trị viên</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalAdmins} ({distribution.admins}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${distribution.admins}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.totalPatients}</p>
                <p className="text-xs text-gray-600">Người bệnh</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.totalDoctors}</p>
                <p className="text-xs text-gray-600">Bác sĩ</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.totalAdmins}</p>
                <p className="text-xs text-gray-600">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Trạng thái bảo mật
          </h2>

          <div className="space-y-4">
            <SecurityStatusItem
              icon={<Lock className="w-5 h-5" />}
              title="Mã hóa dữ liệu"
              status={stats.encryptionEnabled}
              description={stats.encryptionEnabled ? "Đang bật" : "Đang tắt"}
            />

            <SecurityStatusItem
              icon={<Key className="w-5 h-5" />}
              title="Xác thực hai yếu tố"
              status={stats.twoFactorAuth}
              description={stats.twoFactorAuth ? "Đang bật" : "Đang tắt"}
            />

            <SecurityStatusItem
              icon={<Shield className="w-5 h-5" />}
              title="Master Key"
              status={true}
              description="Đã cấu hình"
            />
          </div>

          <button
            onClick={() => navigate('/admin/security')}
            className="mt-6 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Quản lý bảo mật
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Hoạt động gần đây
          </h2>
          <button
            onClick={() => navigate('/admin/security')}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Xem tất cả →
          </button>
        </div>

        {stats.recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Chưa có hoạt động nào được ghi nhận</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentActivities.map(activity => (
              <div
                key={activity.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Người thực hiện: {activity.user}</p>
                <p className="text-sm text-gray-700 mt-1">{activity.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Thao tác nhanh
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <QuickActionCard
            icon={<UserPlus className="w-6 h-6 text-blue-600" />}
            title="Thêm người dùng mới"
            description="Tạo tài khoản cho bệnh nhân, bác sĩ hoặc admin"
            onClick={() => navigate('/admin')}
          />
          
          <QuickActionCard
            icon={<Users className="w-6 h-6 text-green-600" />}
            title="Quản lý người dùng"
            description="Xem và chỉnh sửa thông tin người dùng"
            onClick={() => navigate('/admin')}
          />
          
          <QuickActionCard
            icon={<Shield className="w-6 h-6 text-purple-600" />}
            title="Cài đặt bảo mật"
            description="Cấu hình bảo mật và phân quyền"
            onClick={() => navigate('/admin/security')}
          />
          
          <QuickActionCard
            icon={<Key className="w-6 h-6 text-orange-600" />}
            title="Master Key"
            description="Quản lý khóa mã hóa hệ thống"
            onClick={() => navigate('/admin/security')}
          />
        </div>
      </div>

      {/* System Health */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm p-6 border border-green-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Tình trạng hệ thống</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Hệ thống: <strong className="text-green-600">Hoạt động tốt</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Bảo mật: <strong className="text-green-600">An toàn</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Dữ liệu: <strong className="text-green-600">Đã sao lưu</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bgColor, iconBg, trend }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
  iconBg: string;
  trend: string;
}) {
  return (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-100`}>
      <div className={`${iconBg} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <span className="text-xs text-gray-500 mb-1">{trend}</span>
      </div>
    </div>
  );
}

function SecurityStatusItem({ icon, title, status, description }: {
  icon: React.ReactNode;
  title: string;
  status: boolean;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
