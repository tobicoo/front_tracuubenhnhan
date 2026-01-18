import { useState, useEffect } from 'react';
import { Search, User, Phone, IdCard, Hash, Eye, Heart } from 'lucide-react';

interface Patient {
  id: string;
  username: string;
  role: string;
  patientId: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    cccd: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    bloodType: string;
    allergies: string;
    emergencyContact: string;
  };
}

interface MedicalCondition {
  id: string;
  patientId: string;
  condition: string;
  diagnosedDate: string;
  status: string;
  notes: string;
}

interface SearchPatientsProps {
  doctorId: string;
}

export default function SearchPatients({ doctorId }: SearchPatientsProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientHistory, setPatientHistory] = useState<MedicalCondition[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadPatients();
  }, []);

  const loadPatients = () => {
  try {
    const usersData = localStorage.getItem('users');
    if (!usersData) {
      setPatients([]);
      return;
    }

    const users: Patient[] = JSON.parse(usersData);
    setPatients(users.filter(u => u.role === 'patient'));
  } catch (error) {
    console.error('Lỗi load patients:', error);
    setPatients([]);
  }
};


  const viewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    
    // Load patient's medical history
    const historyData = localStorage.getItem('medicalHistory');
    if (historyData) {
      const allHistory: MedicalCondition[] = JSON.parse(historyData);
      setPatientHistory(allHistory.filter(h => h.patientId === patient.patientId));
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.profile.phone.includes(searchTerm) ||
    patient.profile.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tìm kiếm bệnh nhân</h1>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã bệnh nhân, CCCD,..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Không tìm thấy bệnh nhân</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPatients.map(patient => (
              <div
                key={patient.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {patient.profile.name}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {patient.profile.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        {patient.patientId || (patient.profile as any)?.patientId}
                      </div>
                      <div className="flex items-center gap-2">
                        <IdCard className="w-4 h-4" />
                        {patient.profile.cccd}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => viewPatientDetails(patient)}
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin bệnh nhân</h2>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Basic Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                  <p className="mt-1 text-gray-900">{selectedPatient.profile.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày sinh</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedPatient.profile.dateOfBirth).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Giới tính</label>
                  <p className="mt-1 text-gray-900">{selectedPatient.profile.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nhóm máu</label>
                  <p className="mt-1 text-gray-900">{selectedPatient.profile.bloodType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                  <p className="mt-1 text-gray-900">{selectedPatient.profile.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1 text-gray-900">{selectedPatient.profile.email}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Địa chỉ</label>
                  <p className="mt-1 text-gray-900">{selectedPatient.profile.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Liên hệ khẩn cấp</label>
                  <p className="mt-1 text-gray-900">{selectedPatient.profile.emergencyContact}</p>
                </div>
                {selectedPatient.profile.allergies && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Dị ứng</label>
                    <p className="mt-1 text-gray-900">{selectedPatient.profile.allergies}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical History */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Tiền sử bệnh lý
              </h3>
              {patientHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có tiền sử bệnh lý</p>
              ) : (
                <div className="space-y-3">
                  {patientHistory.map(condition => (
                    <div key={condition.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{condition.condition}</h4>
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
                      <p className="text-sm text-gray-600 mb-1">
                        Chẩn đoán: {new Date(condition.diagnosedDate).toLocaleDateString('vi-VN')}
                      </p>
                      {condition.notes && (
                        <p className="text-sm text-gray-700">{condition.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
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
