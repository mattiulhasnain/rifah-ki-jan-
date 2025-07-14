import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye,
  Receipt, DollarSign, Calendar, User, FileText,
  Download, Lock, Unlock, AlertCircle, Printer
} from 'lucide-react';
import { Invoice, InvoiceTest } from '../../types';
import { createInvoicePDF } from '../../utils/pdfGenerator';

const InvoiceManagement: React.FC = () => {
  const { invoices, patients, doctors, tests, addInvoice, updateInvoice, deleteInvoice } = useData();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    tests: [] as InvoiceTest[],
    discount: 0,
    notes: '',
    paymentMethod: 'cash'
  });

  const filteredInvoices = invoices.filter(invoice => {
    const patient = patients.find(p => p.id === invoice.patientId);
    const doctor = doctors.find(d => d.id === invoice.doctorId);
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formData.tests.reduce((sum, test) => sum + (test.price * test.quantity), 0);
    const finalAmount = totalAmount - formData.discount;
    
    const invoiceData = {
      ...formData,
      invoiceNumber: `INV${(invoices.length + 1).toString().padStart(4, '0')}`,
      totalAmount,
      finalAmount,
      status: 'draft' as const,
      createdBy: user?.id || '',
      isLocked: false
    };

    if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoiceData);
      setEditingInvoice(null);
    } else {
      addInvoice(invoiceData);
    }
    
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      tests: [],
      discount: 0,
      notes: '',
      paymentMethod: 'cash'
    });
  };

  const addTestToInvoice = () => {
    setFormData({
      ...formData,
      tests: [...formData.tests, { testId: '', testName: '', price: 0, quantity: 1 }]
    });
  };

  const updateInvoiceTest = (index: number, field: keyof InvoiceTest, value: any) => {
    const updatedTests = [...formData.tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    
    if (field === 'testId') {
      const selectedTest = tests.find(t => t.id === value);
      if (selectedTest) {
        updatedTests[index].testName = selectedTest.name;
        updatedTests[index].price = selectedTest.price;
      }
    }
    
    setFormData({ ...formData, tests: updatedTests });
  };

  const removeTestFromInvoice = (index: number) => {
    const updatedTests = formData.tests.filter((_, i) => i !== index);
    setFormData({ ...formData, tests: updatedTests });
  };

  const handleEdit = (invoice: Invoice) => {
    if (invoice.isLocked && !hasPermission('invoices', 'unlock')) {
      alert('This invoice is locked and cannot be edited.');
      return;
    }
    setEditingInvoice(invoice);
    setFormData({
      patientId: invoice.patientId,
      doctorId: invoice.doctorId,
      tests: invoice.tests,
      discount: invoice.discount,
      notes: invoice.notes || '',
      paymentMethod: invoice.paymentMethod || 'cash'
    });
    setShowAddForm(true);
  };

  const toggleLock = (invoice: Invoice) => {
    if (!hasPermission('invoices', 'lock')) {
      alert('You do not have permission to lock/unlock invoices.');
      return;
    }
    updateInvoice(invoice.id, { isLocked: !invoice.isLocked });
  };

  const generateInvoicePDF = async (invoice: Invoice) => {
    const patient = patients.find(p => p.id === invoice.patientId);
    const doctor = doctors.find(d => d.id === invoice.doctorId);
    
    if (!patient || !doctor) {
      alert('Patient or doctor information not found');
      return;
    }

    const invoiceData = {
      ...invoice,
      patientName: patient.name,
      doctorName: doctor.name,
      createdBy: user?.name || 'System'
    };

    try {
      await createInvoicePDF(invoiceData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF invoice');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'finalized': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Create and manage patient invoices</p>
        </div>
        {hasPermission('invoices', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
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
              placeholder="Search invoices by number, patient, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Invoice Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient *
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.patientId})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referring Doctor *
                  </label>
                  <select
                    required
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.filter(d => d.isActive).map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tests Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Tests *
                  </label>
                  <button
                    type="button"
                    onClick={addTestToInvoice}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Add Test
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.tests.map((test, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="md:col-span-2">
                        <select
                          value={test.testId}
                          onChange={(e) => updateInvoiceTest(index, 'testId', e.target.value)}
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
                          type="number"
                          placeholder="Quantity"
                          value={test.quantity}
                          onChange={(e) => updateInvoiceTest(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Price"
                          value={test.price}
                          onChange={(e) => updateInvoiceTest(index, 'price', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">
                          PKR {(test.price * test.quantity).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTestFromInvoice(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Invoice Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Invoice Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>PKR {formData.tests.reduce((sum, test) => sum + (test.price * test.quantity), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>- PKR {formData.discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-1">
                    <span>Total:</span>
                    <span>PKR {(formData.tests.reduce((sum, test) => sum + (test.price * test.quantity), 0) - formData.discount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingInvoice(null);
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
                  {editingInvoice ? 'Update' : 'Create'} Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice View Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => generateInvoicePDF(viewingInvoice)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-medium">{viewingInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{viewingInvoice.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice #</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const patient = patients.find(p => p.id === invoice.patientId);
                const doctor = doctors.find(d => d.id === invoice.doctorId);
                return (
                  <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-600">{invoice.invoiceNumber}</span>
                        {invoice.isLocked && <Lock className="w-4 h-4 text-red-600" />}
                      </div>
                    </td>
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
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{invoice.createdAt.toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          PKR {invoice.finalAmount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingInvoice(invoice)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateInvoicePDF(invoice)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {hasPermission('invoices', 'edit') && (
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission('invoices', 'lock') && (
                          <button
                            onClick={() => toggleLock(invoice)}
                            className="p-1 text-yellow-600 hover:text-yellow-800"
                          >
                            {invoice.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                        )}
                        {hasPermission('invoices', 'delete') && !invoice.isLocked && (
                          <button
                            onClick={() => deleteInvoice(invoice.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No invoices found</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;