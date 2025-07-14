import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, TestTube, Calendar,
  Download, Filter, RefreshCw
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { patients, doctors, tests, invoices, reports, expenses } = useData();
  const [dateRange, setDateRange] = useState('30');
  const [chartType, setChartType] = useState('revenue');

  // Calculate analytics data
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.finalAmount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalTests = reports.reduce((sum, report) => sum + report.tests.length, 0);

  // Monthly revenue data
  const getMonthlyData = () => {
    const monthlyData: { [key: string]: { revenue: number; expenses: number; tests: number; patients: number } } = {};
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { revenue: 0, expenses: 0, tests: 0, patients: 0 };
    }

    // Aggregate invoice data
    invoices.forEach(invoice => {
      const monthKey = invoice.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].revenue += invoice.finalAmount;
      }
    });

    // Aggregate expense data
    expenses.forEach(expense => {
      const monthKey = expense.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].expenses += expense.amount;
      }
    });

    // Aggregate patient data
    patients.forEach(patient => {
      const monthKey = patient.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].patients += 1;
      }
    });

    // Aggregate test data
    reports.forEach(report => {
      const monthKey = report.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].tests += report.tests.length;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
      profit: data.revenue - data.expenses
    }));
  };

  // Test category distribution
  const getTestCategoryData = () => {
    const categoryCount: { [key: string]: number } = {};
    
    reports.forEach(report => {
      report.tests.forEach(test => {
        const testInfo = tests.find(t => t.id === test.testId);
        if (testInfo) {
          categoryCount[testInfo.category] = (categoryCount[testInfo.category] || 0) + 1;
        }
      });
    });

    return Object.entries(categoryCount).map(([category, count]) => ({
      name: category,
      value: count
    }));
  };

  // Doctor performance data
  const getDoctorPerformance = () => {
    const doctorStats: { [key: string]: { referrals: number; revenue: number; name: string } } = {};
    
    invoices.forEach(invoice => {
      const doctor = doctors.find(d => d.id === invoice.doctorId);
      if (doctor) {
        if (!doctorStats[doctor.id]) {
          doctorStats[doctor.id] = { referrals: 0, revenue: 0, name: doctor.name };
        }
        doctorStats[doctor.id].referrals += 1;
        doctorStats[doctor.id].revenue += invoice.finalAmount;
      }
    });

    return Object.values(doctorStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const monthlyData = getMonthlyData();
  const testCategoryData = getTestCategoryData();
  const doctorPerformanceData = getDoctorPerformance();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const exportData = () => {
    // Export functionality would be implemented here
    console.log('Exporting analytics data...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive business intelligence and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={exportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">PKR {totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-blue-600">PKR {netProfit.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">+8% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-purple-600">{patients.length}</p>
              <p className="text-sm text-gray-500 mt-1">+15% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tests Performed</p>
              <p className="text-2xl font-bold text-orange-600">{totalTests}</p>
              <p className="text-sm text-gray-500 mt-1">+22% from last month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TestTube className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Selection */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">View:</span>
          <div className="flex space-x-2">
            {[
              { key: 'revenue', label: 'Revenue Trends' },
              { key: 'tests', label: 'Test Analytics' },
              { key: 'doctors', label: 'Doctor Performance' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setChartType(option.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  chartType === option.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Trends */}
        {chartType === 'revenue' && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `PKR ${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Profit Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `PKR ${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Test Analytics */}
        {chartType === 'tests' && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={testCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {testCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Test Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tests" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Doctor Performance */}
        {chartType === 'doctors' && (
          <>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Doctors by Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={doctorPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => `PKR ${Number(value).toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Referral Count</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={doctorPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="referrals" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Patient Growth */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Growth Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="patients" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Revenue:</span>
              <span className="font-medium text-green-600">PKR {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Expenses:</span>
              <span className="font-medium text-red-600">PKR {totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-900 font-medium">Net Profit:</span>
              <span className="font-bold text-blue-600">PKR {netProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit Margin:</span>
              <span className="font-medium">{((netProfit / totalRevenue) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Active Patients:</span>
              <span className="font-medium">{patients.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Doctors:</span>
              <span className="font-medium">{doctors.filter(d => d.isActive).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Tests:</span>
              <span className="font-medium">{tests.filter(t => t.isActive).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed Reports:</span>
              <span className="font-medium">{reports.filter(r => r.status === 'completed').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Indicators</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Revenue/Patient:</span>
              <span className="font-medium">PKR {patients.length > 0 ? Math.round(totalRevenue / patients.length).toLocaleString() : '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tests/Patient:</span>
              <span className="font-medium">{patients.length > 0 ? (totalTests / patients.length).toFixed(1) : '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Report Completion:</span>
              <span className="font-medium">{reports.length > 0 ? Math.round((reports.filter(r => r.status === 'completed').length / reports.length) * 100) : 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Growth:</span>
              <span className="font-medium text-green-600">+12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;