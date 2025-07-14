import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, Filter, Download, Calendar, User,
  Activity, Shield, Eye, AlertTriangle, CheckCircle
} from 'lucide-react';
import { AuditLog } from '../../types';

const AuditLogs: React.FC = () => {
  const { auditLogs } = useData();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Demo audit logs (in real app, this would come from context/API)
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      userId: '1',
      action: 'CREATE',
      module: 'PATIENTS',
      details: 'Created new patient: John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '2',
      userId: '2',
      action: 'UPDATE',
      module: 'INVOICES',
      details: 'Updated invoice INV001 - Changed amount from PKR 5000 to PKR 4500',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      userId: '3',
      action: 'VIEW',
      module: 'REPORTS',
      details: 'Viewed patient report for John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      userId: '1',
      action: 'DELETE',
      module: 'TESTS',
      details: 'Deleted test: Obsolete Blood Test',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      ipAddress: '192.168.1.100'
    },
    {
      id: '5',
      userId: '2',
      action: 'LOGIN',
      module: 'AUTH',
      details: 'User logged in successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      ipAddress: '192.168.1.101'
    },
    {
      id: '6',
      userId: '4',
      action: 'VERIFY',
      module: 'REPORTS',
      details: 'Verified lab report for patient Jane Smith',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      ipAddress: '192.168.1.103'
    }
  ]);

  const actions = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'VERIFY', 'LOCK', 'UNLOCK'];
  const modules = ['PATIENTS', 'DOCTORS', 'TESTS', 'INVOICES', 'REPORTS', 'STOCK', 'EXPENSES', 'AUTH', 'SETTINGS'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = (
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    
    // Date range filter
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const matchesDate = log.timestamp >= cutoffDate;
    
    return matchesSearch && matchesAction && matchesModule && matchesDate;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'UPDATE': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'DELETE': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'VIEW': return <Eye className="w-4 h-4 text-gray-600" />;
      case 'LOGIN': return <Shield className="w-4 h-4 text-green-600" />;
      case 'LOGOUT': return <Shield className="w-4 h-4 text-gray-600" />;
      case 'VERIFY': return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-blue-100 text-blue-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'VIEW': return 'bg-gray-100 text-gray-800';
      case 'LOGIN': return 'bg-green-100 text-green-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'VERIFY': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserName = (userId: string) => {
    // In real app, this would lookup user by ID
    const userNames: { [key: string]: string } = {
      '1': 'System Administrator',
      '2': 'Reception Staff',
      '3': 'Lab Technician',
      '4': 'Dr. Pathologist'
    };
    return userNames[userId] || 'Unknown User';
  };

  const exportLogs = () => {
    // Export functionality would be implemented here
    console.log('Exporting audit logs...');
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600">Track all system activities and user actions</p>
        </div>
        {hasPermission('audit', 'export') && (
          <button
            onClick={exportLogs}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return log.timestamp >= today;
                }).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(logs.map(log => log.userId)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => ['DELETE', 'VERIFY', 'LOCK'].includes(log.action)).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Actions</option>
            {actions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Modules</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Activity Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="font-medium">{getUserName(selectedLog.userId)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Action</p>
                  <div className="flex items-center space-x-2">
                    {getActionIcon(selectedLog.action)}
                    <span className={`px-2 py-1 rounded-full text-sm ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Module</p>
                  <p className="font-medium">{selectedLog.module}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Timestamp</p>
                  <p className="font-medium">{selectedLog.timestamp.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">IP Address</p>
                  <p className="font-medium">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Session ID</p>
                  <p className="font-medium">{selectedLog.id}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Details</p>
                <p className="bg-gray-50 p-3 rounded-lg">{selectedLog.details}</p>
              </div>
              {selectedLog.userAgent && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">User Agent</p>
                  <p className="bg-gray-50 p-3 rounded-lg text-sm break-all">{selectedLog.userAgent}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Module</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">IP Address</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.timestamp.toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{getUserName(log.userId)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(log.action)}
                      <span className={`px-2 py-1 rounded-full text-sm ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-900 truncate max-w-xs" title={log.details}>
                      {log.details}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-900 font-mono text-sm">
                      {log.ipAddress || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No audit logs found for the selected criteria</p>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;