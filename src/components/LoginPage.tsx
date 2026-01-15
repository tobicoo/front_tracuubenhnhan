import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogIn } from 'lucide-react';
import { User } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Get users from localStorage
    const usersData = localStorage.getItem('users');
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    // Add default accounts if no users exist
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: 'admin1',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          profile: { name: 'Quản trị viên', email: 'admin@hospital.vn' }
        },
        {
          id: 'doctor1',
          username: 'bacsi',
          password: 'doctor123',
          role: 'doctor',
          profile: {
            name: 'BS. Nguyễn Văn A',
            email: 'nguyenvana@hospital.vn',
            specialization: 'Tim mạch',
            phone: '0901234567'
          }
        },
        {
          id: 'patient1',
          username: 'benhnhan',
          password: 'patient123',
          role: 'patient',
          profile: {
            name: 'Trần Thị B',
            email: 'tranthib@email.com',
            phone: '0909876543',
            dateOfBirth: '1990-01-01',
            gender: 'Nữ',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            bloodType: 'O+',
            allergies: '',
            emergencyContact: '0912345678'
          }
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      users.push(...defaultUsers);
    }

    // Find user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      onLogin(user);
      switch (user.role) {
        case 'patient':
          navigate('/patient');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'admin':
          navigate('/admin');
          break;
      }
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Activity className="w-10 h-10 text-blue-600" />
          <span className="text-2xl font-bold text-blue-900">Đăng nhập</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Tài khoản demo:</p>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <strong>Người bệnh:</strong> benhnhan / patient123
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Bác sĩ:</strong> bacsi / doctor123
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Quản trị:</strong> admin / admin123
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
