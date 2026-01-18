// src/services/api.ts
// Unified API client for frontend — switch between backend and localStorage fallback via VITE_API_URL

const API_BASE = ((import.meta as any)?.env?.VITE_API_URL) || "";
const useBackend = Boolean(API_BASE && API_BASE.length > 0);

const localKeys = {
  users: "users",
  medicalRecords: "medicalRecords",
  appointments: "appointments",
  treatmentPlans: "treatmentPlans",
  authToken: "authToken",
};

function lsGet(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("lsGet", key, e);
    return [];
  }
}
function lsSet(key: string, val: any) {
  localStorage.setItem(key, JSON.stringify(val));
}

async function fetchJson(path: string, opts: any = {}) {
  const url = API_BASE + path;
  const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
  const res = await fetch(url, Object.assign({}, opts, { headers }));
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`${res.status} ${res.statusText} ${text}`);
    throw err;
  }
  return res.json().catch(() => ({}));
}

// Seed defaults used only in fallback mode
function ensureDefaultUsers() {
  const users = lsGet(localKeys.users);
  if (!users || users.length === 0) {
    const defaultUsers = [
      {
        id: "admin1",
        username: "admin",
        password: "admin123",
        role: "admin",
        profile: { name: "Quản trị viên", email: "admin@hospital.vn" },
      },
      {
        id: "doctor1",
        username: "bacsi",
        password: "doctor123",
        role: "doctor",
        profile: { name: "BS. Nguyễn Văn A", email: "nguyenvana@hospital.vn", specialization: "Tim mạch" },
      },
      {
        id: "patient1",
        username: "benhnhan",
        password: "patient123",
        role: "patient",
        profile: { name: "Trần Thị B", email: "tranthib@email.com" },
      },
    ];
    lsSet(localKeys.users, defaultUsers);
    return defaultUsers;
  }
  return users;
}

const api = {
  // auth
  login: async (username: string, password: string) => {
    if (useBackend) {
      return fetchJson(`/auth/login`, { method: "POST", body: JSON.stringify({ username, password }) });
    }

    const users = ensureDefaultUsers();
    const user = users.find((u: any) => u.username === username && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    const token = btoa(`${username}:${Date.now()}`);
    localStorage.setItem(localKeys.authToken, token);
    return { token, user };
  },

  // users
  getUsers: async () => {
    if (useBackend) return fetchJson(`/users`);
    return lsGet(localKeys.users);
  },
  createUser: async (u: any) => {
    if (useBackend) return fetchJson(`/users`, { method: "POST", body: JSON.stringify(u) });
    const arr = lsGet(localKeys.users) || [];
    const newU = { id: Date.now().toString(), ...u };
    arr.push(newU);
    lsSet(localKeys.users, arr);
    return newU;
  },

  // medical records
  getMedicalRecords: async () => {
    if (useBackend) return fetchJson(`/medical-records`);
    return lsGet(localKeys.medicalRecords);
  },
  createMedicalRecord: async (r: any) => {
    if (useBackend) return fetchJson(`/medical-records`, { method: "POST", body: JSON.stringify(r) });
    const arr = lsGet(localKeys.medicalRecords) || [];
    const newR = { id: Date.now().toString(), ...r };
    arr.push(newR);
    lsSet(localKeys.medicalRecords, arr);
    return newR;
  },

  // appointments
  getAppointments: async () => {
    if (useBackend) return fetchJson(`/appointments`);
    return lsGet(localKeys.appointments);
  },
  createAppointment: async (a: any) => {
    if (useBackend) return fetchJson(`/appointments`, { method: "POST", body: JSON.stringify(a) });
    const arr = lsGet(localKeys.appointments) || [];
    const newA = { id: Date.now().toString(), ...a };
    arr.push(newA);
    lsSet(localKeys.appointments, arr);
    return newA;
  },

  // treatment plans
  getTreatmentPlans: async () => {
    if (useBackend) return fetchJson(`/treatment-plans`);
    return lsGet(localKeys.treatmentPlans);
  },
  createTreatmentPlan: async (p: any) => {
    if (useBackend) return fetchJson(`/treatment-plans`, { method: "POST", body: JSON.stringify(p) });
    const arr = lsGet(localKeys.treatmentPlans) || [];
    const newP = { id: Date.now().toString(), ...p };
    arr.push(newP);
    lsSet(localKeys.treatmentPlans, arr);
    return newP;
  },

  // helper
  isUsingBackend: () => useBackend,
};

export default api;
