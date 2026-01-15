import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Calendar, MapPin, Droplet, AlertCircle, Save, Plus, Edit, Trash2, X, Heart, Lock, Key } from 'lucide-react';
import { User } from '../../App';

interface PatientProfileProps {
  user: User;
}

interface MedicalCondition {
  id: string;
  patientId: string;
  condition: string;
  type: 'disease' | 'allergy' | 'surgery';
  diagnosedDate: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved';
  notes: string;
}

export default function PatientProfile({ user }: PatientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user.profile);
  const [success, setSuccess] = useState('');
  
  // Medical history states
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [editingConditionId, setEditingConditionId] = useState<string | null>(null);
  const [conditionFormData, setConditionFormData] = useState<Partial<MedicalCondition>>({
    condition: '',
    type: 'disease',
    diagnosedDate: '',
    severity: 'mild',
    status: 'active',
    notes: ''
  });

  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadConditions();
  }, [user.id]);

  const loadConditions = () => {
    const historyData = localStorage.getItem('medicalHistory');
    if (historyData) {
      const allHistory: MedicalCondition[] = JSON.parse(historyData);
      setConditions(allHistory.filter(h => h.patientId === user.id));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user in localStorage
    const usersData = localStorage.getItem('users');
    if (usersData) {
      const users: User[] = JSON.parse(usersData);
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].profile = formData;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        const currentUser = { ...user, profile: formData };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        setSuccess('Cập nhật thông tin thành công!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  // Medical history functions
  const handleAddCondition = () => {
    const newCondition: MedicalCondition = {
      id: `cond_${Date.now()}`,
      patientId: user.id,
      condition: conditionFormData.condition || '',
      type: conditionFormData.type || 'disease',
      diagnosedDate: conditionFormData.diagnosedDate || '',
      severity: conditionFormData.severity || 'mild',
      status: conditionFormData.status || 'active',
      notes: conditionFormData.notes || ''
    };

    const historyData = localStorage.getItem('medicalHistory');
    const allHistory: MedicalCondition[] = historyData ? JSON.parse(historyData) : [];
    allHistory.push(newCondition);
    localStorage.setItem('medicalHistory', JSON.stringify(allHistory));

    loadConditions();
    resetConditionForm();
    setSuccess('Thêm tiền sử bệnh lý thành công!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditCondition = (id: string) => {
    const condition = conditions.find(c => c.id === id);
    if (condition) {
      setConditionFormData(condition);
      setEditingConditionId(id);
    }
  };

  const handleUpdateCondition = () => {
    const historyData = localStorage.getItem('medicalHistory');
    if (historyData) {
      const allHistory: MedicalCondition[] = JSON.parse(historyData);
      const index = allHistory.findIndex(h => h.id === editingConditionId);
      if (index !== -1) {
        allHistory[index] = { ...allHistory[index], ...conditionFormData };
        localStorage.setItem('medicalHistory', JSON.stringify(allHistory));
        loadConditions();
      }
    }
    resetConditionForm();
    setSuccess('Cập nhật tiền sử bệnh lý thành công!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteCondition = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tiền sử bệnh lý này?')) {
      const historyData = localStorage.getItem('medicalHistory');
      if (historyData) {
        const allHistory: MedicalCondition[] = JSON.parse(historyData);
        const filtered = allHistory.filter(h => h.id !== id);
        localStorage.setItem('medicalHistory', JSON.stringify(filtered));
        loadConditions();
        setSuccess('Xóa tiền sử bệnh lý thành công!');
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  const resetConditionForm = () => {
    setConditionFormData({
      condition: '',
      type: 'disease',
      diagnosedDate: '',
      severity: 'mild',
      status: 'active',
      notes: ''
    });
    setIsAddingCondition(false);
    setEditingConditionId(null);
  };

  // Password change functions
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    const usersData = localStorage.getItem('users');
    if (usersData) {
      const users: User[] = JSON.parse(usersData);
      const currentUserData = users.find(u => u.id === user.id);
      
      if (!currentUserData) {
        setSuccess('Lỗi: Không tìm thấy người dùng!');
        setTimeout(() => setSuccess(''), 3000);
        return;
      }

      if (currentUserData.password !== passwordData.currentPassword) {
        setSuccess('Mật khẩu hiện tại không đúng!');
        setTimeout(() => setSuccess(''), 3000);
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSuccess('Mật khẩu xác nhận không khớp!');
        setTimeout(() => setSuccess(''), 3000);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setSuccess('Mật khẩu mới phải có ít nhất 6 ký tự!');
        setTimeout(() => setSuccess(''), 3000);
        return;
      }

      // Update password
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].password = passwordData.newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        const updatedUser = { ...user, password: passwordData.newPassword };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
        setSuccess('Đổi mật khẩu thành công!');
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'disease': return 'Bệnh nền';
      case 'allergy': return 'Dị ứng';
      case 'surgery': return 'Phẫu thuật';
      default: return type;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'mild': return 'Nhẹ';
      case 'moderate': return 'Trung bình';
      case 'severe': return 'Nặng';
      default: return severity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'severe': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Chỉnh sửa
            </button>
          )}
        </div>

        {success && (
          <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4" />
                Mã bệnh nhân
              </label>
              <input
                type="text"
                value={formData.patientId || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4" />
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                CCCD
              </label>
              <input
                type="text"
                name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Giới tính
              </label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Droplet className="w-4 h-4" />
                Nhóm máu
              </label>
              <input
                type="text"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="w-4 h-4" />
                Liên hệ khẩn cấp
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {isEditing && (
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(user.profile);
                  setIsEditing(false);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Medical History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Tiền sử bệnh lý
          </h2>
          <button
            onClick={() => setIsAddingCondition(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm bệnh lý
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAddingCondition || editingConditionId) && (
          <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="font-semibold mb-4">
              {isAddingCondition ? 'Thêm tiền sử bệnh lý mới' : 'Chỉnh sửa tiền sử bệnh lý'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại *
                </label>
                <select
                  value={conditionFormData.type}
                  onChange={(e) => setConditionFormData({ ...conditionFormData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="disease">Bệnh nền</option>
                  <option value="allergy">Dị ứng</option>
                  <option value="surgery">Phẫu thuật</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên bệnh lý *
                </label>
                <input
                  type="text"
                  value={conditionFormData.condition}
                  onChange={(e) => setConditionFormData({ ...conditionFormData, condition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày chẩn đoán *
                </label>
                <input
                  type="date"
                  value={conditionFormData.diagnosedDate}
                  onChange={(e) => setConditionFormData({ ...conditionFormData, diagnosedDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ
                </label>
                <select
                  value={conditionFormData.severity}
                  onChange={(e) => setConditionFormData({ ...conditionFormData, severity: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mild">Nhẹ</option>
                  <option value="moderate">Trung bình</option>
                  <option value="severe">Nặng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={conditionFormData.status}
                  onChange={(e) => setConditionFormData({ ...conditionFormData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Đang điều trị</option>
                  <option value="resolved">Đã khỏi</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={conditionFormData.notes}
                  onChange={(e) => setConditionFormData({ ...conditionFormData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Thông tin thêm về bệnh lý..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={isAddingCondition ? handleAddCondition : handleUpdateCondition}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
              <button
                onClick={resetConditionForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Conditions List */}
        {conditions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có tiền sử bệnh lý nào được ghi nhận</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conditions.map(condition => (
              <div
                key={condition.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {condition.condition}
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {getTypeLabel(condition.type)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(condition.severity)}`}>
                        {getSeverityLabel(condition.severity)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          condition.status === 'active'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {condition.status === 'active' ? 'Đang điều trị' : 'Đã khỏi'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Chẩn đoán: {new Date(condition.diagnosedDate).toLocaleDateString('vi-VN')}
                    </p>
                    {condition.notes && (
                      <p className="text-sm text-gray-700">{condition.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCondition(condition.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCondition(condition.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            Đổi mật khẩu
          </h2>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              Đổi mật khẩu
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại *
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới *
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới *
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu mật khẩu
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {!showPasswordForm && (
          <p className="text-gray-600 text-sm">
            Để bảo vệ tài khoản của bạn, vui lòng sử dụng mật khẩu mạnh và thay đổi định kỳ.
          </p>
        )}
      </div>
    </div>
  );
}