export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export type UserRole = 'admin' | 'receptionist' | 'technician' | 'pathologist' | 'accountant' | 'manager' | 'lab_helper';

export interface Permission {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'export' | 'import' | 'lock' | 'unlock' | 'verify')[];
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contact: string;
  email?: string;
  address: string;
  cnic?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
  createdAt: Date;
  createdBy: string;
  visitCount: number;
  totalBilled: number;
  pendingDues: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  contact: string;
  email?: string;
  hospital?: string;
  commissionPercent: number;
  cnic?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  totalReferrals: number;
  totalRevenue: number;
}

export interface Test {
  id: string;
  name: string;
  category: string;
  price: number;
  sampleType: string;
  referenceRange?: string;
  unit?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface TestProfile {
  id: string;
  name: string;
  tests: string[];
  price: number;
  description?: string;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  doctorId: string;
  tests: InvoiceTest[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: 'draft' | 'finalized' | 'paid' | 'cancelled';
  createdAt: Date;
  createdBy: string;
  notes?: string;
  paymentMethod?: string;
  isLocked: boolean;
}

export interface InvoiceTest {
  testId: string;
  testName: string;
  price: number;
  quantity: number;
}

export interface Report {
  id: string;
  invoiceId: string;
  patientId: string;
  doctorId: string;
  tests: ReportTest[];
  status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'locked';
  createdAt: Date;
  createdBy: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  templateId?: string;
  interpretation?: string;
  criticalValues: boolean;
}

export interface ReportTest {
  testId: string;
  testName: string;
  result: string;
  normalRange: string;
  isAbnormal: boolean;
  unit?: string;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  costPerUnit: number;
  vendor?: string;
  expiryDate?: Date;
  batchNumber?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  createdAt: Date;
  createdBy: string;
  notes?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  date: Date;
  createdBy: string;
  attachments?: string[];
  isRecurring: boolean;
  tags?: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface Dashboard {
  totalPatients: number;
  todayPatients: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingReports: number;
  lowStockItems: number;
  recentActivities: AuditLog[];
}

// New interfaces for additional features
export interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  isLocked: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  contact: string;
  testIds: string[];
  testNames: string[];
  appointmentDate: Date;
  timeSlot: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  createdBy: string;
  createdAt: Date;
  reminderSent: boolean;
}

export interface QCRecord {
  id: string;
  testId: string;
  testName: string;
  controlLevel: 'Level 1' | 'Level 2' | 'Level 3';
  expectedValue: number;
  actualValue: number;
  unit: string;
  tolerance: number;
  isWithinRange: boolean;
  performedBy: string;
  performedAt: Date;
  instrumentId?: string;
  batchNumber?: string;
  notes?: string;
}

export interface CalibrationRecord {
  id: string;
  instrumentId: string;
  instrumentName: string;
  calibrationDate: Date;
  nextCalibrationDate: Date;
  performedBy: string;
  certificateNumber?: string;
  status: 'valid' | 'expired' | 'due_soon';
  notes?: string;
}

export interface BackupRecord {
  id: string;
  filename: string;
  size: string;
  createdAt: Date;
  type: 'manual' | 'automatic';
  status: 'completed' | 'failed' | 'in_progress';
  description?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  mimeType?: string;
  uploadedBy: string;
  uploadedAt: Date;
  patientId?: string;
  parentId?: string;
  path: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'payment' | 'stock' | 'report' | 'appointment';
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface RateList {
  id: string;
  name: string;
  description?: string;
  effectiveDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  rates: TestRate[];
}

export interface TestRate {
  testId: string;
  testName: string;
  price: number;
  category: string;
}