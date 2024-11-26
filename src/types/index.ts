export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'director' | 'profesor';
  avatar?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  resources: string[];
  attachments: ProjectAttachment[];
  status: 'borrador' | 'revision' | 'aprobado' | 'rechazado';
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: string;
};

export type ProjectAttachment = {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  createdAt: Date;
};

export type Period = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  submissionDeadline: Date;
  reportDeadlines: ReportDeadline[];
  isActive: boolean;
};

export type ReportDeadline = {
  id: string;
  periodId: string;
  type: 'trimestral' | 'final';
  deadline: Date;
};

export type Report = {
  id: string;
  projectId: string;
  type: 'trimestral' | 'final';
  content: string;
  attachments: ReportAttachment[];
  status: 'pendiente' | 'entregado' | 'revisado';
  submittedAt?: Date;
  createdAt: Date;
};

export type ReportAttachment = {
  id: string;
  reportId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  createdAt: Date;
};

export type SiteSettings = {
  logo: string;
  favicon: string;
  institutionName: string;
  primaryColor: string;
  secondaryColor: string;
};