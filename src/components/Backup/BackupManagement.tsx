import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Download, Upload, RefreshCw, Database, Calendar,
  CheckCircle, AlertTriangle, Clock, HardDrive
} from 'lucide-react';

interface BackupRecord {
  id: string;
  filename: string;
  size: string;
  createdAt: Date;
  type: 'manual' | 'automatic';
  status: 'completed' | 'failed' | 'in_progress';
  description?: string;
}

const BackupManagement: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [backups, setBackups] = useState<BackupRecord[]>([
    {
      id: '1',
      filename: 'lab_backup_2024_01_15.sql',
      size: '45.2 MB',
      createdAt: new Date('2024-01-15T10:30:00'),
      type: 'automatic',
      status: 'completed',
      description: 'Daily automatic backup'
    },
    {
      id: '2',
      filename: 'lab_backup_manual_2024_01_10.sql',
      size: '42.8 MB',
      createdAt: new Date('2024-01-10T14:20:00'),
      type: 'manual',
      status: 'completed',
      description: 'Manual backup before system update'
    }
  ]);

  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const createBackup = async () => {
    if (!hasPermission('backup', 'create')) {
      alert('You do not have permission to create backups.');
      return;
    }

    setIsCreatingBackup(true);
    
    // Simulate backup creation
    setTimeout(() => {
      const newBackup: BackupRecord = {
        id: Math.random().toString(36).substr(2, 9),
        filename: `lab_backup_manual_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}.sql`,
        size: '47.1 MB',
        createdAt: new Date(),
        type: 'manual',
        status: 'completed',
        description: 'Manual backup created by user'
      };
      
      setBackups(prev => [newBackup, ...prev]);
      setIsCreatingBackup(false);
      alert('Backup created successfully!');
    }, 3000);
  };

  const downloadBackup = (backup: BackupRecord) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = backup.filename;
    link.click();
    alert(`Downloading ${backup.filename}`);
  };

  const restoreBackup = async () => {
    if (!hasPermission('backup', 'restore')) {
      alert('You do not have permission to restore backups.');
      return;
    }

    if (!selectedFile) {
      alert('Please select a backup file to restore.');
      return;
    }

    if (!window.confirm('Are you sure you want to restore from this backup? This will overwrite all current data.')) {
      return;
    }

    setIsRestoring(true);
    
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(false);
      setSelectedFile(null);
      alert('Backup restored successfully!');
    }, 5000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'automatic' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup Management</h1>
          <p className="text-gray-600">Create, manage, and restore database backups</p>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Backup */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Create Backup</h3>
              <p className="text-sm text-gray-600">Generate a new database backup</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Backup Information</span>
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Complete database structure and data</p>
                <p>• All patient records and reports</p>
                <p>• System configuration and settings</p>
                <p>• User accounts and permissions</p>
              </div>
            </div>
            
            <button
              onClick={createBackup}
              disabled={isCreatingBackup || !hasPermission('backup', 'create')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isCreatingBackup ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Backup...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Create Backup Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Restore Backup */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Restore Backup</h3>
              <p className="text-sm text-gray-600">Restore database from backup file</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">Warning</span>
              </div>
              <p className="text-sm text-red-700">
                Restoring a backup will overwrite all current data. This action cannot be undone.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Backup File
              </label>
              <input
                type="file"
                accept=".sql,.db,.backup"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={restoreBackup}
              disabled={isRestoring || !selectedFile || !hasPermission('backup', 'restore')}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Restoring...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Restore Backup</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Backup History</h3>
          <p className="text-sm text-gray-600">View and manage existing backups</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Filename</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <HardDrive className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{backup.filename}</p>
                        {backup.description && (
                          <p className="text-sm text-gray-500">{backup.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-900">{backup.size}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${getTypeColor(backup.type)}`}>
                      {backup.type.charAt(0).toUpperCase() + backup.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(backup.status)}
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(backup.status)}`}>
                        {backup.status.charAt(0).toUpperCase() + backup.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{backup.createdAt.toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{backup.createdAt.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {backup.status === 'completed' && (
                        <button
                          onClick={() => downloadBackup(backup)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {backups.length === 0 && (
          <div className="text-center py-8">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No backup records found</p>
          </div>
        )}
      </div>

      {/* Backup Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Automatic Backup Schedule</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-green-900">Daily Backup</h4>
            <p className="text-sm text-green-700">Every day at 2:00 AM</p>
            <p className="text-xs text-green-600 mt-1">Next: Tomorrow 2:00 AM</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-blue-900">Weekly Backup</h4>
            <p className="text-sm text-blue-700">Every Sunday at 1:00 AM</p>
            <p className="text-xs text-blue-600 mt-1">Next: Sunday 1:00 AM</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <HardDrive className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-purple-900">Monthly Backup</h4>
            <p className="text-sm text-purple-700">1st of every month</p>
            <p className="text-xs text-purple-600 mt-1">Next: 1st Feb 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManagement;