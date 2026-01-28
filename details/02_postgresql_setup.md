# PostgreSQL Database Setup

## Prerequisites

### 1. Install PostgreSQL

Download and install from: https://www.postgresql.org/download/

**Or use Docker:**

```powershell
docker run --name employeeapi-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 2. Create Database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE employeeapi_db;
```

**Or via command line:**

```powershell
psql -U postgres -c "CREATE DATABASE employeeapi_db;"
```

## Setup Steps

### 1. Install EF Core Tools (if not already installed)

```powershell
dotnet tool install --global dotnet-ef
```

### 2. Add EF Core Design Package

```powershell
cd EmployeeApi
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### 3. Create Initial Migration

```powershell
dotnet ef migrations add InitialCreate
```

This creates migration files in a `Migrations` folder.

### 4. Apply Migration to Database

```powershell
dotnet ef database update
```

This creates all tables in PostgreSQL.

## Connection String

**Default (in appsettings.json):**

```
Server=localhost;Port=5432;Database=employeeapi_db;User Id=postgres;Password=admin;
```

**To change:**

- Update `appsettings.json` ConnectionStrings section
- Or set environment variable: `ConnectionStrings__DefaultConnection`

## Verify Setup

### Check if database is accessible:

```powershell
dotnet run
```

### Check tables in PostgreSQL:

```sql
\c employeeapi_db
\dt
```

You should see the `Employees` table.

## Seed Data

The seed data from `EmployeeContext.cs` will be automatically applied when migrations run.

## Development Workflow

After changing the `Employee` model:

```powershell
dotnet ef migrations add DescriptiveNameHere
dotnet ef database update
```

## Troubleshooting

**Connection failed:**

- Verify PostgreSQL is running: `pg_ctl status`
- Check port 5432 is not blocked
- Verify username/password in connection string

**Migration errors:**

- Delete `Migrations` folder and recreate: `dotnet ef migrations add InitialCreate`
- Reset database: `dotnet ef database drop` then `dotnet ef database update`

## Production Deployment

For production, update the connection string in `appsettings.json` or use environment variables:

```powershell
$env:ConnectionStrings__DefaultConnection="Server=prod-server;Port=5432;Database=employeeapi_db;User Id=appuser;Password=securepass;"
```
