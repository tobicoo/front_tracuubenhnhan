"use client"

import type React from "react"
// SỬA LẠI: Dùng useNavigate của react-router-dom (Chuẩn Vite)
import { useNavigate } from "react-router-dom" 
import { useState, useEffect } from "react"
import {
  Activity,
  FileText,
  Calendar,
  Heart,
  TrendingUp,
  Clock,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Droplets,
  Moon,
  Apple,
  Dumbbell,
  User,
  Stethoscope,
} from "lucide-react"

interface MedicalRecord {
  id: string
  patientId: string
  date: string
  doctorName: string
  diagnosis: string
}

interface MedicalCondition {
  id: string
  patientId: string
  condition: string
  type: string
  status: string
}

interface PatientDashboardHomeProps {
  userId: string
  userName: string
}

export default function PatientDashboardHome({ userId, userName }: PatientDashboardHomeProps) {
  // SỬA LẠI: Dùng hook navigate
  const navigate = useNavigate() 
  
  const [stats, setStats] = useState({
    totalVisits: 0,
    activeConditions: 0,
    upcomingAppointments: 0,
    recentVisits: [] as MedicalRecord[],
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Gọi API lấy thống kê
        const response = await fetch(`https://api-du-an.com/dashboard/stats?patientId=${userId}`);
        
        if (response.ok) {
            const data = await response.json();
            setStats({
              totalVisits: data.totalVisits || 0,
              activeConditions: data.activeConditions || 0,
              upcomingAppointments: data.upcomingAppointments || 0,
              recentVisits: data.recentVisits || [],
            });
        }
      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      }
    };

    loadStats()
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [userId])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }

  const getGreetingIcon = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "🌅"
    if (hour < 18) return "☀️"
    return "🌙"
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("vi-VN", options)
  }

  const handleNavigate = (path: string) => {
    // SỬA LẠI: Dùng navigate() thay vì router.push()
    navigate(path) 
  }

  // --- PHẦN STYLE GIỮ NGUYÊN KHÔNG ĐỔI ---
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "24px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    welcomeSection: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      borderRadius: "24px",
      padding: "40px",
      marginBottom: "32px",
      color: "white",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(102, 126, 234, 0.4)",
    },
    welcomePattern: {
      position: "absolute",
      top: 0,
      right: 0,
      width: "300px",
      height: "300px",
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      transform: "translate(30%, -30%)",
    },
    welcomeContent: {
      position: "relative",
      zIndex: 1,
    },
    dateText: {
      fontSize: "14px",
      opacity: 0.9,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    greetingText: {
      fontSize: "36px",
      fontWeight: 700,
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    welcomeSubtext: {
      fontSize: "16px",
      opacity: 0.9,
      maxWidth: "500px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
      marginBottom: "32px",
    },
    statCard: {
      background: "white",
      borderRadius: "20px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "1px solid #f0f0f0",
      position: "relative",
      overflow: "hidden",
    },
    statIconWrapper: {
      width: "56px",
      height: "56px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
    },
    statTitle: {
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "4px",
      fontWeight: 500,
    },
    statValue: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#1e293b",
    },
    statTrend: {
      fontSize: "12px",
      color: "#10b981",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      marginTop: "8px",
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      marginBottom: "32px",
    },
    card: {
      background: "white",
      borderRadius: "20px",
      padding: "28px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #f0f0f0",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#1e293b",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    viewAllBtn: {
      fontSize: "14px",
      color: "#6366f1",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      background: "none",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      transition: "background 0.2s",
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "40px 20px",
      color: "#94a3b8",
    },
    emptyIcon: {
      width: "64px",
      height: "64px",
      margin: "0 auto 16px",
      background: "#f1f5f9",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    visitCard: {
      padding: "16px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      marginBottom: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: "#fafafa",
    },
    visitHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "8px",
    },
    visitDiagnosis: {
      fontSize: "15px",
      fontWeight: 600,
      color: "#1e293b",
    },
    visitDate: {
      fontSize: "12px",
      color: "#94a3b8",
      background: "#f1f5f9",
      padding: "4px 10px",
      borderRadius: "20px",
    },
    visitDoctor: {
      fontSize: "13px",
      color: "#64748b",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    quickActionCard: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      marginBottom: "12px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: "white",
    },
    quickActionIcon: {
      width: "52px",
      height: "52px",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    quickActionContent: {
      flex: 1,
    },
    quickActionTitle: {
      fontSize: "15px",
      fontWeight: 600,
      color: "#1e293b",
      marginBottom: "4px",
    },
    quickActionDesc: {
      fontSize: "13px",
      color: "#64748b",
    },
    quickActionArrow: {
      color: "#cbd5e1",
    },
    healthTipsSection: {
      background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #ecfeff 100%)",
      borderRadius: "20px",
      padding: "28px",
      border: "1px solid #d1fae5",
    },
    healthTipsHeader: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "20px",
    },
    healthTipsTitle: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#065f46",
    },
    healthTipsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "16px",
    },
    tipCard: {
      background: "white",
      borderRadius: "16px",
      padding: "20px",
      textAlign: "center" as const,
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    tipIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 12px",
    },
    tipText: {
      fontSize: "13px",
      color: "#374151",
      fontWeight: 500,
    },
  }

  const mediaStyles = `
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .main-grid { grid-template-columns: 1fr !important; }
      .tips-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
  `

  return (
    <>
      <style>{mediaStyles}</style>
      <div style={styles.container}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <div style={styles.welcomePattern}></div>
          <div style={styles.welcomeContent}>
            <div style={styles.dateText}>
              <Calendar size={14} />
              {formatDate(currentTime)}
            </div>
            <h1 style={styles.greetingText}>
              {getGreetingIcon()} {getGreeting()}, {userName}!
            </h1>
            <p style={styles.welcomeSubtext}>
              Chào mừng bạn quay trở lại. Hãy theo dõi sức khỏe của bạn và quản lý hồ sơ y tế một cách dễ dàng.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={styles.statsGrid}>
           <div
            style={{
              ...styles.statCard,
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(59, 130, 246, 0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ ...styles.statIconWrapper, background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
              <FileText size={28} color="white" />
            </div>
            <p style={styles.statTitle}>Tổng lượt khám</p>
            <p style={styles.statValue}>{stats.totalVisits}</p>
            <div style={styles.statTrend}>
              <TrendingUp size={14} />
              Cập nhật
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              background: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(239, 68, 68, 0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ ...styles.statIconWrapper, background: "linear-gradient(135deg, #ef4444, #dc2626)" }}>
              <Heart size={28} color="white" />
            </div>
            <p style={styles.statTitle}>Bệnh lý đang điều trị</p>
            <p style={styles.statValue}>{stats.activeConditions}</p>
            <div style={{ ...styles.statTrend, color: stats.activeConditions > 0 ? "#f59e0b" : "#10b981" }}>
              <Activity size={14} />
              {stats.activeConditions > 0 ? "Đang theo dõi" : "Ổn định"}
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              background: "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(34, 197, 94, 0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ ...styles.statIconWrapper, background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
              <Calendar size={28} color="white" />
            </div>
            <p style={styles.statTitle}>Lịch hẹn sắp tới</p>
            <p style={styles.statValue}>{stats.upcomingAppointments}</p>
            <div style={styles.statTrend}>
              <Clock size={14} />
              Không có lịch hẹn
            </div>
          </div>

          <div
            style={{
              ...styles.statCard,
              background: "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)"
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(147, 51, 234, 0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ ...styles.statIconWrapper, background: "linear-gradient(135deg, #a855f7, #9333ea)" }}>
              <Sparkles size={28} color="white" />
            </div>
            <p style={styles.statTitle}>Tình trạng sức khỏe</p>
            <p style={{ ...styles.statValue, color: "#16a34a" }}>Tốt</p>
            <div style={styles.statTrend}>
              <TrendingUp size={14} />
              Ổn định
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="main-grid" style={styles.mainGrid}>
          {/* Recent Visits */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Clock size={20} color="white" />
                </div>
                Lượt khám gần đây
              </h2>
              <button
                style={styles.viewAllBtn}
                onClick={() => handleNavigate("/patient/records")}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#eef2ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Xem tất cả <ChevronRight size={18} />
              </button>
            </div>

            {stats.recentVisits.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <FileText size={28} color="#94a3b8" />
                </div>
                <p style={{ fontSize: "15px", fontWeight: 500, marginBottom: "4px" }}>Chưa có lượt khám nào</p>
                <p style={{ fontSize: "13px" }}>Lịch sử khám bệnh sẽ hiển thị ở đây</p>
              </div>
            ) : (
              <div>
                {stats.recentVisits.map((visit) => (
                  <div
                    key={visit.id}
                    style={styles.visitCard}
                    onClick={() => handleNavigate("/patient/records")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6366f1"
                      e.currentTarget.style.background = "#fafafa"
                      e.currentTarget.style.transform = "translateX(4px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0"
                      e.currentTarget.style.background = "#fafafa"
                      e.currentTarget.style.transform = "translateX(0)"
                    }}
                  >
                    <div style={styles.visitHeader}>
                      <span style={styles.visitDiagnosis}>{visit.diagnosis}</span>
                      <span style={styles.visitDate}>{new Date(visit.date).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div style={styles.visitDoctor}>
                      <Stethoscope size={14} />
                      BS. {visit.doctorName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp size={20} color="white" />
                </div>
                Thao tác nhanh
              </h2>
            </div>

            {/* Nút 1: Tra cứu */}
            <div
              style={styles.quickActionCard}
              onClick={() => handleNavigate("/patient/records")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6366f1"
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <div style={{ ...styles.quickActionIcon, background: "linear-gradient(135deg, #eff6ff, #dbeafe)" }}>
                <FileText size={24} color="#3b82f6" />
              </div>
              <div style={styles.quickActionContent}>
                <h3 style={styles.quickActionTitle}>Tra cứu hồ sơ khám</h3>
                <p style={styles.quickActionDesc}>Xem lịch sử khám bệnh và đơn thuốc</p>
              </div>
              <ChevronRight size={20} style={styles.quickActionArrow} />
            </div>

            {/* Nút 2: Cập nhật thông tin */}
            <div
              style={styles.quickActionCard}
              onClick={() => handleNavigate("/patient/profile")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a855f7"
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(168, 85, 247, 0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <div style={{ ...styles.quickActionIcon, background: "linear-gradient(135deg, #faf5ff, #e9d5ff)" }}>
                <User size={24} color="#a855f7" />
              </div>
              <div style={styles.quickActionContent}>
                <h3 style={styles.quickActionTitle}>Cập nhật thông tin</h3>
                <p style={styles.quickActionDesc}>Chỉnh sửa thông tin cá nhân</p>
              </div>
              <ChevronRight size={20} style={styles.quickActionArrow} />
            </div>

            {/* Nút 3: Quản lý bệnh lý */}
            <div
              style={styles.quickActionCard}
              onClick={() => handleNavigate("/patient/profile")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ef4444"
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <div style={{ ...styles.quickActionIcon, background: "linear-gradient(135deg, #fef2f2, #fecaca)" }}>
                <Heart size={24} color="#ef4444" />
              </div>
              <div style={styles.quickActionContent}>
                <h3 style={styles.quickActionTitle}>Quản lý tiền sử bệnh</h3>
                <p style={styles.quickActionDesc}>Thêm hoặc cập nhật tiền sử bệnh lý</p>
              </div>
              <ChevronRight size={20} style={styles.quickActionArrow} />
            </div>
          </div>
        </div>

        {/* Health Tips */}
        <div style={styles.healthTipsSection}>
          <div style={styles.healthTipsHeader}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertCircle size={22} color="white" />
            </div>
            <h3 style={styles.healthTipsTitle}>Lời khuyên sức khỏe hôm nay</h3>
          </div>

          <div className="tips-grid" style={styles.healthTipsGrid}>
            <div style={styles.tipCard}>
              <div style={{ ...styles.tipIcon, background: "linear-gradient(135deg, #dbeafe, #bfdbfe)" }}>
                <Droplets size={24} color="#3b82f6" />
              </div>
              <p style={styles.tipText}>Uống đủ 2 lít nước mỗi ngày</p>
            </div>

            <div style={styles.tipCard}>
              <div style={{ ...styles.tipIcon, background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
                <Dumbbell size={24} color="#f59e0b" />
              </div>
              <p style={styles.tipText}>Tập thể dục 30 phút mỗi ngày</p>
            </div>

            <div style={styles.tipCard}>
              <div style={{ ...styles.tipIcon, background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)" }}>
                <Moon size={24} color="#6366f1" />
              </div>
              <p style={styles.tipText}>Ngủ đủ 7-8 tiếng mỗi đêm</p>
            </div>

            <div style={styles.tipCard}>
              <div style={{ ...styles.tipIcon, background: "linear-gradient(135deg, #dcfce7, #bbf7d0)" }}>
                <Apple size={24} color="#22c55e" />
              </div>
              <p style={styles.tipText}>Ăn nhiều rau xanh và trái cây</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}