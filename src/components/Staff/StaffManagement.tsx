import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye,
  Users, Shield, Calendar, Phone, Mail, MapPin
} from 'lucide-react';
import { User, UserRole } from '../../types';

const StaffManagement: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [viewingStaff, setViewingStaff] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    role: 'receptionist' as UserRole,
    isActive: true,
    department: '',
    phone: '',
    address: '',
    cnic: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: ''
  });

  // Demo staff data (in real app, this would come from context/API)
  const [staffMembers, setStaffMembers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@lab.com',
      role: 'admin',
      name: 'System Administrator',
      permissions: [{ module: 'all', actions: ['view', 'create', 'edit', 'delete'] }],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    },
    {
      id: '2',
      username: 'receptionist',
      email: 'reception@lab.com',
      role: 'receptionist',
      name: 'Reception Staff',
      permissions: [
        { module: 'patients', actions: ['view', 'create', 'edit'] },
        { module: 'invoices', actions: ['view', 'create'] }
      ],
      isActive: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '3',
      username: 'technician',
      email: 'tech@lab.com',
      role: 'technician',
      name: 'Lab Technician',
      permissions: [
        { module: 'reports', actions: ['view', 'create', 'edit'] },
        { module: 'tests', actions: ['view'] }
      ],
      isActive: true,
      createdAt: new Date('2024-02-01')
    }
  ]);

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'manager', label: 'Manager', description: 'Management and oversight' },
    { value: 'receptionist', label: 'Receptionist', description: 'Patient registration and invoicing' },
    { value: 'technician', label: 'Lab Technician', description: 'Test processing and reports' },
    { value: 'pathologist', label: 'Pathologist', description: 'Report verification and interpretation' },
    { value: 'accountant', label: 'Accountant', description: 'Financial management' },
    { value: 'lab_helper', label: 'Lab Helper', description: 'Laboratory assistance' }
  ];

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = (
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const staffData: User = {
      id: editingStaff?.id || Math.random().toString(36).substr(2, 9),
      ...formData,
      permissions: getDefaultPermissions(formData.role),
      createdAt: editingStaff?.createdAt || new Date(),
      lastLogin: editingStaff?.lastLogin
    };

    if (editingStaff) {
      setStaffMembers(prev => prev.map(s => s.id === editingStaff.id ? staffData : s));
      setEditingStaff(null);
    } else {
      setStaffMembers(prev => [...prev, staffData]);
    }
    
    setShowAddForm(false);
    resetForm();
  };

  const getDefaultPermissions = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [{ module: 'all', actions: ['view', 'create', 'edit', 'delete'] as const }];
      case 'manager':
        return [
          { module: 'dashboard', actions: ['view'] as const },
          { module: 'analytics', actions: ['view'] as const },
          { module: 'staff', actions: ['view', 'edit'] as const }
        ];
      case 'receptionist':
        return [
          { module: 'patients', actions: ['view', 'create', 'edit'] as const },
          { module: 'invoices', actions: ['view', 'create'] as const },
          { module: 'reports', actions: ['view'] as const }
        ];
      case 'technician':
        return [
          { module: 'reports', actions: ['view', 'create', 'edit'] as const },
          { module: 'tests', actions: ['view'] as const },
          { module: 'stock', actions: ['view'] as const }
        ];
      case 'pathologist':
        return [
          { module: 'reports', actions: ['view', 'create', 'edit', 'verify'] as const },
          { module: 'templates', actions: ['view', 'create', 'edit'] as const },
          { module: 'patients', actions: ['view'] as const }
        ];
      case 'accountant':
        return [
          { module: 'invoices', actions: ['view', 'edit'] as const },
          { module: 'expenses', actions: ['view', 'create', 'edit'] as const },
          { module: 'analytics', actions: ['view'] as const }
        ];
      default:
        return [{ module: 'dashboard', actions: ['view'] as const }];
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      name: '',
      role: 'receptionist',
      isActive: true,
      department: '',
      phone: '',
      address: '',
      cnic: '',
      joiningDate: new Date().toISOString().split('T')[0],
      salary: ''
    });
  };

  const handleEdit = (staff: User) => {
    setEditingStaff(staff);
    setFormData({
      username: staff.username,
      email: staff.email,
      name: staff.name,
      role: staff.role,
      isActive: staff.isActive,
      department: '',
      phone: '',
      address: '',
      cnic: '',
      joiningDate: staff.createdAt.toISOString().split('T')[0],
      salary: ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffMembers(prev => prev.filter(s => s.id !== id));
    }
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-purple-100 text-purple-800',
      receptionist: 'bg-blue-100 text-blue-800',
      technician: 'bg-green-100 text-green-800',
      pathologist: 'bg-indigo-100 text-indigo-800',
      accountant: 'bg-yellow-100 text-yellow-800',
      lab_helper: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage staff members and their permissions</p>
        </div>
        {hasPermission('staff', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff</span>
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
              placeholder="Search staff by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Staff Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
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
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {roles.find(r => r.value === formData.role)?.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNIC
                  </label>
                  <input
                    type="text"
                    value={formData.cnic}
                    onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingStaff(null);
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
                  {editingStaff ? 'Update' : 'Add'} Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff View Modal */}
      {viewingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Staff Details</h2>
              <button
                onClick={() => setViewingStaff(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{viewingStaff.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <span className={`px-2 py-1 rounded-full text-sm ${getRoleColor(viewingStaff.role)}`}>
                    {viewingStaff.role.charAt(0).toUpperCase() + viewingStaff.role.slice(1).replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{viewingStaff.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-medium">{viewingStaff.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joined</p>
                  <p className="font-medium">{viewingStaff.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="font-medium">{viewingStaff.lastLogin?.toLocaleDateString() || 'Never'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Permissions</p>
                <div className="space-y-2">
                  {viewingStaff.permissions.map((permission, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">{permission.module}:</span>
                      <span className="ml-2 text-sm text-gray-600">
                        {permission.actions.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Staff Member</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{staff.name}</p>
                        <p className="text-sm text-gray-500">{staff.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className={`px-2 py-1 rounded-full text-sm ${getRoleColor(staff.role)}`}>
                        {staff.role.charAt(0).toUpperCase() + staff.role.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{staff.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{staff.createdAt.toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-900">
                      {staff.lastLogin ? staff.lastLogin.toLocaleDateString() : 'Never'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      staff.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewingStaff(staff)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {hasPermission('staff', 'edit') && (
                        <button
                          onClick={() => handleEdit(staff)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {hasPermission('staff', 'delete') && staff.id !== user?.id && (
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No staff members found</p>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;