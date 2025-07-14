import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  isLoading: boolean;
  hasPermission: (module: string, action: string) => boolean;
}

interface CreateUserData {
  username: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo users with comprehensive permissions
const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@lab.com',
    role: 'admin',
    name: 'System Administrator',
    permissions: [
      { module: 'all', actions: ['view', 'create', 'edit', 'delete', 'export', 'import', 'lock', 'unlock', 'verify'] }
    ],
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: '2',
    username: 'receptionist',
    email: 'reception@lab.com',
    role: 'receptionist',
    name: 'Reception Staff',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'patients', actions: ['view', 'create', 'edit'] },
      { module: 'doctors', actions: ['view'] },
      { module: 'tests', actions: ['view'] },
      { module: 'rates', actions: ['view'] },
      { module: 'invoices', actions: ['view', 'create'] },
      { module: 'reports', actions: ['view'] },
      { module: 'appointments', actions: ['view', 'create', 'edit'] },
      { module: 'files', actions: ['view', 'create'] },
      { module: 'notifications', actions: ['view'] }
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
      { module: 'dashboard', actions: ['view'] },
      { module: 'patients', actions: ['view'] },
      { module: 'tests', actions: ['view'] },
      { module: 'reports', actions: ['view', 'create', 'edit'] },
      { module: 'templates', actions: ['view', 'create', 'edit'] },
      { module: 'stock', actions: ['view', 'edit'] },
      { module: 'quality', actions: ['view', 'create', 'edit'] },
      { module: 'files', actions: ['view', 'create'] },
      { module: 'notifications', actions: ['view'] }
    ],
    isActive: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    username: 'pathologist',
    email: 'pathologist@lab.com',
    role: 'pathologist',
    name: 'Dr. Pathologist',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'patients', actions: ['view'] },
      { module: 'tests', actions: ['view', 'create', 'edit'] },
      { module: 'reports', actions: ['view', 'create', 'edit', 'verify'] },
      { module: 'templates', actions: ['view', 'create', 'edit', 'lock', 'unlock'] },
      { module: 'quality', actions: ['view', 'create', 'edit'] },
      { module: 'analytics', actions: ['view'] },
      { module: 'files', actions: ['view', 'create'] },
      { module: 'notifications', actions: ['view'] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '5',
    username: 'manager',
    email: 'manager@lab.com',
    role: 'manager',
    name: 'Lab Manager',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'patients', actions: ['view', 'edit'] },
      { module: 'doctors', actions: ['view', 'create', 'edit'] },
      { module: 'tests', actions: ['view', 'create', 'edit'] },
      { module: 'rates', actions: ['view', 'create', 'edit'] },
      { module: 'invoices', actions: ['view', 'edit'] },
      { module: 'reports', actions: ['view'] },
      { module: 'stock', actions: ['view', 'create', 'edit'] },
      { module: 'expenses', actions: ['view', 'create', 'edit'] },
      { module: 'analytics', actions: ['view', 'export'] },
      { module: 'staff', actions: ['view', 'create', 'edit'] },
      { module: 'appointments', actions: ['view', 'create', 'edit'] },
      { module: 'files', actions: ['view', 'create', 'edit'] },
      { module: 'notifications', actions: ['view'] },
      { module: 'backup', actions: ['view', 'create'] }
    ],
    isActive: true,
    createdAt: new Date('2024-01-10')
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('lab_user');
    const storedUsers = localStorage.getItem('lab_users');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem('lab_users', JSON.stringify(DEMO_USERS));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser && password === 'password') {
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      setUser(updatedUser);
      localStorage.setItem('lab_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const createUser = async (userData: CreateUserData): Promise<boolean> => {
    // Check if username or email already exists
    const existingUser = users.find(u => 
      u.username === userData.username || u.email === userData.email
    );
    
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: userData.username,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      permissions: getDefaultPermissions(userData.role),
      isActive: true,
      createdAt: new Date()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('lab_users', JSON.stringify(updatedUsers));
    
    return true;
  };

  const getDefaultPermissions = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [{ module: 'all', actions: ['view', 'create', 'edit', 'delete', 'export', 'import', 'lock', 'unlock', 'verify'] as const }];
      case 'manager':
        return [
          { module: 'dashboard', actions: ['view'] as const },
          { module: 'analytics', actions: ['view', 'export'] as const },
          { module: 'staff', actions: ['view', 'create', 'edit'] as const },
          { module: 'patients', actions: ['view', 'edit'] as const },
          { module: 'doctors', actions: ['view', 'create', 'edit'] as const },
          { module: 'tests', actions: ['view', 'create', 'edit'] as const },
          { module: 'stock', actions: ['view', 'create', 'edit'] as const },
          { module: 'expenses', actions: ['view', 'create', 'edit'] as const }
        ];
      case 'receptionist':
        return [
          { module: 'patients', actions: ['view', 'create', 'edit'] as const },
          { module: 'invoices', actions: ['view', 'create'] as const },
          { module: 'reports', actions: ['view'] as const },
          { module: 'appointments', actions: ['view', 'create', 'edit'] as const }
        ];
      case 'technician':
        return [
          { module: 'reports', actions: ['view', 'create', 'edit'] as const },
          { module: 'tests', actions: ['view'] as const },
          { module: 'stock', actions: ['view', 'edit'] as const },
          { module: 'quality', actions: ['view', 'create', 'edit'] as const }
        ];
      case 'pathologist':
        return [
          { module: 'reports', actions: ['view', 'create', 'edit', 'verify'] as const },
          { module: 'templates', actions: ['view', 'create', 'edit', 'lock', 'unlock'] as const },
          { module: 'patients', actions: ['view'] as const },
          { module: 'tests', actions: ['view', 'create', 'edit'] as const }
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lab_user');
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Check specific permissions
    return user.permissions.some(permission => 
      (permission.module === module || permission.module === 'all') &&
      permission.actions.includes(action as any)
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, createUser, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};