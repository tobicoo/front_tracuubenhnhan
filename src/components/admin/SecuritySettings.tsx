import { useState, useEffect } from 'react';
import { Shield, Key, Lock, AlertTriangle, CheckCircle, Copy } from 'lucide-react';

interface SecuritySettings {
  masterKey: string;
  encryptionEnabled: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  auditLog: AuditEntry[];
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export default function SecuritySettingsComponent() {
  const [settings, setSettings] = useState<SecuritySettings>({
    masterKey: '',
    encryptionEnabled: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    },
    auditLog: []
  });
  const [showMasterKey, setShowMasterKey] = useState(false);
  const [success, setSuccess] = useState('');
  const [passwordPolicyError, setPasswordPolicyError] = useState('');


  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('securitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      // Generate initial master key
      const initialKey = generateMasterKey();
      const initialSettings = { ...settings, masterKey: initialKey };
      setSettings(initialSettings);
      setShowMasterKey(true);
      localStorage.setItem('securitySettings', JSON.stringify(initialSettings));
      setSuccess('Master Key đã được khởi tạo lần đầu!');
      setTimeout(() => setSuccess(''), 3000);
      addAuditLog('Khởi tạo Master Key', 'Hệ thống', 'Tạo Master Key lần đầu');
    }
  };

  const generateMasterKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleRegenerateMasterKey = () => {
    if (confirm('Bạn có chắc chắn muốn tạo lại Master Key? Điều này có thể ảnh hưởng đến dữ liệu đã mã hóa.')) {
      const newKey = generateMasterKey();
      const updatedSettings = { ...settings, masterKey: newKey };
      setSettings(updatedSettings);
      localStorage.setItem('securitySettings', JSON.stringify(updatedSettings));
      addAuditLog('Tạo lại Master Key', 'Admin', 'Master Key đã được tạo lại');
      setSuccess('Master Key đã được tạo lại thành công!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleCopyMasterKey = () => {
    navigator.clipboard.writeText(settings.masterKey);
    setSuccess('Đã sao chép Master Key!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleSaveSettings = () => {
  const { requireUppercase, requireNumbers, requireSpecialChars } =
    settings.passwordPolicy;


  if (!requireUppercase && !requireNumbers && !requireSpecialChars) {
    setPasswordPolicyError('Vui lòng chọn ít nhất 1 chính sách mật khẩu');
    return;
  }

  setPasswordPolicyError('');
  localStorage.setItem('securitySettings', JSON.stringify(settings));
  addAuditLog(
    'Cập nhật cài đặt bảo mật',
    'Admin',
    'Đã thay đổi cài đặt bảo mật hệ thống'
  );

  setSuccess('Đã lưu cài đặt bảo mật!');
  setTimeout(() => setSuccess(''), 3000);
};

const addAuditLog = (action: string, user: string, details: string) => { 
  const newEntry: AuditEntry = { 
    id: `audit_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    user, 
    details 
  }; 
  const updatedSettings = {
    ...settings, auditLog: [newEntry, ...settings.auditLog].slice(0, 50) // Keep last 50 entries
  }; 
  setSettings(updatedSettings);
  localStorage.setItem('securitySettings',
  JSON.stringify(updatedSettings)); 
};

  return (
    <div className="max-w-6xl space-y-6">
      {/* Master Key Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Master Key</h2>
        </div>

        {success && (
          <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Quan trọng:</p>
            <p>Master Key được sử dụng để mã hóa và giải mã dữ liệu nhạy cảm trong hệ thống. 
            Vui lòng lưu trữ Master Key ở nơi an toàn. Mất Master Key có thể dẫn đến mất dữ liệu vĩnh viễn.</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Master Key hiện tại
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showMasterKey ? 'text' : 'password'}
                value={settings.masterKey}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
            </div>
            <button
              onClick={() => setShowMasterKey(!showMasterKey)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {showMasterKey ? 'Ẩn' : 'Hiển thị'}
            </button>
            <button
              onClick={handleCopyMasterKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Sao chép
            </button>
          </div>
        </div>

        <button
          onClick={handleRegenerateMasterKey}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Tạo lại Master Key
        </button>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Cài đặt bảo mật</h2>
        </div>

        <div className="space-y-6">
          {/* Encryption */}
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium text-gray-900">Mã hóa dữ liệu</h3>
              <p className="text-sm text-gray-600">Bật mã hóa cho dữ liệu nhạy cảm</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.encryptionEnabled}
                onChange={(e) => setSettings({ ...settings, encryptionEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Two Factor Auth */}
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <h3 className="font-medium text-gray-900">Xác thực hai yếu tố</h3>
              <p className="text-sm text-gray-600">Yêu cầu xác thực 2 lớp khi đăng nhập</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Session Timeout */}
          <div className="py-3 border-b">
            <h3 className="font-medium text-gray-900 mb-2">Thời gian phiên làm việc</h3>
            <p className="text-sm text-gray-600 mb-3">Tự động đăng xuất sau (phút)</p>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })}
              min="5"
              max="120"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password Policy */}
          <div className="py-3">
            <h3 className="font-medium text-gray-900 mb-4">Chính sách mật khẩu</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Độ dài tối thiểu
                </label>
                <input
                  type="number"
                  value={settings.passwordPolicy.minLength}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, minLength: parseInt(e.target.value) || 8 }
                  })}
                  min="6"
                  max="32"
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireUppercase: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Yêu cầu chữ in hoa</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireNumbers: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Yêu cầu số</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: { ...settings.passwordPolicy, requireSpecialChars: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Yêu cầu ký tự đặc biệt</span>
              </label>
              {passwordPolicyError && (
                <p className="text-red-500 text-sm mt-2">{passwordPolicyError}</p>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Lưu cài đặt
        </button>
      </div>

      {/* Audit Log */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Nhật ký kiểm toán</h2>
        </div>

        <div className="space-y-3">
          {settings.auditLog.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có nhật ký kiểm toán</p>
          ) : (
            settings.auditLog.map(entry => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{entry.action}</h4>
                  <span className="text-sm text-gray-600">
                    {new Date(entry.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Người thực hiện: {entry.user}</p>
                <p className="text-sm text-gray-700 mt-1">{entry.details}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
