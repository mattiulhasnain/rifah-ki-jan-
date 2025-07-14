import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Calendar, AlertTriangle, CheckCircle,
  Settings, TrendingUp, FileText, Target
} from 'lucide-react';

interface QCRecord {
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

interface CalibrationRecord {
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

const QualityControl: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('qc');
  const [qcRecords, setQcRecords] = useState<QCRecord[]>([]);
  const [calibrationRecords, setCalibrationRecords] = useState<CalibrationRecord[]>([
    {
      id: '1',
      instrumentId: 'INST001',
      instrumentName: 'Hematology Analyzer',
      calibrationDate: new Date('2024-01-15'),
      nextCalibrationDate: new Date('2024-07-15'),
      performedBy: 'Tech Support',
      certificateNumber: 'CAL-2024-001',
      status: 'valid',
      notes: 'Annual calibration completed successfully'
    }
  ]);

  const [showQCForm, setShowQCForm] = useState(false);
  const [showCalForm, setShowCalForm] = useState(false);
  const [qcFormData, setQcFormData] = useState({
    testId: '',
    testName: '',
    controlLevel: 'Level 1' as const,
    expectedValue: '',
    actualValue: '',
    unit: '',
    tolerance: '',
    instrumentId: '',
    batchNumber: '',
    notes: ''
  });

  const [calFormData, setCalFormData] = useState({
    instrumentId: '',
    instrumentName: '',
    calibrationDate: new Date().toISOString().split('T')[0],
    nextCalibrationDate: '',
    certificateNumber: '',
    notes: ''
  });

  const handleQCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedVal = parseFloat(qcFormData.expectedValue);
    const actualVal = parseFloat(qcFormData.actualValue);
    const tolerance = parseFloat(qcFormData.tolerance);
    
    const isWithinRange = Math.abs(actualVal - expectedVal) <= (expectedVal * tolerance / 100);

    const newRecord: QCRecord = {
      id: Math.random().toString(36).substr(2, 9),
      testId: qcFormData.testId,
      testName: qcFormData.testName,
      controlLevel: qcFormData.controlLevel,
      expectedValue: expectedVal,
      actualValue: actualVal,
      unit: qcFormData.unit,
      tolerance,
      isWithinRange,
      performedBy: user?.name || '',
      performedAt: new Date(),
      instrumentId: qcFormData.instrumentId,
      batchNumber: qcFormData.batchNumber,
      notes: qcFormData.notes
    };

    setQcRecords(prev => [...prev, newRecord]);
    setShowQCForm(false);
    resetQCForm();
  };

  const handleCalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CalibrationRecord = {
      id: Math.random().toString(36).substr(2, 9),
      instrumentId: calFormData.instrumentId,
      instrumentName: calFormData.instrumentName,
      calibrationDate: new Date(calFormData.calibrationDate),
      nextCalibrationDate: new Date(calFormData.nextCalibrationDate),
      performedBy: user?.name || '',
      certificateNumber: calFormData.certificateNumber,
      status: 'valid',
      notes: calFormData.notes
    };

    setCalibrationRecords(prev => [...prev, newRecord]);
    setShowCalForm(false);
    resetCalForm();
  };

  const resetQCForm = () => {
    setQcFormData({
      testId: '',
      testName: '',
      controlLevel: 'Level 1',
      expectedValue: '',
      actualValue: '',
      unit: '',
      tolerance: '',
      instrumentId: '',
      batchNumber: '',
      notes: ''
    });
  };

  const resetCalForm = () => {
    setCalFormData({
      instrumentId: '',
      instrumentName: '',
      calibrationDate: new Date().toISOString().split('T')[0],
      nextCalibrationDate: '',
      certificateNumber: '',
      notes: ''
    });
  };

  const getQCStatusColor = (isWithinRange: boolean) => {
    return isWithinRange ? 'text-green-600' : 'text-red-600';
  };

  const getCalibrationStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'due_soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Control</h1>
          <p className="text-gray-600">Manage quality control and instrument calibration</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'qc', label: 'Quality Control', icon: Target },
              { id: 'calibration', label: 'Calibration', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
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
          {/* Quality Control Tab */}
          {activeTab === 'qc' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Quality Control Records</h2>
                {hasPermission('qc', 'create') && (
                  <button
                    onClick={() => setShowQCForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add QC Record</span>
                  </button>
                )}
              </div>

              {/* QC Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Test</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Control Level</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Expected</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actual</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Performed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qcRecords.map((record) => (
                      <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{record.testName}</p>
                            {record.batchNumber && (
                              <p className="text-sm text-gray-500">Batch: {record.batchNumber}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {record.controlLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {record.expectedValue} {record.unit}
                        </td>
                        <td className="py-3 px-4">
                          <span className={getQCStatusColor(record.isWithinRange)}>
                            {record.actualValue} {record.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            {record.isWithinRange ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={getQCStatusColor(record.isWithinRange)}>
                              {record.isWithinRange ? 'Pass' : 'Fail'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {record.performedAt.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {record.performedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {qcRecords.length === 0 && (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No QC records found</p>
                </div>
              )}
            </div>
          )}

          {/* Calibration Tab */}
          {activeTab === 'calibration' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Instrument Calibration</h2>
                {hasPermission('calibration', 'create') && (
                  <button
                    onClick={() => setShowCalForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Calibration</span>
                  </button>
                )}
              </div>

              {/* Calibration Records */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calibrationRecords.map((record) => (
                  <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{record.instrumentName}</h3>
                          <p className="text-sm text-gray-500">ID: {record.instrumentId}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCalibrationStatusColor(record.status)}`}>
                        {record.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Calibration:</span>
                        <span className="text-gray-900">{record.calibrationDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Due:</span>
                        <span className="text-gray-900">{record.nextCalibrationDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Performed By:</span>
                        <span className="text-gray-900">{record.performedBy}</span>
                      </div>
                      {record.certificateNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificate:</span>
                          <span className="text-gray-900">{record.certificateNumber}</span>
                        </div>
                      )}
                    </div>

                    {record.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {calibrationRecords.length === 0 && (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No calibration records found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* QC Form Modal */}
      {showQCForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add QC Record</h2>
            <form onSubmit={handleQCSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={qcFormData.testName}
                    onChange={(e) => setQcFormData({...qcFormData, testName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Control Level *
                  </label>
                  <select
                    required
                    value={qcFormData.controlLevel}
                    onChange={(e) => setQcFormData({...qcFormData, controlLevel: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Value *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={qcFormData.expectedValue}
                    onChange={(e) => setQcFormData({...qcFormData, expectedValue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Value *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={qcFormData.actualValue}
                    onChange={(e) => setQcFormData({...qcFormData, actualValue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={qcFormData.unit}
                    onChange={(e) => setQcFormData({...qcFormData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tolerance (%) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    value={qcFormData.tolerance}
                    onChange={(e) => setQcFormData({...qcFormData, tolerance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrument ID
                  </label>
                  <input
                    type="text"
                    value={qcFormData.instrumentId}
                    onChange={(e) => setQcFormData({...qcFormData, instrumentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={qcFormData.batchNumber}
                    onChange={(e) => setQcFormData({...qcFormData, batchNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={qcFormData.notes}
                  onChange={(e) => setQcFormData({...qcFormData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowQCForm(false);
                    resetQCForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add QC Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calibration Form Modal */}
      {showCalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Calibration Record</h2>
            <form onSubmit={handleCalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrument ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={calFormData.instrumentId}
                    onChange={(e) => setCalFormData({...calFormData, instrumentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instrument Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={calFormData.instrumentName}
                    onChange={(e) => setCalFormData({...calFormData, instrumentName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calibration Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={calFormData.calibrationDate}
                    onChange={(e) => setCalFormData({...calFormData, calibrationDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Calibration Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={calFormData.nextCalibrationDate}
                    onChange={(e) => setCalFormData({...calFormData, nextCalibrationDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate Number
                  </label>
                  <input
                    type="text"
                    value={calFormData.certificateNumber}
                    onChange={(e) => setCalFormData({...calFormData, certificateNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={calFormData.notes}
                  onChange={(e) => setCalFormData({...calFormData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCalForm(false);
                    resetCalForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Calibration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityControl;