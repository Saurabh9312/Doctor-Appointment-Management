# Doctor Appointment System

A modern, full-stack web application for managing doctor appointments with role-based access control for patients, doctors, and administrators. Features a beautiful dark-themed UI with cyan-teal water colors, collapsible sidebar navigation, AI chatbot support, and comprehensive login tracking system.

## ✨ Features

### For Patients
- User registration and secure authentication
- Complete profile setup with contact information
- Browse and filter available appointment slots
- Book appointments with preferred doctors
- View comprehensive appointment history and status tracking

### For Doctors
- Professional registration and authentication
- Profile setup with medical specialization
- Create and manage flexible appointment slots
- View and track patient appointments
- Update appointment status (Booked → Visited)
- Real-time appointment dashboard

### For Administrators
- Complete system overview and monitoring
- View all appointments with detailed patient and doctor information
- Monitor appointment statistics and analytics
- System-wide data management
- CRUD operations for doctors and patients

### UI/UX Features
- Modern dark theme with cyan-teal water color scheme
- Collapsible sidebar navigation (260px ↔ 70px)
- Responsive design for mobile and desktop
- AI-powered chatbot for user support
- Smooth animations and transitions
- Hover tooltips on collapsed sidebar
- Custom scrollbar with gradient styling
- Role-based color coding
- Dark mode optimized for reduced eye strain

## 🛠️ Technology Stack

### Backend
- **Framework**: Django REST Framework
- **Database**: SQLite
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Task Queue**: Celery
- **Message Broker**: Redis
- **CORS**: django-cors-headers
- **Language**: Python 3.x
- **Login Tracking**: Custom LoginInfo model with IP and user agent tracking

### Frontend
- **Framework**: React 18 with Vite
- **UI Library**: Material-UI (MUI) v5
- **Theme Mode**: Dark mode with custom palette
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with dark theme and water color gradients
- **Icons**: Material Icons

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file (`.env`) in backend directory:
```bash
GROQ_API_KEY=your_groq_api_key
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_email_password
```

5. Run database migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create a superuser (optional for admin access):
```bash
python manage.py createsuperuser
```

7. Start Redis server (for Celery tasks):
```bash
# On Windows (download Redis for Windows)
redis-server

# On Linux/Mac
redis-server
```

8. Start Celery worker (in a separate terminal):
```bash
celery -A backend worker -l info
```

9. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/signup/` - Register new user (logs registration as login event)
- `POST /api/login/` - User login (returns JWT tokens and logs login info)

### Doctor Endpoints
- `POST /api/doctor/create/` - Create doctor profile
- `GET /api/doctors/` - List all doctors
- `POST /api/slots/create/` - Create appointment slot
- `GET /api/doctor/slots/` - Get doctor's available slots
- `GET /api/doctor/appointments/` - Get doctor's appointments

### Patient Endpoints
- `POST /api/patient/create/` - Create patient profile
- `GET /api/patient/appointments/` - Get patient's appointments

### Appointment Endpoints
- `GET /api/slots/` - Get all available slots
- `POST /api/appointments/book/` - Book an appointment
- `PATCH /api/appointments/{id}/status/` - Update appointment status

### Admin Endpoints
- `GET /api/admin/appointments/` - Get all appointments (admin only)
- `GET /api/admin/doctors/` - Manage doctors (CRUD operations)
- `GET /api/admin/patients/` - Manage patients (CRUD operations)
- `GET /api/login-history/` - View login history (users see own, admins see all)
- `GET /api/login-stats/` - Get login statistics (admin only)

### AI Chatbot
- `POST /api/bot/chat/` - Chat with AI assistant

## 🔐 Security Features

### Login Tracking System
- Automatic login information tracking for both registration and login
- IP address and user agent logging
- Login type distinction (registration vs regular login)
- Admin dashboard for monitoring login activities
- Login statistics and analytics
- User-specific login history view

### Authentication
- JWT token-based authentication
- Secure password hashing
- Role-based access control (RBAC)
- Protected API endpoints
- Token refresh mechanism

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Patient** | Register, create profile, browse slots, book appointments, view history |
| **Doctor** | Register, create profile, manage slots, view appointments, update status |
| **Admin** | View all appointments, monitor statistics, system management |

## 📋 Usage Flow

1. **Registration**
   - User signs up with username, email, password, and role selection
   - Email verification (if configured)

2. **Profile Setup**
   - Doctors: Add medical specialization
   - Patients: Add phone number and contact details

3. **Dashboard Access**
   - Role-specific dashboards with relevant statistics
   - Collapsible sidebar with quick navigation

4. **Appointment Management**
   - Doctors create time slots with availability
   - Patients browse and book from available slots
   - Doctors update status after consultation
   - Admins monitor all system activities

## 📁 Project Structure

```
Doctor Appointment/
├── backend/
│   ├── backend/              # Django project settings
│   │   ├── settings.py       # Main settings with dark theme config
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── doctorAppointment/    # Main application
│   │   ├── models.py         # Database models (User, Doctor, Patient, LoginInfo)
│   │   ├── serializers.py    # API serializers
│   │   ├── tasks.py          # Celery tasks (email, login logging)
│   │   ├── viewss/           # API views organized by feature
│   │   │   ├── auth_views.py          # Authentication with login tracking
│   │   │   ├── login_history.py       # Login history endpoints
│   │   │   ├── doctor_registration.py
│   │   │   ├── patient_registration.py
│   │   │   ├── slot_management.py
│   │   │   ├── appointment_booking.py
│   │   │   └── admin_management.py
│   │   ├── chatbot.py        # AI chatbot implementation
│   │   ├── admin.py          # Django admin configuration
│   │   └── urls.py           # URL routing
│   ├── db.sqlite3            # SQLite database
│   ├── manage.py             # Django management script
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Layout/       # Layout components
│   │   │   │   ├── Navbar.jsx     # Cyan-teal gradient header
│   │   │   │   ├── Sidebar.jsx    # Dark themed collapsible sidebar
│   │   │   │   └── Layout.jsx     # Main layout with dark gradient
│   │   │   ├── Common/       # Common components (Alerts, Loaders)
│   │   │   └── ChatWidget.jsx     # Dark themed AI chatbot
│   │   ├── modules/          # Feature modules
│   │   │   ├── Auth/         # Authentication pages
│   │   │   ├── Patient/      # Patient-specific pages
│   │   │   ├── Doctor/       # Doctor-specific pages
│   │   │   ├── Admin/        # Admin dashboard
│   │   │   └── Common/       # Common pages
│   │   ├── reducer/          # Redux slices
│   │   ├── routes/           # Route components
│   │   ├── api_client/       # API client configuration
│   │   ├── store/            # Redux store
│   │   ├── App.jsx           # Main app with dark theme configuration
│   │   ├── App.css           # Global styles with dark theme
│   │   ├── index.css         # Base styles with custom scrollbar
│   │   └── main.jsx          # Entry point
│   ├── package.json          # NPM dependencies
│   └── vite.config.js        # Vite configuration
└── README.md
```

## 🎨 UI Theme & Design

### Dark Mode Theme
- **Mode**: Dark
- **Primary Color**: Cyan (#00bcd4)
- **Secondary Color**: Teal (#26a69a)
- **Background**: 
  - Default: Deep blue (#0a1929)
  - Paper: Dark slate (#1e2a38)
- **Text Colors**:
  - Primary: Light blue (#e3f2fd)
  - Secondary: Gray blue (#b0bec5)
- **Success**: Fresh green (#66bb6a)
- **Warning**: Warm orange (#ffa726)

### Component Styling
- **Navbar**: Cyan-teal gradient header (#00bcd4 → #26a69a)
- **Sidebar**: Dark background with cyan accents and border
- **Cards**: Dark paper with cyan border and glow on hover
- **Buttons**: Cyan-teal gradient with hover effects
- **TextFields**: Semi-transparent background with cyan focus
- **Tables**: Cyan-teal gradient headers
- **Scrollbar**: Cyan-teal gradient thumb on dark track (12px width)
- **ChatWidget**: Dark themed with cyan user messages

### Design Features
- Water-inspired color palette
- Smooth gradient transitions
- Custom scrollbar styling (Chrome/Firefox compatible)
- Responsive dark theme across all components
- Optimized for reduced eye strain
- Consistent color scheme throughout the application

## 🔧 Development

### Code Quality
- Clean, modular component structure
- Proper error handling and validation
- Responsive design patterns
- Consistent code formatting
- Single-line comments where necessary

### Best Practices
- Role-based access control (RBAC)
- JWT token authentication
- Redux state management
- Material-UI dark theme customization
- Reusable components
- Login tracking and security monitoring
- Asynchronous task processing with Celery

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and queries, use the built-in AI chatbot or contact the development team.

---

**Made with ❤️ using React and Django**