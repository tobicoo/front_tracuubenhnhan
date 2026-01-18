"use client"

import { useState } from "react"
import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom"
import { Activity, UserIcon, FileText, LogOut, LayoutDashboard, ChevronRight, Sparkles } from "lucide-react"
import type { User } from "../App"

// Import các component con
import PatientDashboardHome from "./patient/PatientDashboardHome"
import PatientProfile from "./patient/PatientProfile"
import PatientRecords from "./patient/PatientRecords"

interface PatientDashboardProps {
  user: User
  onLogout: () => void
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    height: "72px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoIcon: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    padding: "10px",
    borderRadius: "14px",
    color: "white",
    display: "flex",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: 700,
    color: "white",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    width: "280px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column" as const,
    height: "calc(100vh - 72px)",
    position: "sticky" as const,
    top: "72px",
    overflowY: "auto" as const,
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.03)",
  },
  menu: {
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  menuLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    marginBottom: "12px",
    paddingLeft: "16px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    borderRadius: "16px",
    textDecoration: "none",
    color: "#64748b",
    fontWeight: 500,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontSize: "15px",
    position: "relative" as const,
  },
  menuItemHover: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    transform: "translateX(4px)",
  },
  menuItemActive: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  menuIconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
  },
  menuIconDefault: {
    backgroundColor: "#f1f5f9",
  },
  menuIconActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
    fontSize: "16px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  userText: {
    textAlign: "right" as const,
  },
  userName: {
    fontSize: "15px",
    fontWeight: 600,
    color: "white",
    margin: 0,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  userRole: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.8)",
    margin: 0,
  },
  divider: {
    width: "1px",
    height: "36px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    margin: "0 8px",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    color: "white",
    cursor: "pointer",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: 500,
    fontSize: "14px",
    transition: "all 0.3s",
  },
  mainContent: {
    flex: 1,
    padding: "32px",
    overflowY: "auto" as const,
    height: "calc(100vh - 72px)",
    background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
  },
  contentWrapper: {
    maxWidth: "1280px",
    margin: "0 auto",
  },
  sidebarFooter: {
    marginTop: "auto",
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  footerCard: {
    background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
    borderRadius: "16px",
    padding: "16px",
    textAlign: "center" as const,
  },
  footerIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
    color: "white",
  },
  footerText: {
    fontSize: "12px",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.5,
  },
  footerBrand: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#667eea",
    margin: "8px 0 0",
  },
}

export default function PatientDashboard({ user, onLogout }: PatientDashboardProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleLogout = () => {
    onLogout()
    navigate("/")
  }

  const isActive = (path: string) => {
    if (path === "/patient" && location.pathname === "/patient") return true
    return location.pathname === path
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const menuItems = [
    { path: "/patient", icon: LayoutDashboard, label: "Tổng quan", color: "#667eea" },
    { path: "/patient/profile", icon: UserIcon, label: "Thông tin cá nhân", color: "#f093fb" },
    { path: "/patient/records", icon: FileText, label: "Tra cứu hồ sơ khám", color: "#4facfe" },
  ]

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <Activity size={26} strokeWidth={2.5} />
          </div>
          <span style={styles.logoText}>HealthCare System</span>
        </div>

        <div style={styles.userInfo}>
          <div style={styles.userText}>
            <p style={styles.userName}>{user.profile.name}</p>
            <p style={styles.userRole}>Mã BN: {user.profile.patientId}</p>
          </div>
          <div style={styles.userAvatar}>{getInitials(user.profile.name)}</div>
          <div style={styles.divider}></div>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.9)"
              e.currentTarget.style.transform = "scale(1.02)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* BODY (SIDEBAR + MAIN) */}
      <div style={styles.body}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <nav style={styles.menu}>
            <div style={styles.menuLabel}>Menu chính</div>

            {menuItems.map((item) => {
              const active = isActive(item.path)
              const hovered = hoveredItem === item.path
              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.menuItem,
                    ...(active ? styles.menuItemActive : {}),
                    ...(hovered && !active ? styles.menuItemHover : {}),
                  }}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    style={{
                      ...styles.menuIconWrapper,
                      ...(active ? styles.menuIconActive : styles.menuIconDefault),
                      backgroundColor: active ? "rgba(255, 255, 255, 0.2)" : hovered ? `${item.color}15` : "#f1f5f9",
                    }}
                  >
                    <Icon size={20} style={{ color: active ? "white" : item.color }} />
                  </div>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {active && <ChevronRight size={18} style={{ opacity: 0.7 }} />}
                </Link>
              )
            })}
          </nav>

          <div style={styles.sidebarFooter}>
            <div style={styles.footerCard}>
              <div style={styles.footerIcon}>
                <Sparkles size={20} />
              </div>
              <p style={styles.footerText}>Chăm sóc sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi</p>
              <p style={styles.footerBrand}>HealthCare 2024</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={styles.mainContent}>
          <div style={styles.contentWrapper}>
            <Routes>
              <Route path="/" element={<PatientDashboardHome userId={user.id} userName={user.profile.name} />} />
              <Route path="/profile" element={<PatientProfile user={user} />} />
              <Route path="/records" element={<PatientRecords userId={user.id} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
