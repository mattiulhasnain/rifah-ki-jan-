# LIMS - Rifah Laboratories Management System

## 🏥 Ultimate Laboratory Management System

A comprehensive, modern laboratory management system built for **Rifah Laboratories** with advanced features for patient management, test processing, reporting, and business analytics.

## ✨ Features

### 🔐 **Authentication & User Management**
- Multi-role user system (Admin, Manager, Receptionist, Technician, Pathologist, Accountant, Lab Helper)
- Role-based permissions and access control
- User creation and management system
- Secure login with session management

### 👥 **Patient Management**
- Complete patient registration and profiles
- Medical history and allergy tracking
- Visit history and billing records
- Patient search and filtering

### 👨‍⚕️ **Doctor Management**
- Doctor profiles with specializations
- Commission tracking and management
- Referral analytics and reporting
- Hospital/clinic associations

### 🧪 **Test Management**
- Comprehensive test catalog with categories
- Pricing and reference range management
- Sample type specifications
- Test activation/deactivation

### 📋 **Rate List Management**
- Multiple rate lists with effective dates
- Bulk test pricing updates
- Import/export functionality
- Rate list versioning

### 🧾 **Invoice Management**
- Professional invoice generation
- Multiple payment methods
- Discount management
- Invoice locking and security
- PDF generation with laboratory branding

### 📊 **Report Management**
- Digital lab report creation
- Template-based reporting
- Result entry and validation
- Critical value alerts
- Pathologist verification workflow
- PDF reports with laboratory header

### 📝 **Template Management**
- Customizable report templates
- HTML-based template editor
- Template locking and version control
- Category-based organization

### 📅 **Appointment Management**
- Patient appointment scheduling
- Time slot management
- Appointment status tracking
- Reminder system

### 📦 **Stock Management**
- Inventory tracking and management
- Low stock alerts
- Expiry date monitoring
- Stock transactions (in/out)
- Vendor management

### 💰 **Expense Management**
- Expense categorization and tracking
- Payment method recording
- Recurring expense management
- Financial reporting

### 🎯 **Quality Control**
- QC record management
- Control level tracking
- Instrument calibration
- Quality metrics monitoring

### 📈 **Analytics & Reporting**
- Revenue and profit analytics
- Patient growth trends
- Test volume analysis
- Doctor performance metrics
- Interactive charts and graphs

### 📁 **File Management**
- Document storage and organization
- Patient file associations
- File upload and download
- Folder structure management

### 🔔 **Notification Center**
- Real-time notifications
- Priority-based alerts
- Notification preferences
- System alerts and reminders

### 👥 **Staff Management**
- Employee profiles and roles
- Permission management
- Staff activity tracking
- Department organization

### 🔍 **Audit Logs**
- Complete activity tracking
- User action logging
- System security monitoring
- Audit trail reporting

### ⚙️ **Settings & Configuration**
- Laboratory information management
- Theme customization (Light/Dark/Auto)
- Database configuration
- Backup and restore functionality
- System preferences

### 💾 **Backup Management**
- Automated backup scheduling
- Manual backup creation
- Backup restoration
- Data export/import

## 🚀 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF + html2canvas
- **Forms**: React Hook Form + Yup validation
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Code Quality**: ESLint + TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mattiulhasnain/LIMS.git
   cd LIMS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔑 Demo Accounts

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | `admin` | `password` | Full system access |
| Receptionist | `receptionist` | `password` | Patient registration & invoicing |
| Technician | `technician` | `password` | Test processing & reports |
| Pathologist | `pathologist` | `password` | Report verification |
| Manager | `manager` | `password` | Management oversight |

## 🏥 Laboratory Information

**Rifah Laboratories**
- **Address**: 170- Hali Road Tehseel Chowk Sahiwal
- **Phone**: 0404-220285
- **WhatsApp**: 0320-3655101
- **Email**: info@rifahlabs.com
- **Website**: www.rifahlabs.com

## 📋 Features Overview

### 🎨 **Modern UI/UX**
- Clean, professional interface
- Responsive design for all devices
- Dark/Light theme support
- Intuitive navigation and workflows

### 🔒 **Security Features**
- Role-based access control
- Secure authentication system
- Audit logging for all actions
- Data encryption and protection

### 📊 **Business Intelligence**
- Comprehensive analytics dashboard
- Financial reporting and insights
- Performance metrics and KPIs
- Data visualization with charts

### 🖨️ **Professional Documents**
- Branded PDF reports and invoices
- Laboratory header integration
- Professional formatting
- Print-ready documents

### ⚡ **Performance**
- Fast, responsive interface
- Optimized data handling
- Efficient search and filtering
- Real-time updates

## 🛠️ Development

### **Project Structure**
```
src/
├── components/          # React components
│   ├── Analytics/       # Analytics and reporting
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Main dashboard
│   ├── Layout/         # Layout components
│   └── ...             # Feature-specific components
├── context/            # React context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── ...
```

### **Key Technologies**
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **PDF Generation**: jsPDF with custom templates
- **Charts**: Recharts for analytics
- **Icons**: Lucide React icon library

## 📄 License

This project is proprietary software developed for Rifah Laboratories.

## 👨‍💻 Developer

Developed by **Matti Ul Has Nain** for Rifah Laboratories

---

**© 2025 Rifah Laboratories. All rights reserved.**