import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Upload, Download, Trash2, Eye, Search, Folder,
  File, Image, FileText, Plus, FolderPlus
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  mimeType?: string;
  uploadedBy: string;
  uploadedAt: Date;
  patientId?: string;
  parentId?: string;
  path: string;
}

const FileManager: React.FC = () => {
  const { patients } = useData();
  const { user, hasPermission } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Patient Documents',
      type: 'folder',
      uploadedBy: 'System',
      uploadedAt: new Date('2024-01-01'),
      path: '/Patient Documents'
    },
    {
      id: '2',
      name: 'Lab Reports',
      type: 'folder',
      uploadedBy: 'System',
      uploadedAt: new Date('2024-01-01'),
      path: '/Lab Reports'
    },
    {
      id: '3',
      name: 'Prescriptions',
      type: 'folder',
      uploadedBy: 'System',
      uploadedAt: new Date('2024-01-01'),
      path: '/Prescriptions'
    }
  ]);

  const [currentPath, setCurrentPath] = useState('/');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = !selectedPatient || file.patientId === selectedPatient;
    const matchesPath = file.path.startsWith(currentPath) && 
                       file.path.split('/').length === currentPath.split('/').length + (currentPath === '/' ? 0 : 1);
    return matchesSearch && matchesPatient && matchesPath;
  });

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-8 h-8 text-blue-600" />;
    }
    
    if (file.mimeType?.startsWith('image/')) {
      return <Image className="w-8 h-8 text-green-600" />;
    }
    
    if (file.mimeType?.includes('pdf') || file.name.endsWith('.pdf')) {
      return <FileText className="w-8 h-8 text-red-600" />;
    }
    
    return <File className="w-8 h-8 text-gray-600" />;
  };

  const handleFileUpload = () => {
    if (!uploadFiles || uploadFiles.length === 0) return;

    Array.from(uploadFiles).forEach(file => {
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'file',
        size: formatFileSize(file.size),
        mimeType: file.type,
        uploadedBy: user?.name || '',
        uploadedAt: new Date(),
        patientId: selectedPatient || undefined,
        path: currentPath + file.name
      };
      
      setFiles(prev => [...prev, newFile]);
    });

    setShowUploadModal(false);
    setUploadFiles(null);
    setSelectedPatient('');
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FileItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName,
      type: 'folder',
      uploadedBy: user?.name || '',
      uploadedAt: new Date(),
      path: currentPath + newFolderName
    };

    setFiles(prev => [...prev, newFolder]);
    setShowCreateFolder(false);
    setNewFolderName('');
  };

  const deleteFile = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const downloadFile = (file: FileItem) => {
    // Simulate download
    alert(`Downloading ${file.name}`);
  };

  const openFolder = (folder: FileItem) => {
    setCurrentPath(folder.path + '/');
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/').filter(p => p);
    pathParts.pop();
    setCurrentPath('/' + pathParts.join('/') + (pathParts.length > 0 ? '/' : ''));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(p => p);
    const breadcrumbs = [{ name: 'Root', path: '/' }];
    
    let currentBreadcrumbPath = '/';
    parts.forEach(part => {
      currentBreadcrumbPath += part + '/';
      breadcrumbs.push({ name: part, path: currentBreadcrumbPath });
    });
    
    return breadcrumbs;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
          <p className="text-gray-600">Manage patient documents and lab files</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission('files', 'create') && (
            <>
              <button
                onClick={() => setShowCreateFolder(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>New Folder</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Files</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm">
        {getBreadcrumbs().map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <button
              onClick={() => setCurrentPath(crumb.path)}
              className="text-blue-600 hover:text-blue-800"
            >
              {crumb.name}
            </button>
            {index < getBreadcrumbs().length - 1 && (
              <span className="text-gray-400">/</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Patients</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.patientId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Files</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Files
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setUploadFiles(e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Associate with Patient (Optional)
                </label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.patientId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFiles(null);
                  setSelectedPatient('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                disabled={!uploadFiles || uploadFiles.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Folder</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter folder name..."
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateFolder(false);
                  setNewFolderName('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {currentPath === '/' ? 'Root Directory' : currentPath}
            </h3>
            {currentPath !== '/' && (
              <button
                onClick={navigateUp}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onDoubleClick={() => file.type === 'folder' ? openFolder(file) : downloadFile(file)}
            >
              <div className="flex flex-col items-center space-y-2">
                {getFileIcon(file)}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 truncate w-full" title={file.name}>
                    {file.name}
                  </p>
                  {file.size && (
                    <p className="text-xs text-gray-500">{file.size}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {file.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {file.type === 'file' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(file);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // View file logic
                        }}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="View"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </>
                  )}
                  {hasPermission('files', 'delete') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-8">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No files or folders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;