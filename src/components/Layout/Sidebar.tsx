import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Users, UserCheck, Stethoscope, TestTube, 
  FileText, Receipt, Package, DollarSign, 
  BarChart3, Shield, Settings, LogOut,
  Activity, Calendar, Database, Users2,
  Bell, FolderOpen, Target, HardDrive,
  Clipboard, DollarSign as RateIcon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: 'dashboard' },
    { id: 'patients', label: 'Patients', icon: Users, permission: 'patients' },
    { id: 'doctors', label: 'Doctors', icon: UserCheck, permission: 'doctors' },
    { id: 'tests', label: 'Tests', icon: TestTube, permission: 'tests' },
    { id: 'rates', label: 'Rate Lists', icon: RateIcon, permission: 'rates' },
    { id: 'invoices', label: 'Invoices', icon: Receipt, permission: 'invoices' },
    { id: 'reports', label: 'Reports', icon: FileText, permission: 'reports' },
    { id: 'templates', label: 'Templates', icon: Clipboard, permission: 'templates' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, permission: 'appointments' },
    { id: 'stock', label: 'Stock', icon: Package, permission: 'stock' },
    { id: 'expenses', label: 'Expenses', icon: DollarSign, permission: 'expenses' },
    { id: 'quality', label: 'Quality Control', icon: Target, permission: 'quality' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'analytics' },
    { id: 'files', label: 'File Manager', icon: FolderOpen, permission: 'files' },
    { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'notifications' },
    { id: 'staff', label: 'Staff', icon: Users2, permission: 'staff' },
    { id: 'backup', label: 'Backup', icon: HardDrive, permission: 'backup' },
    { id: 'audit', label: 'Audit Logs', icon: Activity, permission: 'audit' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'settings' }
  ];

  const visibleItems = menuItems.filter(item => 
    hasPermission(item.permission, 'view') || user?.role === 'admin'
  );

  return (
    <div className="w-64 bg-white shadow-lg h-full border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">LabManager</h1>
            <p className="text-sm text-gray-500">Ultimate Edition</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;