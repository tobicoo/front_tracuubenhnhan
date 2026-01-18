import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Save, X, Search, Shield } from 'lucide-react';
import { User } from '../../App';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<
  Partial<User & { newPassword?: string }>
>({
  username: '',
  newPassword: '',
  role: 'patient',
  profile: {
    name: '',
    email: '',
    phone: '',
    cccd: '',
    address: '',
    emergencyContact: ''
  }
});

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadUsers();
  }, []);

  useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 3000);

    return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadUsers = () => {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      setUsers(JSON.parse(usersData));
    }
  };

  const validateForm = () => {
  const newErrors: { [key: string]: string } = {};

  if (!formData.username || formData.username.trim() === '') {
    newErrors.username = 'Tên đăng nhập là bắt buộc.';
  }

  if (isAdding && (!formData.newPassword || formData.newPassword.trim() === '')) {
    newErrors.newPassword = 'Mật khẩu là bắt buộc.';
  }
  
  if (!formData.profile?.name || formData.profile.name.trim() === '') {
    newErrors.name = 'Họ và tên là bắt buộc.';
  }

  if (!formData.role) {
    newErrors.role = 'Vai trò là bắt buộc.';
  }
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
  if (!validateForm()) return;

  const newUser: User = {
    id: `user_${Date.now()}`,
    username: formData.username!,
    password: formData.newPassword!,
    role: formData.role as 'patient' | 'doctor' | 'admin',

    patientId:
      formData.role === 'patient'
        ? `BN${Date.now().toString().slice(-10)}`
        : undefined,

    profile: {
      name: formData.profile?.name || '',
      email: formData.profile?.email || '',
      phone: formData.profile?.phone || '',
      cccd: formData.profile?.cccd || '',
      address: formData.profile?.address || '',
      emergencyContact: formData.profile?.emergencyContact || '',
    }
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  setUsers(updatedUsers);
  resetForm();
  setSuccessMessage('Đã thêm người dùng mới thành công!');
};


  const handleEdit = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setFormData({ ...user, newPassword: '' });
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!validateForm() || !editingId) return;
    const updatedUsers = users.map(user => {
      if (user.id === editingId) {
        return {
          ...user,
          username: formData.username || user.username,
          password: formData.newPassword || user.password,
          role: formData.role || user.role,
          patientId: user.patientId,
          profile: formData.profile || user.profile
        };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update current user if editing self
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      if (parsed.id === editingId) {
        const updated = updatedUsers.find(u => u.id === editingId);
        if (updated) {
          localStorage.setItem('currentUser', JSON.stringify(updated));
        }
      }
    }
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    resetForm();

    setSuccessMessage('Đã cập nhật người dùng thành công!');
  };

  const handleDelete = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user?.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
      alert('Không thể xóa tài khoản quản trị duy nhất!');
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      const updatedUsers = users.filter(u => u.id !== id);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setSuccessMessage('Đã xóa người dùng thành công!');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      newPassword: '',
      role: 'patient',
      profile: { name: '', email: '' }
    });
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleName = (role: string) => {
    switch (role) {
      case 'patient': return 'Người bệnh';
      case 'doctor': return 'Bác sĩ';
      case 'admin': return 'Quản trị viên';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'patient': return 'bg-blue-100 text-blue-700';
      case 'doctor': return 'bg-green-100 text-green-700';
      case 'admin': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm người dùng
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, username, ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isAdding ? (
                    <>
                      Mật khẩu <span className="text-red-500">*</span>
                    </>
                  ) : (
                    'Mật khẩu mới (để trống nếu không đổi)'
                  )}
                </label>

                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required={isAdding}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.profile?.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    profile: { ...formData.profile, name: e.target.value } as any 
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.profile?.email}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    profile: { ...formData.profile, email: e.target.value } as any 
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.profile?.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, phone: e.target.value } as any
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CCCD
                </label>
                <input
                  type="text"
                  value={formData.profile?.cccd}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, cccd: e.target.value } as any
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.profile?.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, address: e.target.value } as any
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liên lạc khẩn cấp
                </label>
                <input
                  type="text"
                  value={formData.profile?.emergencyContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: {
                        ...formData.profile,
                        emergencyContact: e.target.value
                      } as any
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
   

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="patient">Người bệnh</option>
                  <option value="doctor">Bác sĩ</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={isAdding ? handleAdd : handleUpdate}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tên đăng nhập
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Họ và tên
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Vai trò
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.profile?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.profile?.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Không tìm thấy người dùng</p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Người bệnh</p>
            <p className="text-2xl font-bold text-blue-900">
              {users.filter(u => u.role === 'patient').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Bác sĩ</p>
            <p className="text-2xl font-bold text-green-900">
              {users.filter(u => u.role === 'doctor').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Quản trị viên</p>
            <p className="text-2xl font-bold text-purple-900">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
