// Simple data service to centralize storage access and allow swapping to backend later.
// All functions return Promises to match future async APIs.

export async function getUsers(): Promise<any[]> {
  try {
    const data = localStorage.getItem('users')
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('getUsers error', e)
    return []
  }
}

export async function saveUsers(users: any[]): Promise<void> {
  localStorage.setItem('users', JSON.stringify(users))
}

export async function getMedicalRecords(): Promise<any[]> {
  try {
    const data = localStorage.getItem('medicalRecords')
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('getMedicalRecords error', e)
    return []
  }
}

export async function saveMedicalRecords(records: any[]): Promise<void> {
  localStorage.setItem('medicalRecords', JSON.stringify(records))
}

export async function getAppointments(): Promise<any[]> {
  try {
    const data = localStorage.getItem('appointments')
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('getAppointments error', e)
    return []
  }
}

export async function saveAppointments(items: any[]): Promise<void> {
  localStorage.setItem('appointments', JSON.stringify(items))
}

export async function getTreatmentPlans(): Promise<any[]> {
  try {
    const data = localStorage.getItem('treatmentPlans')
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error('getTreatmentPlans error', e)
    return []
  }
}

export async function saveTreatmentPlans(items: any[]): Promise<void> {
  localStorage.setItem('treatmentPlans', JSON.stringify(items))
}

// Add more wrappers as needed for other entity types.
