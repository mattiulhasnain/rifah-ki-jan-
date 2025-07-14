import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Eye, Download,
  FileText, User, Calendar, TestTube, CheckCircle,
  Clock, AlertTriangle, Lock, Unlock, Printer
} from 'lucide-react';
import { Report, ReportTest } from '../../types';
import { createReportPDF } from '../../utils/pdfGenerator';

const ReportManagement: React.FC = () => {
  const { reports, patients, doctors, tests, invoices, addReport, updateReport } = useData();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState({
    invoiceId: '',
    patientId: '',
    doctorId: '',
    tests: [] as ReportTest[],
    interpretation: '',
    criticalValues: false
  });

  const filteredReports = reports.filter(report => {
    const patient = patients.find(p => p.id === report.patientId);
    const doctor = doctors.find(d => d.id === report.doctorId);
    const matchesSearch = (
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reportData = {
      ...formData,
      status: 'pending' as const,
      createdBy: user?.id || ''
    };

    if (editingReport) {
      updateReport(editingReport.id, reportData);
      setEditingReport(null);
    } else {
      addReport(reportData);
    }
    
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      invoiceId: '',
      patientId: '',
      doctorId: '',
      tests: [],
      interpretation: '',
      criticalValues: false
    });
  };

  const updateReportTest = (index: number, field: keyof ReportTest, value: any) => {
    const updatedTests = [...formData.tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    setFormData({ ...formData, tests: updatedTests });
  };

  const addTestResult = () => {
    setFormData({
      ...formData,
      tests: [...formData.tests, {
        testId: '',
        testName: '',
        result: '',
        normalRange: '',
        isAbnormal: false,
        unit: ''
      }]
    });
  };

  const removeTestResult = (index: number) => {
    const updatedTests = formData.tests.filter((_, i) => i !== index);
    setFormData({ ...formData, tests: updatedTests });
  };

  const updateReportStatus = (reportId: string, newStatus: Report['status']) => {
    if (!hasPermission('reports', 'edit')) {
      alert('You do not have permission to update report status.');
      return;
    }
    
    const updateData: Partial<Report> = { status: newStatus };
    
    if (newStatus === 'verified') {
      updateData.verifiedBy = user?.id;
      updateData.verifiedAt = new Date();
    }
    
    updateReport(reportId, updateData);
  };

  const generateReportPDF = async (report: Report) => {
    const patient = patients.find(p => p.id === report.patientId);
    const doctor = doctors.find(d => d.id === report.doctorId);
    
    if (!patient || !doctor) {
      alert('Patient or doctor information not found');
      return;
    }

    const reportData = {
      reportId: report.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientContact: patient.contact,
      doctorName: doctor.name,
      tests: report.tests,
      interpretation: report.interpretation,
      criticalValues: report.criticalValues,
      verifiedBy: report.verifiedBy,
      verifiedAt: report.verifiedAt
    };

    try {
      await createReportPDF(reportData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in_progress': return <TestTube className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'locked': return <Lock className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Management</h1>
          <p className="text-gray-600">Manage laboratory test reports and results</p>
        </div>
        {hasPermission('reports', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Report</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports by patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="verified">Verified</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Report Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingReport ? 'Edit Report' : 'Create New Report'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice *
                  </label>
                  <select
                    required
                    value={formData.invoiceId}
                    onChange={(e) => {
                      const selectedInvoice = invoices.find(inv => inv.id === e.target.value);
                      if (selectedInvoice) {
                        setFormData({
                          ...formData,
                          invoiceId: e.target.value,
                          patientId: selectedInvoice.patientId,
                          doctorId: selectedInvoice.doctorId,
                          tests: selectedInvoice.tests.map(test => ({
                            testId: test.testId,
                            testName: test.testName,
                            result: '',
                            normalRange: '',
                            isAbnormal: false,
                            unit: ''
                          }))
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Invoice</option>
                    {invoices.filter(inv => inv.status === 'finalized' || inv.status === 'paid').map(invoice => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <input
                    type="text"
                    value={patients.find(p => p.id === formData.patientId)?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor
                  </label>
                  <input
                    type="text"
                    value={doctors.find(d => d.id === formData.doctorId)?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              {/* Test Results Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Test Results
                  </label>
                  <button
                    type="button"
                    onClick={addTestResult}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Add Test Result
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.tests.map((test, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 border border-gray-200 rounded-lg">
                      <div>
                        <select
                          value={test.testId}
                          onChange={(e) => {
                            const selectedTest = tests.find(t => t.id === e.target.value);
                            updateReportTest(index, 'testId', e.target.value);
                            if (selectedTest) {
                              updateReportTest(index, 'testName', selectedTest.name);
                              updateReportTest(index, 'normalRange', selectedTest.referenceRange || '');
                              updateReportTest(index, 'unit', selectedTest.unit || '');
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Test</option>
                          {tests.filter(t => t.isActive).map(availableTest => (
                            <option key={availableTest.id} value={availableTest.id}>
                              {availableTest.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Result"
                          value={test.result}
                          onChange={(e) => updateReportTest(index, 'result', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Unit"
                          value={test.unit}
                          onChange={(e) => updateReportTest(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Normal Range"
                          value={test.normalRange}
                          onChange={(e) => updateReportTest(index, 'normalRange', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={test.isAbnormal}
                          onChange={(e) => updateReportTest(index, 'isAbnormal', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm text-gray-700">Abnormal</label>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => removeTestResult(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interpretation
                </label>
                <textarea
                  value={formData.interpretation}
                  onChange={(e) => setFormData({...formData, interpretation: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter clinical interpretation and recommendations..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.criticalValues}
                  onChange={(e) => setFormData({...formData, criticalValues: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Contains Critical Values
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReport(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingReport ? 'Update' : 'Create'} Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report View Modal */}
      {viewingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => generateReportPDF(viewingReport)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => setViewingReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Patient</p>
                  <p className="font-medium">{patients.find(p => p.id === viewingReport.patientId)?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium">{doctors.find(d => d.id === viewingReport.doctorId)?.name}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Test Results</h3>
                <div className="space-y-2">
                  {viewingReport.tests.map((test, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 p-2 bg-gray-50 rounded">
                      <span className="font-medium">{test.testName}</span>
                      <span className={test.isAbnormal ? 'text-red-600 font-medium' : ''}>{test.result}</span>
                      <span className="text-sm text-gray-600">{test.unit}</span>
                      <span className="text-sm text-gray-600">{test.normalRange}</span>
                    </div>
                  ))}
                </div>
              </div>
              {viewingReport.interpretation && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Interpretation</h3>
                  <p className="text-gray-700">{viewingReport.interpretation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tests</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Critical</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                const patient = patients.find(p => p.id === report.patientId);
                const doctor = doctors.find(d => d.id === report.doctorId);
                return (
                  <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{patient?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{doctor?.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{report.tests.length} tests</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{report.createdAt.toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(report.status)}
                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {report.criticalValues && (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingReport(report)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateReportPDF(report)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {hasPermission('reports', 'edit') && report.status !== 'locked' && (
                          <>
                            <button
                              onClick={() => updateReportStatus(report.id, 'in_progress')}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Mark In Progress"
                            >
                              <TestTube className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateReportStatus(report.id, 'completed')}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Mark Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {hasPermission('reports', 'verify') && report.status === 'completed' && (
                          <button
                            onClick={() => updateReportStatus(report.id, 'verified')}
                            className="p-1 text-purple-600 hover:text-purple-800"
                            title="Verify Report"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No reports found</p>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;