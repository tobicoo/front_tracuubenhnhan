"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  FileText,
  Calendar,
  User,
  Search,
  Eye,
  DollarSign,
  Pill,
  Activity,
  X,
  Filter,
  Printer,
  Stethoscope,
  Heart,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from "lucide-react"

interface MedicalRecord {
  id: string
  patientId: string
  date: string
  doctorName: string
  diagnosis: string
  symptoms: string
  treatment: string
  notes: string
  prescription?: string
  cost?: number
  testResults?: string
  type?: string
}

interface PatientRecordsProps {
  userId?: string
}

export default function PatientRecords({ userId = "demo-user" }: PatientRecordsProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [filterType, setFilterType] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)

  useEffect(() => {
    loadRecords()
  }, [userId])

  useEffect(() => {
    setFilteredRecords(records)
  }, [records])


const loadRecords = async () => {
  try {
    const response = await fetch(`https://api-du-an.com/medical-records?patientId=${userId}`);
    
    if (!response.ok) {
        throw new Error("Lỗi tải dữ liệu");
    }

    const data = await response.json();
    
    const sortedData = data.sort((a: MedicalRecord, b: MedicalRecord) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setRecords(sortedData);
  } catch (error) {
    console.error("Lỗi:", error);
    setRecords([]); 
  }
};

  const handleSearch = () => {
    let filtered = [...records]

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (record) =>
          record.diagnosis.toLowerCase().includes(term) ||
          record.doctorName.toLowerCase().includes(term) ||
          record.symptoms.toLowerCase().includes(term),
      )
    }

    if (filterDateFrom !== "") {
      filtered = filtered.filter((record) => record.date >= filterDateFrom)
    }

    if (filterDateTo !== "") {
      filtered = filtered.filter((record) => record.date <= filterDateTo)
    }

    if (filterType !== "") {
      filtered = filtered.filter((record) => record.type === filterType)
    }

    setFilteredRecords(filtered)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setFilterDateFrom("")
    setFilterDateTo("")
    setFilterType("")
    setFilteredRecords(records)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateFull = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTypeStyle = (type?: string) => {
    switch (type) {
      case "Khám bệnh":
        return {
          bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          color: "#1d4ed8",
          icon: Stethoscope,
          iconBg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        }
      case "Khám định kỳ":
        return {
          bg: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
          color: "#15803d",
          icon: CheckCircle,
          iconBg: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
        }
      case "Tái khám":
        return {
          bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          color: "#b45309",
          icon: TrendingUp,
          iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        }
      default:
        return {
          bg: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
          color: "#4b5563",
          icon: FileText,
          iconBg: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
        }
    }
  }

  const hideScrollbarCSS = `
    .patient-records-modal-content::-webkit-scrollbar {
      display: none;
    }
    .patient-records-modal-content {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .record-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
  `

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 50%, #fef3c7 100%)",
      padding: "24px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    innerContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    // Header Section
    headerSection: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
      borderRadius: "24px",
      padding: "32px",
      marginBottom: "24px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 10px 40px rgba(99, 102, 241, 0.3)",
    },
    headerPattern: {
      position: "absolute",
      top: 0,
      right: 0,
      width: "300px",
      height: "100%",
      background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
    },
    headerContent: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },
    headerIcon: {
      width: "72px",
      height: "72px",
      borderRadius: "20px",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
    headerTitle: {
      fontSize: "32px",
      fontWeight: "800",
      color: "#ffffff",
      margin: 0,
      textShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    headerSubtitle: {
      fontSize: "16px",
      color: "rgba(255, 255, 255, 0.9)",
      margin: "8px 0 0 0",
    },
    // Stats Section
    statsSection: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statCard: {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
      transition: "all 0.3s ease",
    },
    statIcon: {
      width: "56px",
      height: "56px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    statValue: {
      fontSize: "28px",
      fontWeight: "700",
      margin: 0,
    },
    statLabel: {
      fontSize: "14px",
      color: "#6b7280",
      margin: "4px 0 0 0",
    },
    // Filter Section
    filterCard: {
      background: "#ffffff",
      borderRadius: "24px",
      padding: "28px",
      marginBottom: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    },
    filterHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "24px",
    },
    filterIconWrapper: {
      width: "44px",
      height: "44px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
    },
    filterTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
    },
    filterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    inputIcon: {
      position: "absolute",
      left: "14px",
      color: "#9ca3af",
      pointerEvents: "none",
    },
    input: {
      width: "100%",
      padding: "14px 14px 14px 44px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      borderRadius: "14px",
      fontSize: "15px",
      backgroundColor: "#f9fafb",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
    },
    inputNoIcon: {
      width: "100%",
      padding: "14px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      borderRadius: "14px",
      fontSize: "15px",
      backgroundColor: "#f9fafb",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
    },
    select: {
      width: "100%",
      padding: "14px",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      borderRadius: "14px",
      fontSize: "15px",
      backgroundColor: "#f9fafb",
      cursor: "pointer",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
    },
    filterActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "24px",
      paddingTop: "20px",
      borderTopWidth: "2px",
      borderTopStyle: "solid",
      borderTopColor: "#f3f4f6",
      flexWrap: "wrap",
      gap: "16px",
    },
    resultCount: {
      fontSize: "15px",
      color: "#6b7280",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    resultBadge: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "#ffffff",
      padding: "4px 12px",
      borderRadius: "20px",
      fontWeight: "700",
      fontSize: "14px",
    },
    filterBtnGroup: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },
    resetBtn: {
      padding: "14px 24px",
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      color: "#4b5563",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    searchBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "14px 28px",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
      transition: "all 0.2s ease",
    },
    // Records Section
    recordsSection: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    recordCard: {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "24px",
      cursor: "pointer",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
      transition: "all 0.3s ease",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "transparent",
    },
    recordHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    recordLeft: {
      display: "flex",
      gap: "16px",
      alignItems: "flex-start",
    },
    recordIconWrapper: {
      width: "52px",
      height: "52px",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    recordInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    recordTitleRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
    },
    diagnosis: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
    },
    badge: {
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
    },
    recordMeta: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
    },
    metaItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px",
      color: "#6b7280",
    },
    viewBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 24px",
      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      color: "#2563eb",
      border: "none",
      borderRadius: "14px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    recordBody: {
      marginTop: "16px",
      paddingTop: "16px",
      borderTopWidth: "2px",
      borderTopStyle: "solid",
      borderTopColor: "#f3f4f6",
    },
    symptomsLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#9ca3af",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "6px",
    },
    symptomsText: {
      fontSize: "15px",
      color: "#4b5563",
      margin: 0,
      lineHeight: "1.6",
    },
    // Empty State
    emptyState: {
      textAlign: "center",
      padding: "80px 20px",
      background: "#ffffff",
      borderRadius: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    },
    emptyIconWrapper: {
      width: "100px",
      height: "100px",
      borderRadius: "28px",
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 24px",
    },
    emptyText: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#374151",
      margin: 0,
    },
    emptySubtext: {
      fontSize: "15px",
      color: "#9ca3af",
      marginTop: "8px",
    },
    // Modal
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#ffffff",
      borderRadius: "28px",
      maxWidth: "800px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "auto",
      boxShadow: "0 25px 80px rgba(0, 0, 0, 0.3)",
      animation: "fadeIn 0.3s ease",
    },
    modalHeader: {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
      padding: "28px",
      borderTopLeftRadius: "28px",
      borderTopRightRadius: "28px",
      position: "relative",
    },
    modalHeaderContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    modalTitle: {
      fontSize: "26px",
      fontWeight: "800",
      color: "#ffffff",
      margin: 0,
    },
    modalSubtitle: {
      fontSize: "15px",
      color: "rgba(255, 255, 255, 0.8)",
      marginTop: "6px",
    },
    closeBtn: {
      width: "44px",
      height: "44px",
      borderRadius: "14px",
      border: "none",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "#ffffff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    modalBody: {
      padding: "28px",
    },
    section: {
      marginBottom: "28px",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "16px",
    },
    sectionIconWrapper: {
      width: "40px",
      height: "40px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
    },
    infoCard: {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      padding: "18px",
      borderRadius: "16px",
    },
    infoLabel: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "6px",
    },
    infoValue: {
      fontSize: "16px",
      color: "#111827",
      fontWeight: "600",
    },
    contentBox: {
      padding: "18px",
      borderRadius: "16px",
      fontSize: "15px",
      lineHeight: "1.7",
    },
    prescriptionBox: {
      background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "#e9d5ff",
      padding: "20px",
      borderRadius: "16px",
    },
    prescriptionText: {
      whiteSpace: "pre-wrap",
      fontFamily: "inherit",
      fontSize: "15px",
      color: "#7c3aed",
      margin: 0,
      lineHeight: "2",
    },
    modalFooter: {
      padding: "20px 28px 28px",
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
    },
    printBtn: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "14px 28px",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
    },
    closeModalBtn: {
      padding: "14px 28px",
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      color: "#374151",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
    },
  }

  const totalRecords = records.length
  const khamBenhCount = records.filter((r) => r.type === "Khám bệnh").length
  const taiKhamCount = records.filter((r) => r.type === "Tái khám").length

  return (
    <div style={styles.container}>
      <style>{hideScrollbarCSS}</style>

      <div style={styles.innerContainer}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerPattern}></div>
          <div style={styles.headerContent}>
            <div style={styles.headerIcon}>
              <ClipboardList size={36} color="#ffffff" />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Tra cứu hồ sơ khám bệnh</h1>
              <p style={styles.headerSubtitle}>Xem lịch sử khám bệnh và chi tiết các lượt khám của bạn</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
              <FileText size={28} color="#ffffff" />
            </div>
            <div>
              <p style={{ ...styles.statValue, color: "#6366f1" }}>{totalRecords}</p>
              <p style={styles.statLabel}>Tổng lượt khám</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
              <Stethoscope size={28} color="#ffffff" />
            </div>
            <div>
              <p style={{ ...styles.statValue, color: "#3b82f6" }}>{khamBenhCount}</p>
              <p style={styles.statLabel}>Khám bệnh</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
              <TrendingUp size={28} color="#ffffff" />
            </div>
            <div>
              <p style={{ ...styles.statValue, color: "#f59e0b" }}>{taiKhamCount}</p>
              <p style={styles.statLabel}>Tái khám</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div style={styles.filterCard}>
          <div style={styles.filterHeader}>
            <div style={styles.filterIconWrapper}>
              <Filter size={22} color="#ffffff" />
            </div>
            <h2 style={styles.filterTitle}>Bộ lọc tìm kiếm</h2>
          </div>

          <div style={styles.filterGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tìm kiếm theo từ khóa</label>
              <div style={styles.inputWrapper}>
                <Search size={20} style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Chẩn đoán, bác sĩ, triệu chứng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Từ ngày</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                style={styles.inputNoIcon}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Đến ngày</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                style={styles.inputNoIcon}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Loại lượt khám</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={styles.select}>
                <option value="">Tất cả</option>
                <option value="Khám bệnh">Khám bệnh</option>
                <option value="Khám định kỳ">Khám định kỳ</option>
                <option value="Tái khám">Tái khám</option>
              </select>
            </div>
          </div>

          <div style={styles.filterActions}>
            <p style={styles.resultCount}>
              Tìm thấy <span style={styles.resultBadge}>{filteredRecords.length}</span> lượt khám
            </p>
            <div style={styles.filterBtnGroup}>
              {(searchTerm || filterDateFrom || filterDateTo || filterType) && (
                <button onClick={resetFilters} style={styles.resetBtn}>
                  Xóa bộ lọc
                </button>
              )}
              <button onClick={handleSearch} style={styles.searchBtn}>
                <Search size={20} />
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIconWrapper}>
              <FileText size={48} color="#9ca3af" />
            </div>
            <p style={styles.emptyText}>Không tìm thấy dữ liệu</p>
            <p style={styles.emptySubtext}>Vui lòng thử lại với tiêu chí lọc khác</p>
          </div>
        ) : (
          <div style={styles.recordsSection}>
            {filteredRecords.map((record) => {
              const typeStyle = getTypeStyle(record.type)
              const TypeIcon = typeStyle.icon
              return (
                <div
                  key={record.id}
                  style={styles.recordCard}
                  className="record-card"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div style={styles.recordHeader}>
                    <div style={styles.recordLeft}>
                      <div
                        style={{
                          ...styles.recordIconWrapper,
                          background: typeStyle.iconBg,
                          boxShadow: `0 4px 12px ${typeStyle.color}40`,
                        }}
                      >
                        <TypeIcon size={26} color="#ffffff" />
                      </div>
                      <div style={styles.recordInfo}>
                        <div style={styles.recordTitleRow}>
                          <h3 style={styles.diagnosis}>{record.diagnosis}</h3>
                          {record.type && (
                            <span style={{ ...styles.badge, background: typeStyle.bg, color: typeStyle.color }}>
                              {record.type}
                            </span>
                          )}
                        </div>
                        <div style={styles.recordMeta}>
                          <span style={styles.metaItem}>
                            <Calendar size={16} color="#6366f1" />
                            {formatDate(record.date)}
                          </span>
                          <span style={styles.metaItem}>
                            <User size={16} color="#22c55e" />
                            {record.doctorName}
                          </span>
                          {record.cost && (
                            <span style={styles.metaItem}>
                              <DollarSign size={16} color="#f59e0b" />
                              {record.cost.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      style={styles.viewBtn}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRecord(record)
                      }}
                    >
                      <Eye size={18} />
                      Xem chi tiết
                    </button>
                  </div>
                  <div style={styles.recordBody}>
                    <p style={styles.symptomsLabel}>Triệu chứng</p>
                    <p style={styles.symptomsText}>{record.symptoms}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRecord && (
        <div style={styles.modal} onClick={() => setSelectedRecord(null)}>
          <div
            style={styles.modalContent}
            className="patient-records-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div style={styles.modalHeaderContent}>
                <div>
                  <h2 style={styles.modalTitle}>{selectedRecord.diagnosis}</h2>
                  <p style={styles.modalSubtitle}>
                    Mã lượt khám: {selectedRecord.id} | {formatDateFull(selectedRecord.date)}
                  </p>
                </div>
                <button style={styles.closeBtn} onClick={() => setSelectedRecord(null)}>
                  <X size={22} />
                </button>
              </div>
            </div>

            <div style={styles.modalBody}>
              {/* Thông tin lượt khám */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div
                    style={{
                      ...styles.sectionIconWrapper,
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    }}
                  >
                    <Stethoscope size={20} color="#ffffff" />
                  </div>
                  <h3 style={styles.sectionTitle}>Thông tin lượt khám</h3>
                </div>
                <div style={styles.infoGrid}>
                  <div style={styles.infoCard}>
                    <p style={styles.infoLabel}>Bác sĩ khám</p>
                    <p style={styles.infoValue}>{selectedRecord.doctorName}</p>
                  </div>
                  <div style={styles.infoCard}>
                    <p style={styles.infoLabel}>Loại lượt khám</p>
                    <p style={styles.infoValue}>{selectedRecord.type || "Khám bệnh"}</p>
                  </div>
                  <div style={styles.infoCard}>
                    <p style={styles.infoLabel}>Chi phí</p>
                    <p style={{ ...styles.infoValue, color: "#f59e0b" }}>
                      {selectedRecord.cost?.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              </div>

              {/* Triệu chứng */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div
                    style={{
                      ...styles.sectionIconWrapper,
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    }}
                  >
                    <Activity size={20} color="#ffffff" />
                  </div>
                  <h3 style={styles.sectionTitle}>Triệu chứng</h3>
                </div>
                <div
                  style={{
                    ...styles.contentBox,
                    background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                    color: "#991b1b",
                  }}
                >
                  {selectedRecord.symptoms}
                </div>
              </div>

              {/* Kết quả xét nghiệm */}
              {selectedRecord.testResults && (
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <div
                      style={{
                        ...styles.sectionIconWrapper,
                        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      }}
                    >
                      <FileText size={20} color="#ffffff" />
                    </div>
                    <h3 style={styles.sectionTitle}>Kết quả xét nghiệm</h3>
                  </div>
                  <div
                    style={{
                      ...styles.contentBox,
                      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                      color: "#1d4ed8",
                    }}
                  >
                    {selectedRecord.testResults}
                  </div>
                </div>
              )}

              {/* Phương pháp điều trị */}
              <div style={styles.section}>
                <div style={styles.sectionHeader}>
                  <div
                    style={{
                      ...styles.sectionIconWrapper,
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                    }}
                  >
                    <Heart size={20} color="#ffffff" />
                  </div>
                  <h3 style={styles.sectionTitle}>Phương pháp điều trị</h3>
                </div>
                <div
                  style={{
                    ...styles.contentBox,
                    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    color: "#166534",
                  }}
                >
                  {selectedRecord.treatment}
                </div>
              </div>

              {/* Đơn thuốc */}
              {selectedRecord.prescription && (
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <div
                      style={{
                        ...styles.sectionIconWrapper,
                        background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                      }}
                    >
                      <Pill size={20} color="#ffffff" />
                    </div>
                    <h3 style={styles.sectionTitle}>Đơn thuốc</h3>
                  </div>
                  <div style={styles.prescriptionBox}>
                    <pre style={styles.prescriptionText}>{selectedRecord.prescription}</pre>
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              {selectedRecord.notes && (
                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <div
                      style={{
                        ...styles.sectionIconWrapper,
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      }}
                    >
                      <AlertCircle size={20} color="#ffffff" />
                    </div>
                    <h3 style={styles.sectionTitle}>Ghi chú của bác sĩ</h3>
                  </div>
                  <div
                    style={{
                      ...styles.contentBox,
                      background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                      color: "#92400e",
                    }}
                  >
                    {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.closeModalBtn} onClick={() => setSelectedRecord(null)}>
                Đóng
              </button>
              <button style={styles.printBtn} onClick={() => window.print()}>
                <Printer size={18} />
                In hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}