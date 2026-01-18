import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Save, X, Clock } from 'lucide-react';

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientName?: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

interface Patient {
  id: string;
  profile: {
    name: string;
  };
}

interface DoctorScheduleProps {
  doctorId: string;
}

export default function DoctorSchedule({ doctorId }: DoctorScheduleProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState<Partial<Appointment>>({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    type: 'Khám bệnh',
    status: 'scheduled',
    notes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
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

  const loadAppointments = () => {
    const appointmentsData = localStorage.getItem('appointments');
    if (appointmentsData) {
      const allAppointments: Appointment[] = JSON.parse(appointmentsData);
      
      // Get patient names
      const usersData = localStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const appointmentsWithNames = allAppointments
          .filter(apt => apt.doctorId === doctorId)
          .map(apt => ({
            ...apt,
            patientName: users.find((u: any) => u.id === apt.patientId)?.profile.name || 'Unknown'
          }));
        setAppointments(appointmentsWithNames);
      }
    } else {
      // Create sample data
      const sampleAppointments: Appointment[] = [];
      localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
    }
  };

const validateForm = () => {
  const newErrors: { [key: string]: string } = {};

  if (!formData.patientId) {
    newErrors.patientId = 'Vui lòng chọn bệnh nhân';
  }

  if (!formData.date) {
    newErrors.date = 'Vui lòng chọn ngày khám';
  }

  if (!formData.time) {
    newErrors.time = 'Vui lòng chọn giờ khám';
  }

  if (!formData.type) {
    newErrors.type = 'Vui lòng chọn loại khám';
  }
  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    const newAppointment: Appointment = {
      id: `apt_${Date.now()}`,
      doctorId,
      patientId: formData.patientId || '',
      date: formData.date || '',
      time: formData.time || '',
      type: formData.type || 'Khám bệnh',
      status: formData.status || 'scheduled',
      notes: formData.notes || ''
    };

    const appointmentsData = localStorage.getItem('appointments');
    const allAppointments: Appointment[] = appointmentsData ? JSON.parse(appointmentsData) : [];
    allAppointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(allAppointments));

    loadAppointments();
    resetForm();

    setSuccessMessage('Lịch khám đã được thêm thành công.');
  };

  const handleEdit = (id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      setFormData(appointment);
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    const appointmentsData = localStorage.getItem('appointments');
    if (appointmentsData) {
      const allAppointments: Appointment[] = JSON.parse(appointmentsData);
      const index = allAppointments.findIndex(a => a.id === editingId);
      if (index !== -1) {
        allAppointments[index] = { ...allAppointments[index], ...formData };
        localStorage.setItem('appointments', JSON.stringify(allAppointments));
        loadAppointments();
      }
    }
    resetForm();
    setSuccessMessage('Lịch khám đã được cập nhật thành công.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lịch khám này?')) {
      const appointmentsData = localStorage.getItem('appointments');
      if (appointmentsData) {
        const allAppointments: Appointment[] = JSON.parse(appointmentsData);
        const filtered = allAppointments.filter(a => a.id !== id);
        localStorage.setItem('appointments', JSON.stringify(filtered));
        loadAppointments();
      }
    setSuccessMessage('Lịch khám đã được xóa thành công.');
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      type: 'Khám bệnh',
      status: 'scheduled',
      notes: ''
    });
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const filteredAppointments = appointments
    .filter(apt => apt.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Lịch khám</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm lịch khám
          </button>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ngày
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
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
              {isAdding ? 'Thêm lịch khám mới' : 'Chỉnh sửa lịch khám'}
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
                >
                  <option value="">Chọn bệnh nhân</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.profile.name}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.patientId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại khám <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    setErrors({ ...errors, type: '' });
                    setFormData({ ...formData, type: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="Khám bệnh">Khám bệnh</option>
                  <option value="Tái khám">Tái khám</option>
                  <option value="Tư vấn">Tư vấn</option>
                  <option value="Xét nghiệm">Xét nghiệm</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày khám <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setErrors({ ...errors, date: '' });
                    setFormData({ ...formData, date: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ khám <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => {
                    setErrors({ ...errors, time: '' });
                    setFormData({ ...formData, time: e.target.value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.time}
                  </p>
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
                  <option value="scheduled">Đã lên lịch</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
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

        {/* Appointments List */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">
            Lịch khám ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
          </h3>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Không có lịch khám nào trong ngày này</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-lg">{appointment.time}</span>
                      <span className="text-gray-600">-</span>
                      <span className="font-medium">{appointment.patientName}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          appointment.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : appointment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {appointment.status === 'scheduled'
                          ? 'Đã lên lịch'
                          : appointment.status === 'completed'
                          ? 'Đã hoàn thành'
                          : 'Đã hủy'}
                      </span>
                    </div>
                    <p className="text-gray-700 ml-8">
                      <strong>Loại:</strong> {appointment.type}
                    </p>
                    {appointment.notes && (
                      <p className="text-gray-600 text-sm ml-8 mt-1">{appointment.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(appointment.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
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
