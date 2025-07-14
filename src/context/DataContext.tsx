import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Doctor, Test, Invoice, Report, StockItem, Expense, AuditLog, Dashboard } from '../types';

interface DataContextType {
  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'visitCount' | 'totalBilled' | 'pendingDues'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Doctors
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id' | 'createdAt' | 'totalReferrals' | 'totalRevenue'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  
  // Tests
  tests: Test[];
  addTest: (test: Omit<Test, 'id' | 'createdAt'>) => void;
  updateTest: (id: string, test: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  
  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  // Reports
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  
  // Stock
  stock: StockItem[];
  addStockItem: (item: Omit<StockItem, 'id' | 'createdAt'>) => void;
  updateStockItem: (id: string, item: Partial<StockItem>) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  
  // Dashboard
  dashboard: Dashboard;
  refreshDashboard: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Demo data
const DEMO_PATIENTS: Patient[] = [
  {
    id: '1',
    patientId: 'P001',
    name: 'John Doe',
    age: 45,
    gender: 'male',
    contact: '0300-1234567',
    email: 'john@email.com',
    address: '123 Main St, City',
    cnic: '12345-6789012-3',
    bloodGroup: 'O+',
    createdAt: new Date(),
    createdBy: '1',
    visitCount: 3,
    totalBilled: 15000,
    pendingDues: 2000
  },
  {
    id: '2',
    patientId: 'P002',
    name: 'Jane Smith',
    age: 32,
    gender: 'female',
    contact: '0300-2345678',
    address: '456 Oak Ave, City',
    createdAt: new Date(),
    createdBy: '2',
    visitCount: 1,
    totalBilled: 5000,
    pendingDues: 0
  }
];

const DEMO_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Ahmad Ali',
    specialty: 'Internal Medicine',
    contact: '0300-3456789',
    email: 'dr.ahmad@hospital.com',
    hospital: 'City General Hospital',
    commissionPercent: 10,
    isActive: true,
    createdAt: new Date(),
    totalReferrals: 25,
    totalRevenue: 50000
  },
  {
    id: '2',
    name: 'Dr. Sarah Khan',
    specialty: 'Cardiology',
    contact: '0300-4567890',
    hospital: 'Heart Care Center',
    commissionPercent: 15,
    isActive: true,
    createdAt: new Date(),
    totalReferrals: 18,
    totalRevenue: 75000
  }
];

const DEMO_TESTS: Test[] = [
  {
    id: '1',
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    price: 800,
    sampleType: 'Blood',
    referenceRange: 'Various',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Lipid Profile',
    category: 'Biochemistry',
    price: 1200,
    sampleType: 'Blood',
    referenceRange: 'Cholesterol: <200 mg/dL',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Liver Function Tests',
    category: 'Biochemistry',
    price: 1500,
    sampleType: 'Blood',
    referenceRange: 'ALT: 7-56 U/L',
    isActive: true,
    createdAt: new Date()
  }
];

const DEMO_STOCK: StockItem[] = [
  {
    id: '1',
    name: 'CBC Reagent Kit',
    category: 'Reagents',
    currentStock: 5,
    reorderLevel: 10,
    unit: 'Kit',
    costPerUnit: 2500,
    vendor: 'Medical Supplies Co.',
    expiryDate: new Date('2025-06-30'),
    batchNumber: 'CBC001',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Sample Tubes',
    category: 'Consumables',
    currentStock: 150,
    reorderLevel: 50,
    unit: 'Piece',
    costPerUnit: 15,
    isActive: true,
    createdAt: new Date()
  }
];

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(DEMO_PATIENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(DEMO_DOCTORS);
  const [tests, setTests] = useState<Test[]>(DEMO_TESTS);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stock, setStock] = useState<StockItem[]>(DEMO_STOCK);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard>({
    totalPatients: 0,
    todayPatients: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingReports: 0,
    lowStockItems: 0,
    recentActivities: []
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Patient methods
  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'visitCount' | 'totalBilled' | 'pendingDues'>) => {
    const newPatient: Patient = {
      ...patient,
      id: generateId(),
      createdAt: new Date(),
      visitCount: 0,
      totalBilled: 0,
      pendingDues: 0
    };
    setPatients(prev => [...prev, newPatient]);
    addAuditLog({
      userId: patient.createdBy,
      action: 'CREATE',
      module: 'PATIENTS',
      details: `Created patient: ${patient.name}`
    });
  };

  const updatePatient = (id: string, patient: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...patient } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  // Doctor methods
  const addDoctor = (doctor: Omit<Doctor, 'id' | 'createdAt' | 'totalReferrals' | 'totalRevenue'>) => {
    const newDoctor: Doctor = {
      ...doctor,
      id: generateId(),
      createdAt: new Date(),
      totalReferrals: 0,
      totalRevenue: 0
    };
    setDoctors(prev => [...prev, newDoctor]);
  };

  const updateDoctor = (id: string, doctor: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...doctor } : d));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  // Test methods
  const addTest = (test: Omit<Test, 'id' | 'createdAt'>) => {
    const newTest: Test = {
      ...test,
      id: generateId(),
      createdAt: new Date()
    };
    setTests(prev => [...prev, newTest]);
  };

  const updateTest = (id: string, test: Partial<Test>) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...test } : t));
  };

  const deleteTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  // Invoice methods
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: generateId(),
      createdAt: new Date()
    };
    setInvoices(prev => [...prev, newInvoice]);
  };

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...invoice } : i));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  // Report methods
  const addReport = (report: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...report,
      id: generateId(),
      createdAt: new Date()
    };
    setReports(prev => [...prev, newReport]);
  };

  const updateReport = (id: string, report: Partial<Report>) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...report } : r));
  };

  // Stock methods
  const addStockItem = (item: Omit<StockItem, 'id' | 'createdAt'>) => {
    const newItem: StockItem = {
      ...item,
      id: generateId(),
      createdAt: new Date()
    };
    setStock(prev => [...prev, newItem]);
  };

  const updateStockItem = (id: string, item: Partial<StockItem>) => {
    setStock(prev => prev.map(s => s.id === id ? { ...s, ...item } : s));
  };

  // Expense methods
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...expense } : e));
  };

  // Audit log methods
  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: generateId(),
      timestamp: new Date()
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  // Dashboard methods
  const refreshDashboard = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayPatients = patients.filter(p => p.createdAt >= today).length;
    const todayRevenue = invoices
      .filter(i => i.createdAt >= today)
      .reduce((sum, inv) => sum + inv.finalAmount, 0);
    
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const lowStockItems = stock.filter(s => s.currentStock <= s.reorderLevel).length;
    
    setDashboard({
      totalPatients: patients.length,
      todayPatients,
      totalRevenue: invoices.reduce((sum, inv) => sum + inv.finalAmount, 0),
      todayRevenue,
      pendingReports,
      lowStockItems,
      recentActivities: auditLogs.slice(-10)
    });
  };

  return (
    <DataContext.Provider value={{
      patients, addPatient, updatePatient, deletePatient,
      doctors, addDoctor, updateDoctor, deleteDoctor,
      tests, addTest, updateTest, deleteTest,
      invoices, addInvoice, updateInvoice, deleteInvoice,
      reports, addReport, updateReport,
      stock, addStockItem, updateStockItem,
      expenses, addExpense, updateExpense,
      auditLogs, addAuditLog,
      dashboard, refreshDashboard
    }}>
      {children}
    </DataContext.Provider>
  );
};