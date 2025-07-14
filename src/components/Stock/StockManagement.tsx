import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Trash2, AlertTriangle,
  Package, TrendingDown, Calendar, DollarSign,
  ArrowUp, ArrowDown, Building
} from 'lucide-react';
import { StockItem, StockTransaction } from '../../types';

const StockManagement: React.FC = () => {
  const { stock, addStockItem, updateStockItem } = useData();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: '',
    reorderLevel: '',
    unit: '',
    costPerUnit: '',
    vendor: '',
    expiryDate: '',
    batchNumber: '',
    isActive: true
  });
  const [transactionData, setTransactionData] = useState({
    type: 'in' as 'in' | 'out',
    quantity: '',
    reason: '',
    notes: ''
  });

  const categories = [
    'Reagents',
    'Consumables',
    'Equipment',
    'Chemicals',
    'Kits',
    'Supplies',
    'Maintenance',
    'Other'
  ];

  const units = [
    'Piece',
    'Kit',
    'Bottle',
    'Box',
    'Liter',
    'Milliliter',
    'Gram',
    'Kilogram',
    'Pack',
    'Set'
  ];

  const filteredStock = stock.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = stock.filter(item => item.currentStock <= item.reorderLevel);
  const expiringItems = stock.filter(item => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      ...formData,
      currentStock: parseInt(formData.currentStock),
      reorderLevel: parseInt(formData.reorderLevel),
      costPerUnit: parseFloat(formData.costPerUnit),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
    };

    if (editingItem) {
      updateStockItem(editingItem.id, itemData);
      setEditingItem(null);
    } else {
      addStockItem(itemData);
    }
    
    setShowAddForm(false);
    resetForm();
  };

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const quantity = parseInt(transactionData.quantity);
    const newStock = transactionData.type === 'in' 
      ? selectedItem.currentStock + quantity
      : selectedItem.currentStock - quantity;

    if (newStock < 0) {
      alert('Insufficient stock for this transaction.');
      return;
    }

    updateStockItem(selectedItem.id, { currentStock: newStock });
    
    // Here you would also add the transaction to a transactions log
    console.log('Stock transaction:', {
      itemId: selectedItem.id,
      type: transactionData.type,
      quantity,
      reason: transactionData.reason,
      notes: transactionData.notes,
      createdBy: user?.id,
      createdAt: new Date()
    });

    setShowTransactionForm(false);
    setSelectedItem(null);
    setTransactionData({
      type: 'in',
      quantity: '',
      reason: '',
      notes: ''
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      currentStock: '',
      reorderLevel: '',
      unit: '',
      costPerUnit: '',
      vendor: '',
      expiryDate: '',
      batchNumber: '',
      isActive: true
    });
  };

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      currentStock: item.currentStock.toString(),
      reorderLevel: item.reorderLevel.toString(),
      unit: item.unit,
      costPerUnit: item.costPerUnit.toString(),
      vendor: item.vendor || '',
      expiryDate: item.expiryDate ? item.expiryDate.toISOString().split('T')[0] : '',
      batchNumber: item.batchNumber || '',
      isActive: item.isActive
    });
    setShowAddForm(true);
  };

  const openTransactionForm = (item: StockItem, type: 'in' | 'out') => {
    setSelectedItem(item);
    setTransactionData({
      type,
      quantity: '',
      reason: '',
      notes: ''
    });
    setShowTransactionForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600">Manage inventory and track stock levels</p>
        </div>
        {hasPermission('stock', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        )}
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-medium text-red-900">Low Stock Alert</h3>
              </div>
              <p className="text-sm text-red-700 mb-2">{lowStockItems.length} items need reordering</p>
              <div className="space-y-1">
                {lowStockItems.slice(0, 3).map(item => (
                  <p key={item.id} className="text-xs text-red-600">
                    {item.name}: {item.currentStock} {item.unit} (Reorder at: {item.reorderLevel})
                  </p>
                ))}
                {lowStockItems.length > 3 && (
                  <p className="text-xs text-red-600">+{lowStockItems.length - 3} more items</p>
                )}
              </div>
            </div>
          )}
          
          {expiringItems.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-900">Expiry Alert</h3>
              </div>
              <p className="text-sm text-yellow-700 mb-2">{expiringItems.length} items expiring soon</p>
              <div className="space-y-1">
                {expiringItems.slice(0, 3).map(item => (
                  <p key={item.id} className="text-xs text-yellow-600">
                    {item.name}: Expires {item.expiryDate?.toLocaleDateString()}
                  </p>
                ))}
                {expiringItems.length > 3 && (
                  <p className="text-xs text-yellow-600">+{expiringItems.length - 3} more items</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items by name, category, or vendor..."
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

      {/* Add/Edit Item Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Stock Item' : 'Add New Stock Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reorder Level *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({...formData, reorderLevel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Per Unit *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({...formData, costPerUnit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
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
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Transaction Form */}
      {showTransactionForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Stock {transactionData.type === 'in' ? 'In' : 'Out'}: {selectedItem.name}
            </h2>
            <form onSubmit={handleTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock
                </label>
                <input
                  type="text"
                  value={`${selectedItem.currentStock} ${selectedItem.unit}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  value={transactionData.quantity}
                  onChange={(e) => setTransactionData({...transactionData, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason *
                </label>
                <input
                  type="text"
                  required
                  value={transactionData.reason}
                  onChange={(e) => setTransactionData({...transactionData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Purchase, Usage, Damage, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={transactionData.notes}
                  onChange={(e) => setTransactionData({...transactionData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTransactionForm(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-lg ${
                    transactionData.type === 'in' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {transactionData.type === 'in' ? 'Add Stock' : 'Remove Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Reorder Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cost/Unit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Vendor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Expiry</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((item) => {
                const isLowStock = item.currentStock <= item.reorderLevel;
                const daysUntilExpiry = item.expiryDate 
                  ? Math.ceil((item.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                
                return (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.batchNumber && (
                            <p className="text-sm text-gray-500">Batch: {item.batchNumber}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.currentStock} {item.unit}
                        </span>
                        {isLowStock && <TrendingDown className="w-4 h-4 text-red-600" />}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{item.reorderLevel} {item.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">PKR {item.costPerUnit.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{item.vendor || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {item.expiryDate ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${isExpiringSoon ? 'text-yellow-600 font-medium' : 'text-gray-900'}`}>
                            {item.expiryDate.toLocaleDateString()}
                          </span>
                          {isExpiringSoon && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {hasPermission('stock', 'edit') && (
                          <>
                            <button
                              onClick={() => openTransactionForm(item, 'in')}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Stock In"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openTransactionForm(item, 'out')}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Stock Out"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
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

      {filteredStock.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No stock items found</p>
        </div>
      )}
    </div>
  );
};

export default StockManagement;