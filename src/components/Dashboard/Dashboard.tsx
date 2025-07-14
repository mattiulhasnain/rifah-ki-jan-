import React, { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, UserCheck, TestTube, FileText, 
  Receipt, Package, DollarSign, AlertTriangle,
  TrendingUp, Clock, CheckCircle, XCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { dashboard, refreshDashboard, patients, doctors, tests, invoices, reports, stock } = useData();
  const { user } = useAuth();

  useEffect(() => {
    refreshDashboard();
  }, [patients, doctors, tests, invoices, reports, stock]);

  const stats = [
    {
      title: 'Total Patients',
      value: dashboard.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
      trend: `+${dashboard.todayPatients} today`
    },
    {
      title: 'Total Revenue',
      value: `PKR ${dashboard.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: `+PKR ${dashboard.todayRevenue.toLocaleString()} today`
    },
    {
      title: 'Pending Reports',
      value: dashboard.pendingReports,
      icon: FileText,
      color: 'bg-yellow-500',
      trend: 'Need attention'
    },
    {
      title: 'Low Stock Items',
      value: dashboard.lowStockItems,
      icon: Package,
      color: 'bg-red-500',
      trend: 'Reorder required'
    }
  ];

  const quickStats = [
    { title: 'Active Doctors', value: doctors.filter(d => d.isActive).length, icon: UserCheck },
    { title: 'Available Tests', value: tests.filter(t => t.isActive).length, icon: TestTube },
    { title: 'Today\'s Invoices', value: invoices.filter(i => 
      i.createdAt.toDateString() === new Date().toDateString()
    ).length, icon: Receipt },
    { title: 'Completed Reports', value: reports.filter(r => r.status === 'completed').length, icon: CheckCircle }
  ];

  const recentActivities = [
    { action: 'New patient registered', time: '2 minutes ago', type: 'success' },
    { action: 'Report completed for John Doe', time: '15 minutes ago', type: 'info' },
    { action: 'Invoice #INV001 created', time: '1 hour ago', type: 'success' },
    { action: 'Low stock alert: CBC Reagent Kit', time: '2 hours ago', type: 'warning' },
    { action: 'Dr. Ahmad Ali added new test', time: '3 hours ago', type: 'info' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            System Online
          </span>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">Low Stock Alert</p>
                <p className="text-xs text-red-700">CBC Reagent Kit - Only 5 units left</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Pending Verification</p>
                <p className="text-xs text-yellow-700">3 reports waiting for pathologist review</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Performance Update</p>
                <p className="text-xs text-blue-700">Monthly revenue target 80% achieved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600">Monthly Target</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">97%</p>
            <p className="text-sm text-gray-600">Report Accuracy</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2.5hrs</p>
            <p className="text-sm text-gray-600">Avg. Report Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;