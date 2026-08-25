# SmartEntry

SmartEntry is a full-stack visitor and security management platform designed to help organizations manage visitor access, incidents, users, reports, notifications, and operational security information through a centralized system.

The project combines a Django REST API backend with a Vite-powered frontend and provides role-based functionality for managing day-to-day organizational access and security workflows.

## Features

### Authentication & User Management

* JWT-based authentication
* Role-based user access
* User profile management
* User administration
* Organization administration

### Visitor Management

* Register visitors
* View and manage visitor records
* Track visitor status
* Search and filter visitor information
* Maintain visitor history

### Incident Management

* Create and manage incident records
* Track incident status and details
* Centralize security-related reporting

### Dashboard & Analytics

* Operational dashboard
* Visitor statistics
* Incident statistics
* Administrative overview
* Analytics views for organizational activity

### Reports

* Generate and manage operational reports
* Centralized reporting interface
* Support for security and visitor-related data

### Notifications

* Application notification management
* Notifications related to system activity and operational events

### Administration

* User management
* Organization management
* Django administrative interface
* Organization-specific administration dashboard

## Tech Stack

### Frontend

* JavaScript
* HTML5
* CSS3
* Bootstrap 5
* Bootstrap Icons
* Vite
* Axios
* SweetAlert2

### Backend

* Python
* Django
* Django REST Framework
* Django REST Framework SimpleJWT
* Django CORS Headers
* Gunicorn
* WhiteNoise

### Database

* PostgreSQL
* SQLite for local development/testing where applicable

### Development & Deployment

* Git
* GitHub
* VS Code
* Render
* Environment-based configuration

## Architecture

SmartEntry follows a client-server architecture:

```text
Frontend
HTML / CSS / JavaScript / Bootstrap
        |
        | Axios HTTP Requests
        v
Django REST API
        |
        | Authentication / Business Logic
        v
PostgreSQL Database
```

The frontend communicates with the backend through REST API endpoints.

The Django backend contains separate application modules for:

```text
users
visitors
incidents
reports
notifications
core / dashboard
```

## Main API Structure

```text
/api/auth/              Authentication and user functionality
/api/                   Visitor and incident functionality
/api/dashboard/         Dashboard data
/api/reports/           Reporting functionality
/api/notifications/     Notifications
/admin/                  Django administration
/admin/organization-dashboard/
```

## Project Structure

```text
SmartEntry/
│
├── backend/
│   └── config/
│       ├── config/
│       ├── core/
│       ├── incidents/
│       ├── notifications/
│       ├── reports/
│       ├── users/
│       ├── visitors/
│       ├── manage.py
│       └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── utils/
│   │   └── style.css
│   ├── package.json
│   └── vite.config.js
│
├── docs/
├── DEPLOYMENT.md
├── render.yaml
└── .gitignore
```

## Frontend Pages

The system includes interfaces for:

* Dashboard
* Admin Dashboard
* Visitors
* Incidents
* Analytics
* Reports
* Organizations
* User Management
* Settings
* Intelligence

## Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/Chantal-Marissa-Pande/SmartEntry.git
cd SmartEntry
```

## Backend Setup

### 2. Navigate to the backend

```bash
cd backend/config
```

### 3. Create a virtual environment

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Create the backend environment file

Copy:

```text
.env.example
```

to:

```text
.env
```

Example:

```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=true
DB_PASSWORD=your-postgresql-password
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
DB_SSL_REQUIRED=false
```

For a hosted PostgreSQL database, configure `DATABASE_URL` instead.

### 6. Run database migrations

```bash
python manage.py migrate
```

### 7. Create an administrator account

```bash
python manage.py createsuperuser
```

### 8. Start the Django server

```bash
python manage.py runserver
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

## Frontend Setup

Open another terminal from the SmartEntry project root.

### 9. Navigate to the frontend

```bash
cd frontend
```

### 10. Install dependencies

```bash
npm install
```

### 11. Configure the frontend API URL

Copy:

```text
.env.example
```

to:

```text
.env
```

Use:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### 12. Start the frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Authentication

SmartEntry uses JWT authentication through Django REST Framework SimpleJWT.

Authenticated requests use access tokens to communicate with protected backend API endpoints.

## Database

SmartEntry is designed to use PostgreSQL for production environments.

Major data areas include:

* Users
* Organizations
* Visitors
* Incidents
* Notifications
* Reports
* User settings

## Deployment

The repository includes configuration for deployment using Render.

Production configuration supports:

* Gunicorn
* PostgreSQL
* Environment variables
* CORS configuration
* Static file handling using WhiteNoise

Refer to:

```text
DEPLOYMENT.md
```

for deployment-specific instructions.

## Project Goals

SmartEntry aims to:

* Replace manual visitor registration processes with a centralized digital system.
* Improve visibility of visitors entering and leaving an organization.
* Support security teams with incident tracking and reporting.
* Provide administrators with centralized user and organization management.
* Improve access to operational information through dashboards and analytics.
* Provide a scalable API-driven foundation for future integrations.

## Future Improvements

Potential future enhancements include:

* QR-code visitor passes
* Email and SMS notifications
* Advanced security analytics
* Visitor pre-registration
* ID document verification
* Access-control hardware integrations
* Mobile application support
* Cloud-based monitoring
* Advanced audit trails

## Author

**Chantal Marissa Pande**
