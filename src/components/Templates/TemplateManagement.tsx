import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Edit, Trash2, Copy, Lock, Unlock,
  FileText, Eye, Download, Upload, Save
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  isLocked: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  isActive: boolean;
}

const TemplateManagement: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Complete Blood Count Template',
      category: 'Hematology',
      content: `<h2>Complete Blood Count Report</h2>
<p><strong>Patient:</strong> {{patient_name}}</p>
<p><strong>Age/Gender:</strong> {{patient_age}}/{{patient_gender}}</p>
<p><strong>Date:</strong> {{report_date}}</p>

<table>
<tr><th>Parameter</th><th>Result</th><th>Normal Range</th><th>Unit</th></tr>
<tr><td>Hemoglobin</td><td>{{hemoglobin}}</td><td>12.0-15.5</td><td>g/dL</td></tr>
<tr><td>RBC Count</td><td>{{rbc_count}}</td><td>4.0-5.5</td><td>million/μL</td></tr>
<tr><td>WBC Count</td><td>{{wbc_count}}</td><td>4.0-11.0</td><td>thousand/μL</td></tr>
</table>

<p><strong>Interpretation:</strong></p>
<p>{{interpretation}}</p>`,
      isLocked: false,
      createdBy: '1',
      createdAt: new Date('2024-01-01'),
      lastModified: new Date('2024-01-15'),
      isActive: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    content: '',
    isActive: true
  });

  const categories = [
    'Hematology', 'Biochemistry', 'Microbiology', 'Immunology',
    'Hormones', 'Pathology', 'Genetics', 'Serology'
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...formData, lastModified: new Date() }
          : t
      ));
    } else {
      const newTemplate: ReportTemplate = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        isLocked: false,
        createdBy: user?.id || '',
        createdAt: new Date(),
        lastModified: new Date()
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setShowEditor(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      content: '',
      isActive: true
    });
    setEditingTemplate(null);
  };

  const handleEdit = (template: ReportTemplate) => {
    if (template.isLocked && !hasPermission('templates', 'unlock')) {
      alert('This template is locked and cannot be edited.');
      return;
    }
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      content: template.content,
      isActive: template.isActive
    });
    setShowEditor(true);
  };

  const toggleLock = (template: ReportTemplate) => {
    if (!hasPermission('templates', 'lock')) {
      alert('You do not have permission to lock/unlock templates.');
      return;
    }
    setTemplates(prev => prev.map(t => 
      t.id === template.id ? { ...t, isLocked: !t.isLocked } : t
    ));
  };

  const cloneTemplate = (template: ReportTemplate) => {
    const cloned: ReportTemplate = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      name: `${template.name} (Copy)`,
      isLocked: false,
      createdBy: user?.id || '',
      createdAt: new Date(),
      lastModified: new Date()
    };
    setTemplates(prev => [...prev, cloned]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Templates</h1>
          <p className="text-gray-600">Create and manage report templates</p>
        </div>
        {hasPermission('templates', 'create') && (
          <button
            onClick={() => setShowEditor(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Template Editor */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name *
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Content *
                </label>
                <div className="mb-2 text-sm text-gray-600">
                  Use placeholders like: {`{{patient_name}}, {{patient_age}}, {{report_date}}, {{test_result}}`}
                </div>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter your template content with HTML formatting..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditor(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.category}</p>
                </div>
              </div>
              {template.isLocked && <Lock className="w-4 h-4 text-red-600" />}
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>Created: {template.createdAt.toLocaleDateString()}</p>
              <p>Modified: {template.lastModified.toLocaleDateString()}</p>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {template.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(template)}
                className="p-1 text-blue-600 hover:text-blue-800"
                disabled={template.isLocked && !hasPermission('templates', 'unlock')}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => cloneTemplate(template)}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <Copy className="w-4 h-4" />
              </button>
              {hasPermission('templates', 'lock') && (
                <button
                  onClick={() => toggleLock(template)}
                  className="p-1 text-yellow-600 hover:text-yellow-800"
                >
                  {template.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateManagement;