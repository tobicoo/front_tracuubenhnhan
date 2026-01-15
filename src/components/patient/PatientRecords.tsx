import { useState, useEffect } from 'react';
import { FileText, Calendar, User, Search, Eye, DollarSign, Pill, Activity } from 'lucide-react';

interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes: string;
  prescription?: string;
  cost?: number;
  testResults?: string;
}

interface PatientRecordsProps {
  userId: string;
}

export default function PatientRecords({ userId }: PatientRecordsProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    loadRecords();
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [records, searchTerm, filterDate, filterDoctor]);

  const loadRecords = () => {
    const recordsData = localStorage.getItem('medicalRecords');
    if (recordsData) {
      const allRecords: MedicalRecord[] = JSON.parse(recordsData);
      const userRecords = allRecords.filter(r => r.patientId === userId);
      // Sort by date descending (most recent first)
      userRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(userRecords);
    } else {
      // Create sample records
      const sampleRecords: MedicalRecord[] = [
        {
          id: 'rec1',
          patientId: userId,
          date: '2026-01-10',
          doctorName: 'BS. Nguyễn Văn A',
          diagnosis: 'Viêm họng cấp',
          symptoms: 'Đau họng, sốt nhẹ 38°C, khó nuốt',
          treatment: 'Kháng sinh Amoxicillin, thuốc giảm đau Paracetamol',
          notes: 'Tái khám sau 5 ngày nếu triệu chứng không giảm. Uống đủ nước, nghỉ ngơi.',
          prescription: 'Amoxicillin 500mg - 3 lần/ngày x 7 ngày\nParacetamol 500mg - 3 lần/ngày khi sốt',
          cost: 350000,
          testResults: 'Xét nghiệm máu: Bạch cầu tăng nhẹ'
        },
        {
          id: 'rec2',
          patientId: userId,
          date: '2025-12-15',
          doctorName: 'BS. Trần Thị B',
          diagnosis: 'Khám sức khỏe định kỳ',
          symptoms: 'Không có triệu chứng bất thường',
          treatment: 'Không cần điều trị',
          notes: 'Sức khỏe tốt, duy trì chế độ sinh hoạt lành mạnh. Tập thể dục đều đặn.',
          prescription: '',
          cost: 200000,
          testResults: 'Xét nghiệm máu: Bình thường\nHuyết áp: 120/80 mmHg\nNhịp tim: 75 bpm'
        },
        {
          id: 'rec3',
          patientId: userId,
          date: '2025-11-20',
          doctorName: 'BS. Lê Văn C',
          diagnosis: 'Đau dạ dày',
          symptoms: 'Đau bụng vùng thượng vị, ợ nóng, buồn nôn',
          treatment: 'Thuốc kháng acid, điều chỉnh chế độ ăn uống',
          notes: 'Ăn uống điều độ, tránh thức ăn cay nóng, rượu bia. Ăn nhiều bữa nhỏ.',
          prescription: 'Omeprazole 20mg - 2 lần/ngày trước ăn x 14 ngày\nGaviscon - 3 lần/ngày sau ăn',
          cost: 420000,
          testResults: 'Nội soi dạ dày: Viêm niêm mạc dạ dày mức độ nhẹ'
        }
      ];
      localStorage.setItem('medicalRecords', JSON.stringify(sampleRecords));
      setRecords(sampleRecords);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (filterDate) {
      filtered = filtered.filter(record => record.date === filterDate);
    }

    // Doctor filter
    if (filterDoctor) {
      filtered = filtered.filter(record => 
        record.doctorName.toLowerCase().includes(filterDoctor.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterDate('');
    setFilterDoctor('');
  };

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tra cứu hồ sơ khám bệnh</h1>

        {/* Search and Filter Form */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-4 text-gray-900">Bộ lọc và tìm kiếm</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm theo từ khóa
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Chẩn đoán, bác sĩ, triệu chứng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày khám
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bác sĩ
              </label>
              <input
                type="text"
                placeholder="Tên bác sĩ..."
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Tìm thấy <strong>{filteredRecords.length}</strong> lượt khám
            </p>
            {(searchTerm || filterDate || filterDoctor) && (
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Không tìm thấy hồ sơ khám bệnh</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Danh sách lượt khám ({filteredRecords.length})
            </h3>
            {filteredRecords.map(record => (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{record.diagnosis}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Lượt khám #{record.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.date).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {record.doctorName}
                      </span>
                      {record.cost && (
                        <span className="flex items-center gap-1 text-green-600">
                          <DollarSign className="w-4 h-4" />
                          {record.cost.toLocaleString('vi-VN')} VNĐ
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                </div>
                <div className="border-t pt-2">
                  <p className="text-gray-700 text-sm">
                    <strong>Triệu chứng:</strong> {record.symptoms}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Record Details */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Chi tiết lượt khám</h2>
                <p className="text-sm text-gray-600">Mã lượt khám: #{selectedRecord.id}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Thông tin cơ bản
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ngày khám</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedRecord.date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bác sĩ khám</label>
                    <p className="mt-1 text-gray-900">{selectedRecord.doctorName}</p>
                  </div>
                  {selectedRecord.cost && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Chi phí khám</label>
                      <p className="mt-1 text-gray-900 text-green-600 font-semibold">
                        {selectedRecord.cost.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  Chẩn đoán
                </label>
                <p className="text-gray-900 bg-blue-50 p-3 rounded-lg">{selectedRecord.diagnosis}</p>
              </div>

              {/* Symptoms */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Triệu chứng</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRecord.symptoms}</p>
              </div>

              {/* Test Results */}
              {selectedRecord.testResults && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Kết quả xét nghiệm
                  </label>
                  <div className="text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <pre className="whitespace-pre-wrap font-sans">{selectedRecord.testResults}</pre>
                  </div>
                </div>
              )}

              {/* Treatment */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Điều trị</label>
                <p className="text-gray-900 bg-green-50 p-3 rounded-lg">{selectedRecord.treatment}</p>
              </div>

              {/* Prescription */}
              {selectedRecord.prescription && (
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4" />
                    Đơn thuốc
                  </label>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <pre className="whitespace-pre-wrap font-sans text-gray-900">{selectedRecord.prescription}</pre>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Ghi chú của bác sĩ</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg italic">{selectedRecord.notes}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                In phiếu khám
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
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