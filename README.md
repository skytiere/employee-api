# Employee Payroll API

Application Assessment for .Net Developer for Etiqa Technical Exam

## Tech Stack

### Backend

- **Framework**: ASP.NET Core 8
- **Language**: C#
- **ORM**: Entity Framework Core
- **Database**: PostgreSQL
- **API**: RESTful Web API

### Frontend

- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS
- **Testing**: ESLint

### Tools & Services

- **.NET CLI**: Project management and tooling
- **npm**: Frontend package management
- **Git**: Version control

## Project Structure

```
etiqa-application/
├── EmployeeApi/
│   ├── Controllers/        # API Controllers
│   ├── Models/             # Data Models
│   ├── Services/           # Business Logic
│   ├── Interface/          # Service Interfaces
│   ├── Data/               # Database Context
│   ├── Views/              # Frontend (React + TypeScript + Vite)
│   ├── Program.cs          # Entry Point
│   └── appsettings.json    # Configuration
└── details/
    └── 01_setup.md         # Complete Setup Guide
```

## API Endpoints

### Employee Management

| Method   | Endpoint             | Description         |
| -------- | -------------------- | ------------------- |
| `GET`    | `/api/employee`      | Get all employees   |
| `GET`    | `/api/employee/{id}` | Get employee by ID  |
| `POST`   | `/api/employee`      | Create new employee |
| `PUT`    | `/api/employee/{id}` | Update employee     |
| `DELETE` | `/api/employee/{id}` | Delete employee     |

## Documentation

In the details folder:

1. **Setup** - Complete local environment setup instructions
2. **Flow** - Application flow and architecture documentation
