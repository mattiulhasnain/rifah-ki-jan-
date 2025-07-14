import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  Database, 
  Palette, 
  Bell, 
  Shield, 
  HardDrive,
  Download,
  Upload,
  Save,
  TestTube,
  Phone,
  MapPin,
  Mail,
  Globe,
  DollarSign,
  Clock,
  Monitor,
  Sun,
  Moon,
  Smartphone
} from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      labName: 'Rifah Laboratories',
      address: '170- Hali Road Tehseel Chowk Sahiwal',
      phone: '0404-220285',
      whatsapp: '0320-3655101',
      email: 'info@rifahlabs.com',
      website: 'www.rifahlabs.com',
      timezone: 'Asia/Karachi',
      currency: 'PKR',
      language: 'English'
    },
    database: {
      host: 'localhost',
      port: '5432',
      database: 'rifah_lab',
      username: 'postgres',
      poolSize: 10,
      autoBackup: true,
      backupInterval: 'daily',
      compression: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      lowStockAlerts: true,
      criticalResults: true,
      appointmentReminders: true,
      paymentDue: true
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      twoFactorAuth: false,
      loginAttempts: 5,
      auditLogging: true,
      dataEncryption: true
    },
    appearance: {
      theme: theme,
      primaryColor: '#3b82f6',
      fontSize: 'medium',
      compactMode: false,
      animations: true
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'backup', label: 'Backup', icon: HardDrive }
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    handleSettingChange('appearance', 'theme', newTheme);
  };

  const testDatabaseConnection = () => {
    // Simulate database connection test
    alert('Database connection test successful!');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lab-settings.json';
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          alert('Settings imported successfully!');
        } catch (error) {
          alert('Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const saveSettings = () => {
    // Save settings to localStorage or send to backend
    localStorage.setItem('labSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <TestTube className="w-4 h-4 inline mr-2" />
            Laboratory Name
          </label>
          <input
            type="text"
            value={settings.general.labName}
            onChange={(e) => handleSettingChange('general', 'labName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="text"
            value={settings.general.phone}
            onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Address
          </label>
          <textarea
            value={settings.general.address}
            onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Smartphone className="w-4 h-4 inline mr-2" />
            WhatsApp Number
          </label>
          <input
            type="text"
            value={settings.general.whatsapp}
            onChange={(e) => handleSettingChange('general', 'whatsapp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            value={settings.general.email}
            onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Website
          </label>
          <input
            type="text"
            value={settings.general.website}
            onChange={(e) => handleSettingChange('general', 'website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="Asia/Karachi">Asia/Karachi</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="PKR">PKR - Pakistani Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database Host
          </label>
          <input
            type="text"
            value={settings.database.host}
            onChange={(e) => handleSettingChange('database', 'host', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Port
          </label>
          <input
            type="text"
            value={settings.database.port}
            onChange={(e) => handleSettingChange('database', 'port', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Database Name
          </label>
          <input
            type="text"
            value={settings.database.database}
            onChange={(e) => handleSettingChange('database', 'database', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Connection Pool Size
          </label>
          <input
            type="number"
            value={settings.database.poolSize}
            onChange={(e) => handleSettingChange('database', 'poolSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoBackup"
            checked={settings.database.autoBackup}
            onChange={(e) => handleSettingChange('database', 'autoBackup', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="autoBackup" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Auto Backup
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="compression"
            checked={settings.database.compression}
            onChange={(e) => handleSettingChange('database', 'compression', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="compression" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Compression
          </label>
        </div>
      </div>

      <button
        onClick={testDatabaseConnection}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Test Connection
      </button>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              theme === 'light' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <Sun className="w-6 h-6" />
            <span className="text-sm">Light</span>
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              theme === 'dark' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <Moon className="w-6 h-6" />
            <span className="text-sm">Dark</span>
          </button>
          <button
            onClick={() => handleThemeChange('auto')}
            className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              theme === 'auto' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <Monitor className="w-6 h-6" />
            <span className="text-sm">Auto</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Primary Color
        </label>
        <input
          type="color"
          value={settings.appearance.primaryColor}
          onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
          className="w-20 h-10 border border-gray-300 dark:border-gray-600 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Font Size
        </label>
        <select
          value={settings.appearance.fontSize}
          onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="compactMode"
            checked={settings.appearance.compactMode}
            onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="compactMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Compact Mode
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="animations"
            checked={settings.appearance.animations}
            onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="animations" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Animations
          </label>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Backup & Restore Settings
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          Export your current settings or import settings from a backup file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={exportSettings}
          className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export Settings</span>
        </button>

        <label className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>Import Settings</span>
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'database':
        return renderDatabaseSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return <div>Settings content for {activeTab}</div>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your laboratory management system settings
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={saveSettings}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;