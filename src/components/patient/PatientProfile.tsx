"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  UserIcon,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save,
  Plus,
  Edit,
  Trash2,
  Heart,
  Lock,
  Key,
  Activity,
  Pill,
  Scissors,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award as IdCard,
  Users,
} from "lucide-react"

export interface User {
  id: string
  password: string
  profile: {
    patientId: string
    name: string
    phone: string
    cccd: string
    dateOfBirth: string
    gender: string
    email: string
    emergencyContact: string
    address: string
  }
}

interface PatientProfileProps {
  user: User
}

interface MedicalCondition {
  id: string
  patientId: string
  condition: string
  type: "disease" | "allergy" | "surgery"
  diagnosedDate: string
  severity: "mild" | "moderate" | "severe"
  status: "active" | "resolved"
  notes: string
}

type TabType = "personal" | "medical" | "password"

export default function PatientProfile({ user }: PatientProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(user.profile)
  const [success, setSuccess] = useState("")

  const [conditions, setConditions] = useState<MedicalCondition[]>([])
  const [isAddingCondition, setIsAddingCondition] = useState(false)
  const [editingConditionId, setEditingConditionId] = useState<string | null>(null)
  const [conditionFormData, setConditionFormData] = useState<Partial<MedicalCondition>>({
    condition: "",
    type: "disease",
    diagnosedDate: "",
    severity: "mild",
    status: "active",
    notes: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  // --- 1. Load dữ liệu từ API khi vào trang ---
  useEffect(() => {
    loadConditions()
  }, [user.id])

  const loadConditions = async () => {
    try {
      // Thay URL bằng API thật của bạn
      const res = await fetch(`https://api-du-an.com/medical-conditions?patientId=${user.id}`)
      if (res.ok) {
        const data = await res.json()
        setConditions(data)
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu bệnh lý:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // --- 2. Cập nhật thông tin cá nhân (API PUT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate dữ liệu
    if (!formData.name.trim()) {
      setSuccess("Lỗi: Họ và tên không được để trống!")
      return
    }
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(formData.phone)) {
      setSuccess("Lỗi: Số điện thoại không hợp lệ!")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      setSuccess("Lỗi: Định dạng Email không đúng!")
      return
    }

    try {
      const response = await fetch(`https://api-du-an.com/users/${user.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess("Cập nhật thành công!")
        setIsEditing(false)
      } else {
        setSuccess("Lỗi: Server không nhận dữ liệu.")
      }
    } catch (error) {
      setSuccess("Lỗi kết nối server.")
    }

    setTimeout(() => setSuccess(""), 3000)
  }

  // --- 3. Thêm bệnh lý mới (API POST) ---
  const handleAddCondition = async () => {
    if (!conditionFormData.condition?.trim()) {
      setSuccess("Lỗi: Vui lòng nhập tên bệnh lý!")
      setTimeout(() => setSuccess(""), 3000)
      return
    }

    const newCondition = {
      patientId: user.id,
      condition: conditionFormData.condition || "",
      type: conditionFormData.type || "disease",
      diagnosedDate: conditionFormData.diagnosedDate || "",
      severity: conditionFormData.severity || "mild",
      status: conditionFormData.status || "active",
      notes: conditionFormData.notes || "",
    }

    try {
      const response = await fetch("https://api-du-an.com/medical-conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCondition),
      })

      if (response.ok) {
        loadConditions() // Tải lại danh sách sau khi thêm
        resetConditionForm()
        setSuccess("Thêm tiền sử bệnh lý thành công!")
      } else {
        setSuccess("Lỗi: Không thể thêm mới.")
      }
    } catch (error) {
      setSuccess("Lỗi kết nối server.")
    }

    setTimeout(() => setSuccess(""), 3000)
  }

  const handleEditCondition = (id: string) => {
    const condition = conditions.find((c) => c.id === id)
    if (condition) {
      setConditionFormData(condition)
      setEditingConditionId(id)
    }
  }

  // --- 4. Cập nhật bệnh lý (API PUT) ---
  const handleUpdateCondition = async () => {
    if (!editingConditionId) return

    try {
      const response = await fetch(`https://api-du-an.com/medical-conditions/${editingConditionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conditionFormData),
      })

      if (response.ok) {
        loadConditions()
        resetConditionForm()
        setSuccess("Cập nhật tiền sử bệnh lý thành công!")
      } else {
        setSuccess("Lỗi: Không thể cập nhật.")
      }
    } catch (error) {
      setSuccess("Lỗi kết nối server.")
    }

    setTimeout(() => setSuccess(""), 3000)
  }

  // --- 5. Xóa bệnh lý (API DELETE) ---
  const handleDeleteCondition = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tiền sử bệnh lý này?")) {
      try {
        const response = await fetch(`https://api-du-an.com/medical-conditions/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          loadConditions()
          setSuccess("Xóa tiền sử bệnh lý thành công!")
        } else {
          setSuccess("Lỗi: Không thể xóa dữ liệu.")
        }
      } catch (error) {
        setSuccess("Lỗi kết nối server.")
      }

      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const resetConditionForm = () => {
    setConditionFormData({
      condition: "",
      type: "disease",
      diagnosedDate: "",
      severity: "mild",
      status: "active",
      notes: "",
    })
    setIsAddingCondition(false)
    setEditingConditionId(null)
  }

  // --- 6. Đổi mật khẩu (API POST) ---
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSuccess("Mật khẩu xác nhận không khớp!")
      setTimeout(() => setSuccess(""), 3000)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setSuccess("Mật khẩu mới phải có ít nhất 6 ký tự!")
      setTimeout(() => setSuccess(""), 3000)
      return
    }

    try {
      const response = await fetch(`https://api-du-an.com/users/${user.id}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (response.ok) {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setSuccess("Đổi mật khẩu thành công!")
      } else {
        const errData = await response.json()
        setSuccess(errData.message || "Đổi mật khẩu thất bại (sai mật khẩu cũ)!")
      }
    } catch (error) {
      setSuccess("Lỗi kết nối server.")
    }

    setTimeout(() => setSuccess(""), 3000)
  }

  // --- Các hàm UI Helper giữ nguyên ---
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "disease":
        return "Bệnh nền"
      case "allergy":
        return "Dị ứng"
      case "surgery":
        return "Phẫu thuật"
      default:
        return type
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "mild":
        return "Nhẹ"
      case "moderate":
        return "Trung bình"
      case "severe":
        return "Nặng"
      default:
        return severity
    }
  }

  const getSeverityStyle = (severity: string): React.CSSProperties => {
    switch (severity) {
      case "mild":
        return { backgroundColor: "#d1fae5", color: "#047857" }
      case "moderate":
        return { backgroundColor: "#fef3c7", color: "#b45309" }
      case "severe":
        return { backgroundColor: "#fee2e2", color: "#dc2626" }
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "disease":
        return <Activity size={22} />
      case "allergy":
        return <Pill size={22} />
      case "surgery":
        return <Scissors size={22} />
      default:
        return <Heart size={22} />
    }
  }

  const getTypeGradient = (type: string): string => {
    switch (type) {
      case "disease":
        return "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)"
      case "allergy":
        return "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
      case "surgery":
        return "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)"
      default:
        return "linear-gradient(135deg, #6b7280 0%, #475569 100%)"
    }
  }

  const tabs = [
    {
      id: "personal" as TabType,
      label: "Thông tin cá nhân",
      icon: UserIcon,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    },
    {
      id: "medical" as TabType,
      label: "Tiền sử bệnh lý",
      icon: Heart,
      gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    },
    {
      id: "password" as TabType,
      label: "Đổi mật khẩu",
      icon: Lock,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
  ]

  // --- Các Styles giữ nguyên ---
  const containerStyle: React.CSSProperties = {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "32px 20px",
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)",
  }

  const headerStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    borderRadius: "24px",
    padding: "32px",
    marginBottom: "24px",
    color: "#ffffff",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
  }

  const headerPatternStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    width: "300px",
    height: "100%",
    background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
    pointerEvents: "none",
  }

  const avatarStyle: React.CSSProperties = {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    border: "4px solid rgba(255,255,255,0.8)",
  }

  const tabContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    padding: "8px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  }

  const getTabStyle = (tabId: string, gradient: string): React.CSSProperties => {
    const isActive = activeTab === tabId
    const isHovered = hoveredTab === tabId
    return {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "16px 20px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      borderRadius: "14px",
      background: isActive ? gradient : isHovered ? "#f8fafc" : "transparent",
      color: isActive ? "#ffffff" : "#64748b",
      transition: "all 0.3s ease",
      boxShadow: isActive ? "0 8px 20px rgba(0,0,0,0.15)" : "none",
      transform: isActive ? "scale(1.02)" : "scale(1)",
    }
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    padding: "32px",
    marginBottom: "24px",
    border: "1px solid #f1f5f9",
  }

  const cardHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    paddingBottom: "20px",
    borderBottomWidth: "2px",
    borderBottomStyle: "solid",
    borderBottomColor: "#f1f5f9",
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "26px",
    fontWeight: 700,
    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const buttonStyle: React.CSSProperties = {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.35)",
    transition: "all 0.3s ease",
  }

  const buttonSecondaryStyle: React.CSSProperties = {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    color: "#475569",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
  }

  const buttonSuccessStyle: React.CSSProperties = {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.35)",
  }

  const buttonDangerStyle: React.CSSProperties = {
    padding: "10px 16px",
    background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
    color: "#dc2626",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }

  const formGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
  }

  const labelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "10px",
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    border: "2px solid #e2e8f0",
    borderRadius: "14px",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  }

  const inputDisabledStyle: React.CSSProperties = {
    backgroundColor: "#f8fafc",
    color: "#64748b",
    borderColor: "#f1f5f9",
  }

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    border: "2px solid #e2e8f0",
    borderRadius: "14px",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    boxSizing: "border-box",
    appearance: "auto",
    WebkitAppearance: "menulist",
  }

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    border: "2px solid #e2e8f0",
    borderRadius: "14px",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    minHeight: "100px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  }

  const alertStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: 600,
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const alertSuccessStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    color: "#047857",
    border: "1px solid #a7f3d0",
  }

  const alertErrorStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
    color: "#dc2626",
    border: "1px solid #fecaca",
  }

  const conditionCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #f1f5f9",
    padding: "24px",
    marginBottom: "16px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  }

  const emptyStateStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "60px 32px",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderRadius: "20px",
    border: "2px dashed #cbd5e1",
  }

  const passwordContainerStyle: React.CSSProperties = {
    maxWidth: "480px",
    margin: "0 auto",
  }

  const passwordHeaderStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "40px",
  }

  const passwordIconStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 16px 32px rgba(16, 185, 129, 0.35)",
  }

  const securityNoteStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "32px",
    border: "1px solid #93c5fd",
  }

  const inputWrapperStyle: React.CSSProperties = {
    position: "relative",
  }

  const eyeButtonStyle: React.CSSProperties = {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  return (
    <div style={containerStyle}>
      {/* Header with Avatar */}
      <div style={headerStyle}>
        <div style={headerPatternStyle} />
        <div style={{ display: "flex", alignItems: "center", gap: "24px", position: "relative", zIndex: 1 }}>
          <div style={avatarStyle}>
            <UserIcon size={40} color="#667eea" />
          </div>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 8px 0" }}>{user.profile.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", opacity: 0.9 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <IdCard size={16} />
                {user.profile.patientId || "N/A"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <Phone size={16} />
                {user.profile.phone}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.2)",
            padding: "8px 16px",
            borderRadius: "30px",
            fontSize: "13px",
          }}
        >
          <Sparkles size={16} />
          Hồ sơ bệnh nhân
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={tabContainerStyle}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={getTabStyle(tab.id, tab.gradient)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Success/Error Message */}
      {success && (
        <div
          style={{
            ...alertStyle,
            ...(success.includes("Lỗi") || success.includes("không") ? alertErrorStyle : alertSuccessStyle),
          }}
        >
          {success.includes("Lỗi") || success.includes("không") ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
          {success}
        </div>
      )}

      {/* Personal Info Tab */}
      {activeTab === "personal" && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={titleStyle}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserIcon size={22} color="#ffffff" />
              </div>
              Thông tin cá nhân
            </h2>
            {!isEditing && (
              <button style={buttonStyle} onClick={() => setIsEditing(true)}>
                <Edit size={18} />
                Cập nhật thông tin
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={formGridStyle}>
              <div>
                <label style={labelStyle}>
                  <IdCard size={18} color="#3b82f6" />
                  Mã bệnh nhân
                </label>
                <input
                  type="text"
                  value={formData.patientId || ""}
                  disabled
                  style={{ ...inputStyle, ...inputDisabledStyle }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <UserIcon size={18} color="#3b82f6" />
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ ...inputStyle, ...(!isEditing ? inputDisabledStyle : {}) }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Phone size={18} color="#10b981" />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ ...inputStyle, ...(!isEditing ? inputDisabledStyle : {}) }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <IdCard size={18} color="#8b5cf6" />
                  CCCD
                </label>
                <input
                  type="text"
                  name="cccd"
                  value={formData.cccd}
                  disabled
                  style={{ ...inputStyle, ...inputDisabledStyle }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Calendar size={18} color="#f59e0b" />
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ ...inputStyle, ...(!isEditing ? inputDisabledStyle : {}) }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Users size={18} color="#ec4899" />
                  Giới tính
                </label>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ ...inputStyle, ...(!isEditing ? inputDisabledStyle : {}) }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Mail size={18} color="#06b6d4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ ...inputStyle, ...(!isEditing ? inputDisabledStyle : {}) }}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  <Phone size={18} color="#ef4444" />
                  Liên hệ khẩn cấp
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ ...inputStyle, ...(!isEditing ? inputDisabledStyle : {}) }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>
                  <MapPin size={18} color="#f97316" />
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ ...inputStyle, ...(!isEditing ? inputDisabledStyle : {}) }}
                />
              </div>
            </div>

            {isEditing && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTopWidth: "2px",
                  borderTopStyle: "solid",
                  borderTopColor: "#f1f5f9",
                }}
              >
                <button
                  type="button"
                  style={buttonSecondaryStyle}
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(user.profile)
                  }}
                >
                  Hủy bỏ
                </button>
                <button type="submit" style={buttonSuccessStyle}>
                  <Save size={18} />
                  Lưu thay đổi
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Medical History Tab */}
      {activeTab === "medical" && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={titleStyle}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart size={22} color="#ffffff" />
              </div>
              Tiền sử bệnh lý
            </h2>
            {!isAddingCondition && !editingConditionId && (
              <button style={buttonStyle} onClick={() => setIsAddingCondition(true)}>
                <Plus size={18} />
                Thêm mới
              </button>
            )}
          </div>

          {/* Add/Edit Form */}
          {(isAddingCondition || editingConditionId) && (
            <div
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                borderRadius: "20px",
                padding: "28px",
                marginBottom: "28px",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: 600, color: "#1e293b" }}>
                {editingConditionId ? "Chỉnh sửa tiền sử bệnh lý" : "Thêm tiền sử bệnh lý mới"}
              </h3>
              <div style={formGridStyle}>
                <div>
                  <label style={labelStyle}>Tên bệnh lý *</label>
                  <input
                    type="text"
                    value={conditionFormData.condition || ""}
                    onChange={(e) => setConditionFormData({ ...conditionFormData, condition: e.target.value })}
                    style={inputStyle}
                    placeholder="Nhập tên bệnh lý"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Loại</label>
                  <select
                    value={conditionFormData.type || "disease"}
                    onChange={(e) => setConditionFormData({ ...conditionFormData, type: e.target.value as any })}
                    style={selectStyle}
                  >
                    <option value="disease">Bệnh nền</option>
                    <option value="allergy">Dị ứng</option>
                    <option value="surgery">Phẫu thuật</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Ngày phát hiện</label>
                  <input
                    type="date"
                    value={conditionFormData.diagnosedDate || ""}
                    onChange={(e) => setConditionFormData({ ...conditionFormData, diagnosedDate: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Mức độ</label>
                  <select
                    value={conditionFormData.severity || "mild"}
                    onChange={(e) => setConditionFormData({ ...conditionFormData, severity: e.target.value as any })}
                    style={selectStyle}
                  >
                    <option value="mild">Nhẹ</option>
                    <option value="moderate">Trung bình</option>
                    <option value="severe">Nặng</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Trạng thái</label>
                  <select
                    value={conditionFormData.status || "active"}
                    onChange={(e) => setConditionFormData({ ...conditionFormData, status: e.target.value as any })}
                    style={selectStyle}
                  >
                    <option value="active">Đang điều trị</option>
                    <option value="resolved">Đã khỏi</option>
                  </select>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <label style={labelStyle}>Ghi chú</label>
                  <textarea
                    value={conditionFormData.notes || ""}
                    onChange={(e) => setConditionFormData({ ...conditionFormData, notes: e.target.value })}
                    style={textareaStyle}
                    placeholder="Thêm ghi chú về tình trạng bệnh lý..."
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" style={buttonSecondaryStyle} onClick={resetConditionForm}>
                  Hủy
                </button>
                <button
                  type="button"
                  style={buttonSuccessStyle}
                  onClick={editingConditionId ? handleUpdateCondition : handleAddCondition}
                >
                  <Save size={18} />
                  {editingConditionId ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          )}

          {/* Conditions List */}
          {conditions.length === 0 ? (
            <div style={emptyStateStyle}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Heart size={36} color="#ec4899" />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b", margin: "0 0 8px 0" }}>
                Chưa có tiền sử bệnh lý
              </h3>
              <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>
                Nhấn nút "Thêm mới" để bắt đầu ghi nhận tiền sử bệnh lý
              </p>
            </div>
          ) : (
            <div>
              {conditions.map((condition) => (
                <div key={condition.id} style={conditionCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "16px",
                          background: getTypeGradient(condition.type),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                        }}
                      >
                        {getTypeIcon(condition.type)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#1e293b", margin: "0 0 10px 0" }}>
                          {condition.condition}
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                          <span
                            style={{
                              padding: "5px 14px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 600,
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                            }}
                          >
                            {getTypeLabel(condition.type)}
                          </span>
                          <span
                            style={{
                              padding: "5px 14px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 600,
                              ...getSeverityStyle(condition.severity),
                            }}
                          >
                            {getSeverityLabel(condition.severity)}
                          </span>
                          <span
                            style={{
                              padding: "5px 14px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 600,
                              backgroundColor: condition.status === "active" ? "#dbeafe" : "#d1fae5",
                              color: condition.status === "active" ? "#1d4ed8" : "#047857",
                            }}
                          >
                            {condition.status === "active" ? "Đang điều trị" : "Đã khỏi"}
                          </span>
                        </div>
                        {condition.diagnosedDate && (
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#64748b",
                              margin: "0 0 6px 0",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Calendar size={14} />
                            Phát hiện: {new Date(condition.diagnosedDate).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                        {condition.notes && (
                          <p style={{ fontSize: "14px", color: "#64748b", margin: 0, fontStyle: "italic" }}>
                            "{condition.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        style={{ ...buttonSecondaryStyle, padding: "10px 14px" }}
                        onClick={() => handleEditCondition(condition.id)}
                      >
                        <Edit size={16} />
                      </button>
                      <button style={buttonDangerStyle} onClick={() => handleDeleteCondition(condition.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Password Change Tab */}
      {activeTab === "password" && (
        <div style={cardStyle}>
          <div style={passwordContainerStyle}>
            <div style={passwordHeaderStyle}>
              <div style={passwordIconStyle}>
                <Key size={44} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#1e293b", margin: "0 0 8px 0" }}>
                Đổi mật khẩu
              </h2>
              <p style={{ color: "#64748b", margin: 0, fontSize: "15px" }}>
                Cập nhật mật khẩu để bảo vệ tài khoản của bạn
              </p>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>
                  <Lock size={18} color="#64748b" />
                  Mật khẩu hiện tại
                </label>
                <div style={inputWrapperStyle}>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    style={{ ...inputStyle, paddingRight: "50px" }}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    style={eyeButtonStyle}
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>
                  <Key size={18} color="#64748b" />
                  Mật khẩu mới
                </label>
                <div style={inputWrapperStyle}>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    style={{ ...inputStyle, paddingRight: "50px" }}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    style={eyeButtonStyle}
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={labelStyle}>
                  <Shield size={18} color="#64748b" />
                  Xác nhận mật khẩu mới
                </label>
                <div style={inputWrapperStyle}>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    style={{ ...inputStyle, paddingRight: "50px" }}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    style={eyeButtonStyle}
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  ...buttonSuccessStyle,
                  width: "100%",
                  justifyContent: "center",
                  padding: "16px 24px",
                  fontSize: "16px",
                }}
              >
                <Save size={20} />
                Cập nhật mật khẩu
              </button>
            </form>

            <div style={securityNoteStyle}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Shield size={20} color="#ffffff" />
                </div>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#1e40af", margin: "0 0 8px 0" }}>
                    Lưu ý bảo mật
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "18px", color: "#1e40af", fontSize: "13px", lineHeight: 1.7 }}>
                    <li>Mật khẩu phải có ít nhất 6 ký tự</li>
                    <li>Sử dụng kết hợp chữ hoa, chữ thường và số</li>
                    <li>Không chia sẻ mật khẩu với người khác</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}