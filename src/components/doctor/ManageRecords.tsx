import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName?: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes: string;
  prescription?: string;
}

interface Patient {
  id: string;
  profile: {
    name: string;
  };
}

interface ManageRecordsProps {
  doctorId: string;
}

export default function ManageRecords({ doctorId }: ManageRecordsProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: '',
    prescription: ''
  });

  useEffect(() => {
    loadRecords();
    loadPatients();
  }, []);

  const loadPatients = () => {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      const users = JSON.parse(usersData);
      setPatients(users.filter((u: any) => u.role === 'patient'));
    }
  };

  const loadRecords = () => {
    const recordsData = localStorage.getItem('medicalRecords');
    if (recordsData) {
      const allRecords: MedicalRecord[] = JSON.parse(recordsData);
      
      // Get patient names
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const recordsWithNames = allRecords.map(record => ({
          ...record,
          patientName: users.find((u: any) => u.id === record.patientId)?.profile.name || 'Unknown'
        }));
        setRecords(recordsWithNames);
      } else {
        setRecords(allRecords);
      }
    }
  };

  const handleAdd = () => {
    const usersData = localStorage.getItem('users');
    let doctorName = 'Bác sĩ';
    if (usersData) {
      const users = JSON.parse(usersData);
      const doctor = users.find((u: any) => u.id === doctorId);
      if (doctor) {
        doctorName = doctor.profile.name;
      }
    }

    const newRecord: MedicalRecord = {
      id: `rec_${Date.now()}`,
      patientId: formData.patientId || '',
      date: formData.date || '',
      doctorName,
      diagnosis: formData.diagnosis || '',
      symptoms: formData.symptoms || '',
      treatment: formData.treatment || '',
      notes: formData.notes || '',
      prescription: formData.prescription || ''
    };

    const recordsData = localStorage.getItem('medicalRecords');
    const allRecords: MedicalRecord[] = recordsData ? JSON.parse(recordsData) : [];
    allRecords.push(newRecord);
    localStorage.setItem('medicalRecords', JSON.stringify(allRecords));

    loadRecords();
    resetForm();
  };

  const handleEdit = (id: string) => {
    const record = records.find(r => r.id === id);
    if (record) {
      setFormData(record);
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    const recordsData = localStorage.getItem('medicalRecords');
    if (recordsData) {
      const allRecords: MedicalRecord[] = JSON.parse(recordsData);
      const index = allRecords.findIndex(r => r.id === editingId);
      if (index !== -1) {
        allRecords[index] = { ...allRecords[index], ...formData };
        localStorage.setItem('medicalRecords', JSON.stringify(allRecords));
        loadRecords();
      }
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hồ sơ bệnh án này?')) {
      const recordsData = localStorage.getItem('medicalRecords');
      if (recordsData) {
        const allRecords: MedicalRecord[] = JSON.parse(recordsData);
        const filtered = allRecords.filter(r => r.id !== id);
        localStorage.setItem('medicalRecords', JSON.stringify(filtered));
        loadRecords();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      symptoms: '',
      treatment: '',
      notes: '',
      prescription: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const filteredRecords = records.filter(record =>
    (record.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hồ sơ bệnh án</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm hồ sơ mới
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bệnh nhân, chẩn đoán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Thêm hồ sơ bệnh án mới' : 'Chỉnh sửa hồ sơ bệnh án'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bệnh nhân *
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày khám *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Triệu chứng *
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chẩn đoán *
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điều trị *
                </label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đơn thuốc
                </label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="VD: Amoxicillin 500mg x 3 lần/ngày x 7 ngày"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
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

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Chưa có hồ sơ bệnh án nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map(record => (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {record.patientName}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-1">
                      <strong>Chẩn đoán:</strong> {record.diagnosis}
                    </p>
                    <p className="text-gray-700">
                      <strong>Triệu chứng:</strong> {record.symptoms}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
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
    </div>
  );
}
