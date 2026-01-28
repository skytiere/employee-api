# Employee API - Local Setup Guide

## Prerequisites

Before setting up the Employee API locally, ensure you have the following installed:

- **.NET 8.0 SDK** or later
- **Node.js** (v18 or higher) - required for the frontend
- **Visual Studio Code** or **Visual Studio** (recommended)
- **Git** (for version control)
- **PostgreSQL** (if using database)

## Project Structure

```
etiqa-application/
├── EmployeeApi/
│   ├── Controllers/        # API Controllers
│   ├── Models/             # Data Models
│   ├── Services/           # Business Logic
│   ├── Data/               # Database Context
│   ├── Interface/          # Service Interfaces
│   ├── Views/              # Frontend (React + TypeScript + Vite)
│   ├── Program.cs          # Application Entry Point
│   ├── EmployeeApi.csproj  # Project File
│   ├── EmployeeApi.sln     # Solution File
│   └── appsettings.json    # Configuration
└── README.md
```

## Setup Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd etiqa-application
```

### 2. Navigate to the Employee API Directory

```bash
cd EmployeeApi
```

### 3. Restore .NET Dependencies

```bash
dotnet restore
```

This will restore all required NuGet packages defined in `EmployeeApi.csproj`.

### 4. Configure the Database (if applicable)

#### Update Connection String

Edit `appsettings.json` or `appsettings.Development.json` with your database connection:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=EmployeeDb;User Id=postgres;Password=your_password;"
  }
}
```

#### Run Database Migrations

```bash
dotnet ef database update
```

### 5. Setup Frontend Dependencies

Navigate to the frontend directory:

```bash
cd Views/EmployeeApp
npm install
```

### 6. Build the Application

```bash
dotnet build
```

### 7. Run the Application

```bash
dotnet run --launch-profile https
```

Or use the watch mode for development:

```bash
dotnet watch run
```

The API will be available at `https://localhost:7123` (or `http://localhost:5000` depending on your configuration).

## Configuration Files

### appsettings.json

Main configuration file for production/default settings.

### appsettings.Development.json

Development-specific settings (local database, logging levels, etc.).

### launchSettings.json

Configure launch profiles and environment variables.

## Frontend Development

To run the frontend with hot reload:

```bash
cd Views/EmployeeApp
npm run dev
```

This will start the Vite development server for React development.

## Troubleshooting

### Issue: Package restore fails

- Clear NuGet cache: `dotnet nuget locals all --clear`
- Retry restore: `dotnet restore`

### Issue: Database connection fails

- Verify PostgreSQL is running
- Check connection string in appsettings.json
- Ensure database user has proper permissions

### Issue: Frontend dependencies fail to install

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Common Commands

| Command            | Purpose                       |
| ------------------ | ----------------------------- |
| `dotnet run`       | Start the application         |
| `dotnet watch run` | Start with auto-reload        |
| `dotnet build`     | Build the solution            |
| `dotnet test`      | Run tests                     |
| `dotnet clean`     | Clean build artifacts         |
| `npm run dev`      | Run frontend dev server       |
| `npm run build`    | Build frontend for production |
