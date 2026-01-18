import { useState, useEffect } from 'react';
import { Stethoscope, Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';

interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  diagnosis: string;
  startDate: string;
  endDate: string;
  medications: string;
  procedures: string;
  instructions: string;
  status: 'active' | 'completed' | 'discontinued';
  notes: string;
}

interface Patient {
  id: string;
  profile: {
    name: string;
  };
}

interface TreatmentPlansProps {
  doctorId: string;
}

export default function TreatmentPlans({ doctorId }: TreatmentPlansProps) {
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingPlan, setViewingPlan] = useState<TreatmentPlan | null>(null);
  const [formData, setFormData] = useState<Partial<TreatmentPlan>>({
    patientId: '',
    diagnosis: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    medications: '',
    procedures: '',
    instructions: '',
    status: 'active',
    notes: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadPlans();
    loadPatients();
  }, []);

  useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 3000);

    return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadPatients = () => {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      const users = JSON.parse(usersData);
      setPatients(users.filter((u: any) => u.role === 'patient'));
    }
  };

  const loadPlans = () => {
    const plansData = localStorage.getItem('treatmentPlans');
    if (plansData) {
      const allPlans: TreatmentPlan[] = JSON.parse(plansData);
      
      // Get patient names
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const plansWithNames = allPlans
          .filter(plan => plan.doctorId === doctorId)
          .map(plan => ({
            ...plan,
            patientName: users.find((u: any) => u.id === plan.patientId)?.profile.name || 'Unknown'
          }));
        setPlans(plansWithNames);
      }
    } else {
      // Create sample data
      const samplePlans: TreatmentPlan[] = [];
      localStorage.setItem('treatmentPlans', JSON.stringify(samplePlans));
    }
  };

const validateForm = () => {
  const newErrors: { [key: string]: string } = {};

  if (!formData.patientId) {
    newErrors.patientId = 'Vui lòng chọn bệnh nhân';
  }

  if (!formData.diagnosis?.trim()) {
    newErrors.diagnosis = 'Chẩn đoán không được để trống';
  }

  if (!formData.instructions?.trim()) {
    newErrors.instructions = 'Hướng dẫn không được để trống';
  } 

  if (!formData.procedures?.trim()) {
    newErrors.procedures = 'Quy trình điều trị không được để trống';
  }

  if (!formData.endDate) {
  newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
  }

  if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
    newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    const newPlan: TreatmentPlan = {
      id: `plan_${Date.now()}`,
      patientId: formData.patientId || '',
      doctorId,
      diagnosis: formData.diagnosis || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      medications: formData.medications || '',
      procedures: formData.procedures || '',
      instructions: formData.instructions || '',
      status: formData.status || 'active',
      notes: formData.notes || ''
    };

    const plansData = localStorage.getItem('treatmentPlans');
    const allPlans: TreatmentPlan[] = plansData ? JSON.parse(plansData) : [];
    allPlans.push(newPlan);
    localStorage.setItem('treatmentPlans', JSON.stringify(allPlans));

    loadPlans();
    resetForm();

    setSuccessMessage('Phác đồ điều trị đã được thêm thành công.');
  };

  const handleEdit = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (plan) {
      setFormData(plan);
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    const plansData = localStorage.getItem('treatmentPlans');
    if (plansData) {
      const allPlans: TreatmentPlan[] = JSON.parse(plansData);
      const index = allPlans.findIndex(p => p.id === editingId);
      if (index !== -1) {
        allPlans[index] = { ...allPlans[index], ...formData };
        localStorage.setItem('treatmentPlans', JSON.stringify(allPlans));
        loadPlans();
      }
    }
    resetForm();
    setSuccessMessage('Phác đồ điều trị đã được cập nhật thành công.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phác đồ điều trị này?')) {
      const plansData = localStorage.getItem('treatmentPlans');
      if (plansData) {
        const allPlans: TreatmentPlan[] = JSON.parse(plansData);
        const filtered = allPlans.filter(p => p.id !== id);
        localStorage.setItem('treatmentPlans', JSON.stringify(filtered));
        loadPlans();
      }
    setSuccessMessage('Phác đồ điều trị đã được xóa thành công.');
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      diagnosis: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      medications: '',
      procedures: '',
      instructions: '',
      status: 'active',
      notes: ''
    });
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Phác đồ điều trị</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Lập phác đồ mới
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg">
            {successMessage}
          </div>
        )}  

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Lập phác đồ điều trị mới' : 'Chỉnh sửa phác đồ điều trị'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bệnh nhân <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => {
                    setErrors({ ...errors, patientId: '' });
                    setFormData({ ...formData, patientId: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                  disabled={!!editingId}
                >
                  <option value="">Chọn bệnh nhân</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.profile.name}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chẩn đoán <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => {
                    setErrors({ ...errors, diagnosis: '' });
                    setFormData({ ...formData, diagnosis: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                {errors.diagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>
                )}  
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu 
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày kết thúc dự kiến <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    setErrors({ ...errors, endDate: '' });
                    setFormData({ ...formData, endDate: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endDate}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thuốc điều trị 
                </label>
                <textarea
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Liệt kê các loại thuốc, liều lượng và cách dùng..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quy trình điều trị <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.procedures}
                  onChange={(e) => {
                    setErrors({ ...errors, procedures: '' });
                    setFormData({ ...formData, procedures: e.target.value });
                  }}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Các thủ thuật, xét nghiệm cần thực hiện..."
                />
                {errors.procedures && (
                  <p className="text-red-500 text-sm mt-1">{errors.procedures}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hướng dẫn cho bệnh nhân <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => {
                    setErrors({ ...errors, instructions: '' });
                    setFormData({ ...formData, instructions: e.target.value });
                  }}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Chế độ ăn uống, sinh hoạt, lưu ý..."
                  required
                />
                {errors.instructions && (
                  <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Đang điều trị</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="discontinued">Ngừng điều trị</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={isAdding ? handleAdd : handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
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

        {/* Plans List */}
        {plans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Chưa có phác đồ điều trị nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map(plan => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {plan.patientName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          plan.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : plan.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {plan.status === 'active' ? 'Đang điều trị' : plan.status === 'completed' ? 'Hoàn thành' : 'Ngừng điều trị'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-1">
                      <strong>Chẩn đoán:</strong> {plan.diagnosis}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(plan.startDate).toLocaleDateString('vi-VN')} 
                      {plan.endDate && ` - ${new Date(plan.endDate).toLocaleDateString('vi-VN')}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingPlan(plan)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(plan.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
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

      {/* View Plan Modal */}
      {viewingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết phác đồ điều trị</h2>
              <button
                onClick={() => setViewingPlan(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Bệnh nhân</label>
                <p className="mt-1 text-gray-900">{viewingPlan.patientName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Chẩn đoán</label>
                <p className="mt-1 text-gray-900">{viewingPlan.diagnosis}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày bắt đầu</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(viewingPlan.startDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                {viewingPlan.endDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày kết thúc</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(viewingPlan.endDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Thuốc điều trị</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{viewingPlan.medications}</p>
              </div>

              {viewingPlan.procedures && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Quy trình điều trị</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{viewingPlan.procedures}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Hướng dẫn cho bệnh nhân</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{viewingPlan.instructions}</p>
              </div>

              {viewingPlan.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Ghi chú</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{viewingPlan.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingPlan(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
