export interface Patient {
  id: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  cccd: string;
  diagnosis: string;
  doctor: string;
}

export const mockPatients: Patient[] = [
  {
    id: "BN001",
    fullName: "Nguyễn Văn An",
    gender: "Nam",
    dateOfBirth: "1998-05-12",
    phone: "0987123456",
    cccd: "012345678901",
    diagnosis: "Viêm dạ dày",
    doctor: "BS. Trần Minh Đức"
  }
];
