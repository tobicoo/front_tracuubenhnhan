import { useNavigate } from 'react-router-dom';
import { Activity, Users, Shield, Calendar, FileText, Heart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">Bệnh viện Đa khoa Trung ương</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Hệ thống tra cứu hồ sơ bệnh nhân điện tử
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Quản lý hồ sơ sức khỏe của bạn một cách dễ dàng, an toàn và hiện đại. 
            Truy cập thông tin y tế mọi lúc, mọi nơi.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Bắt đầu ngay
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Tính năng nổi bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-12 h-12 text-blue-600" />}
              title="Dành cho Người bệnh"
              description="Tra cứu hồ sơ khám bệnh, quản lý tiền sử bệnh lý và thông tin cá nhân"
            />
            <FeatureCard
              icon={<FileText className="w-12 h-12 text-green-600" />}
              title="Dành cho Bác sĩ"
              description="Quản lý hồ sơ bệnh án, lập phác đồ điều trị và lịch khám"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-purple-600" />}
              title="Quản trị hệ thống"
              description="Bảo mật dữ liệu, quản lý người dùng và phân quyền"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Lợi ích khi sử dụng
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <BenefitCard
              icon={<Calendar className="w-10 h-10 text-blue-600" />}
              title="Tiện lợi 24/7"
              description="Truy cập hồ sơ bệnh án của bạn bất cứ lúc nào, bất cứ nơi đâu"
            />
            <BenefitCard
              icon={<Shield className="w-10 h-10 text-blue-600" />}
              title="An toàn & Bảo mật"
              description="Dữ liệu được mã hóa và bảo vệ với công nghệ tiên tiến"
            />
            <BenefitCard
              icon={<Heart className="w-10 h-10 text-blue-600" />}
              title="Chăm sóc tốt hơn"
              description="Bác sĩ có đầy đủ thông tin để đưa ra phương án điều trị tối ưu"
            />
            <BenefitCard
              icon={<FileText className="w-10 h-10 text-blue-600" />}
              title="Quản lý dễ dàng"
              description="Tất cả thông tin y tế của bạn được tổ chức khoa học"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6" />
                <span className="text-xl font-bold">Bệnh viện Đa khoa Trung ương</span>
              </div>
              <p className="text-gray-400">
                Hệ thống quản lý hồ sơ bệnh nhân điện tử hiện đại và an toàn
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Liên hệ</h3>
              <p className="text-gray-400">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
              <p className="text-gray-400">Điện thoại: (028) 1234 5678</p>
              <p className="text-gray-400">Email: info@hospital.vn</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Giờ làm việc</h3>
              <p className="text-gray-400">Thứ 2 - Thứ 6: 7:00 - 20:00</p>
              <p className="text-gray-400">Thứ 7 - Chủ nhật: 8:00 - 17:00</p>
              <p className="text-gray-400">Cấp cứu: 24/7</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Bệnh viện Đa khoa Trung ương. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}