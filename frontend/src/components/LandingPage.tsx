import { useNavigate } from 'react-router-dom';
import { Activity, Users, Shield, FileText, Heart, Lock, Clock, Database, Stethoscope, ClipboardList, UserCheck, Search, Calendar, TrendingUp, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import type { ReactNode } from "react";
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900">Bệnh viện Đa khoa Trung ương</div>
                <div className="text-xs text-gray-500">Hệ thống Quản lý Hồ sơ Điện tử</div>
              </div>
            </div>
            <div className="hidden md:block">
            <nav className="flex items-center gap-8">
              <a href="#gioi-thieu" className="text-gray-600 hover:text-blue-600 transition">Giới thiệu</a>
              <a href="#tinh-nang" className="text-gray-600 hover:text-blue-600 transition">Tính năng</a>
              <a href="#loi-ich" className="text-gray-600 hover:text-blue-600 transition">Lợi ích</a>
              <a href="#lien-he" className="text-gray-600 hover:text-blue-600 transition">Liên hệ</a>
            </nav>
            </div>
            <div className="flex items-center gap-3">
  <button
    onClick={() => navigate("/login")}
    className="h-10 px-5 flex items-center justify-center text-blue-600 border border-blue-600 rounded-lg
               leading-none whitespace-nowrap hover:bg-blue-50 transition"
  >
    Đăng nhập
  </button>

  <button
    onClick={() => navigate("/register")}
    className="h-10 px-5 flex items-center justify-center text-white bg-blue-600 rounded-lg
               leading-none whitespace-nowrap hover:bg-blue-700 transition"
  >
    Đăng ký
  </button>
</div>

          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-6">
                Hệ thống y tế hiện đại
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Hệ thống Tra cứu<br />
                Hồ sơ Bệnh nhân<br />
                <span className="text-blue-600">Điện tử</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Giải pháp quản lý hồ sơ sức khỏe toàn diện, an toàn và hiệu quả. 
                Kết nối bệnh nhân, bác sĩ và hệ thống quản trị trong một nền tảng thống nhất.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  Bắt đầu sử dụng
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Đăng nhập ngay
                </button>
              </div>
              
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBsYXB0b3AlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc2ODcyNTQ0NHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Hệ thống y tế điện tử"
                className="relative z-10 rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="gioi-thieu" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Title */}
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Về Hệ thống của chúng tôi
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Hệ thống quản lý hồ sơ bệnh nhân điện tử được xây dựng với công nghệ hiện đại,
        đáp ứng tiêu chuẩn an toàn thông tin y tế và tối ưu hóa quy trình khám chữa bệnh.
      </p>
    </div>

    {/* Content */}
    <div className="grid md:grid-cols-2 items-center gap-8 md:gap-16 lg:gap-20">
      
      {/* Image */}
      <div className="relative md:pr-6 lg:pr-10">
        {/* nền nhẹ để tách khối */}
        <div className="absolute -inset-4 rounded-3xl bg-blue-50 -z-10" />
        <img
          src="https://images.unsplash.com/photo-1758691462620-9018c602ed3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcmVjb3JkcyUyMGRpZ2l0YWx8ZW58MXx8fHwxNzY4NzI1NDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hồ sơ điện tử"
          className="w-full max-w-xl rounded-2xl shadow-lg object-cover"
        />
      </div>

      {/* Text */}
      <div className="md:pl-6 lg:pl-10">
        <div className="space-y-6">
          <FeatureItem
            icon={<Database className="w-6 h-6 text-blue-600" />}
            title="Lưu trữ tập trung"
            description="Tất cả hồ sơ bệnh án được lưu trữ an toàn trên hệ thống cloud với khả năng sao lưu tự động."
          />
          <FeatureItem
            icon={<Lock className="w-6 h-6 text-blue-600" />}
            title="Bảo mật cao"
            description="Mã hóa dữ liệu đầu cuối, phân quyền chi tiết và cơ chế Master Key cho quản trị viên."
          />
          <FeatureItem
            icon={<Clock className="w-6 h-6 text-blue-600" />}
            title="Truy cập nhanh chóng"
            description="Tra cứu thông tin bệnh nhân, lịch sử khám bệnh và kết quả xét nghiệm chỉ trong vài giây."
          />
          <FeatureItem
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
            title="Tối ưu quy trình"
            description="Giảm thời gian chờ đợi, nâng cao hiệu quả làm việc và cải thiện chất lượng chăm sóc."
          />
        </div>
      </div>

    </div>
  </div>
</section>


      {/* User Roles Section */}
      <section id="tinh-nang" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dành cho từng đối tượng người dùng
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hệ thống được thiết kế với 3 vai trò chính, mỗi vai trò có giao diện và tính năng phù hợp
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard
              icon={<Users className="w-12 h-12 text-blue-600" />}
              title="Người bệnh"
              features={[
                "Tra cứu hồ sơ và phiếu khám bệnh",
                "Xem chi tiết lượt khám và kết quả",
                "Quản lý tiền sử bệnh lý",
                "Cập nhật thông tin cá nhân",
                "Thay đổi mật khẩu an toàn"
              ]}
              color="blue"
            />
            <RoleCard
              icon={<Stethoscope className="w-12 h-12 text-green-600" />}
              title="Bác sĩ"
              features={[
                "Tìm kiếm hồ sơ bệnh nhân",
                "Quản lý hồ sơ bệnh án",
                "Lập phác đồ điều trị",
                "Quản lý lịch khám bệnh",
                "Theo dõi tiến trình điều trị"
              ]}
              color="green"
            />
            <RoleCard
              icon={<Shield className="w-12 h-12 text-purple-600" />}
              title="Quản trị viên"
              features={[
                "Quản lý người dùng hệ thống",
                "Phân quyền theo vai trò",
                "Quản trị bảo mật Master Key",
                "Giám sát hoạt động hệ thống",
                "Báo cáo và thống kê tổng quan"
              ]}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="loi-ich" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lợi ích khi sử dụng hệ thống
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nâng cao chất lượng dịch vụ y tế và trải nghiệm người dùng
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={<Search className="w-8 h-8 text-blue-600" />}
              title="Tra cứu dễ dàng"
              description="Tìm kiếm và truy cập hồ sơ bệnh án nhanh chóng với bộ lọc thông minh"
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="An toàn tuyệt đối"
              description="Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn bảo mật y tế quốc tế"
            />
            <BenefitCard
              icon={<ClipboardList className="w-8 h-8 text-blue-600" />}
              title="Quản lý tập trung"
              description="Tổ chức và quản lý toàn bộ thông tin y tế trong một hệ thống duy nhất"
            />
            <BenefitCard
              icon={<Calendar className="w-8 h-8 text-blue-600" />}
              title="Lịch sử đầy đủ"
              description="Lưu trữ toàn bộ lịch sử khám chữa bệnh và tiến trình điều trị"
            />
            <BenefitCard
              icon={<UserCheck className="w-8 h-8 text-blue-600" />}
              title="Phân quyền rõ ràng"
              description="Kiểm soát quyền truy cập dữ liệu theo từng vai trò người dùng"
            />
            <BenefitCard
              icon={<FileText className="w-8 h-8 text-blue-600" />}
              title="Báo cáo chi tiết"
              description="Xuất báo cáo và thống kê đa dạng phục vụ công tác quản lý"
            />
            <BenefitCard
              icon={<Heart className="w-8 h-8 text-blue-600" />}
              title="Chăm sóc tt hơn"
              description="Bác sĩ có cái nhìn tổng quan để đưa ra phương án điều trị hiệu quả"
            />
            <BenefitCard
              icon={<Clock className="w-8 h-8 text-blue-600" />}
              title="Tiết kiệm thời gian"
              description="Giảm thời gian xử lý hồ sơ và tăng thời gian tập trung vào bệnh nhân"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng trải nghiệm hệ thống?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để bắt đầu sử dụng hệ thống quản lý hồ sơ bệnh nhân điện tử hiện đại
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Đăng ký miễn phí
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-blue-800 transition font-medium"
            >
              Đăng nhập hệ thống
            </button>
          </div>
          
        </div>
      </section>

      {/* Footer */}
     <footer id="lien-he" className="bg-gray-900 text-white pt-8bg-gray-900 text-white pt-8 pb-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div className="grid gap-12 md:grid-cols-4">
      {/* Brand + Contact */}
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">Bệnh viện Đa khoa Trung ương</div>
            <div className="text-sm text-gray-400">Hệ thống Quản lý Hồ sơ Điện tử</div>
          </div>
        </div>

        <p className="text-gray-400 leading-relaxed max-w-xl">
          Giải pháp quản lý hồ sơ bệnh nhân điện tử toàn diện, hiện đại và an toàn.
          Kết nối bệnh nhân, bác sĩ và hệ thống quản trị trong một nền tảng thống nhất.
        </p>

        <div className="mt-6 space-y-3 text-gray-400">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <span>235 đường Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-500 shrink-0" />
            <span>(024) 2218 5629</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-500 shrink-0" />
            <span>info@hospital.vn</span>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="font-bold mb-4 text-lg">Liên kết nhanh</h3>

        <ul className="space-y-3 text-gray-400">
          <li>
            <a href="#gioi-thieu" className="hover:text-blue-400 transition">
              Giới thiệu
            </a>
          </li>
          <li>
            <a href="#tinh-nang" className="hover:text-blue-400 transition">
              Tính năng
            </a>
          </li>
          <li>
            <a href="#loi-ich" className="hover:text-blue-400 transition">
              Lợi ích
            </a>
          </li>
        </ul>

        {/* Buttons (đặt ngoài ul cho gọn + chuẩn) */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/login")}
            className="h-10 px-5 inline-flex items-center justify-center rounded-lg border border-blue-600
                       text-blue-300 hover:text-white hover:bg-blue-600 transition whitespace-nowrap"
            style={{ lineHeight: 1 }}
          >
            Đăng nhập
          </button>

          <button
            onClick={() => navigate("/register")}
            className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-blue-600
                       text-white hover:bg-blue-700 transition whitespace-nowrap shadow-sm"
            style={{ lineHeight: 1 }}
          >
            Đăng ký
          </button>
        </div>
      </div>

      {/* Working hours */}
      <div>
        <h3 className="font-bold mb-4 text-lg">Giờ làm việc</h3>

        <ul className="space-y-4 text-gray-400">
          <li>
            <div className="font-medium text-white">Thứ 2 - Thứ 6</div>
            <div className="text-sm">07:00 - 20:00</div>
          </li>
          <li>
            <div className="font-medium text-white">Thứ 7 - Chủ nhật</div>
            <div className="text-sm">08:00 - 17:00</div>
          </li>
          <li>
            <div className="font-medium text-white">Cấp cứu</div>
            <div className="text-sm">24/7</div>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-gray-800 mt-12 pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-gray-500 text-sm">
        © 2026 Bệnh viện Đa khoa Trung ương. Tất cả quyền được bảo lưu.
      </p>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
        <a href="#" className="hover:text-blue-400 transition">
          Chính sách bảo mật
        </a>
        <a href="#" className="hover:text-blue-400 transition">
          Điều khoản sử dụng
        </a>
        <a href="#" className="hover:text-blue-400 transition">
          Hỗ trợ
        </a>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function RoleCard({ icon, title, features, color }: { icon: ReactNode; title: string; features: string[]; color: string }) {
  const colorClasses = {
    blue: 'border-blue-200 hover:border-blue-400 hover:shadow-blue-100',
    green: 'border-green-200 hover:border-green-400 hover:shadow-green-100',
    purple: 'border-purple-200 hover:border-purple-400 hover:shadow-purple-100'
  };

  return (
    <div className={`bg-white border-2 ${colorClasses[color as keyof typeof colorClasses]} rounded-2xl p-8 hover:shadow-xl transition-all`}>
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all">
      <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}