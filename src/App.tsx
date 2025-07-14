import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import PatientManagement from './components/Patients/PatientManagement';
import DoctorManagement from './components/Doctors/DoctorManagement';
import TestManagement from './components/Tests/TestManagement';
import InvoiceManagement from './components/Invoices/InvoiceManagement';
import ReportManagement from './components/Reports/ReportManagement';
import StockManagement from './components/Stock/StockManagement';
import ExpenseManagement from './components/Expenses/ExpenseManagement';
import Analytics from './components/Analytics/Analytics';
import StaffManagement from './components/Staff/StaffManagement';
import AuditLogs from './components/Audit/AuditLogs';
import Settings from './components/Settings/Settings';
import TemplateManagement from './components/Templates/TemplateManagement';
import AppointmentManagement from './components/Appointments/AppointmentManagement';
import QualityControl from './components/QualityControl/QualityControl';
import BackupManagement from './components/Backup/BackupManagement';
import FileManager from './components/FileManager/FileManager';
import NotificationCenter from './components/Notifications/NotificationCenter';
import RateListManagement from './components/RateList/RateListManagement';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'tests':
        return <TestManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'reports':
        return <ReportManagement />;
      case 'stock':
        return <StockManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'analytics':
        return <Analytics />;
      case 'staff':
        return <StaffManagement />;
      case 'audit':
        return <AuditLogs />;
      case 'settings':
        return <Settings />;
      case 'templates':
        return <TemplateManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'quality':
        return <QualityControl />;
      case 'backup':
        return <BackupManagement />;
      case 'files':
        return <FileManager />;
      case 'notifications':
        return <NotificationCenter />;
      case 'rates':
        return <RateListManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;