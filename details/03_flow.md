# Employee API - Flow & Architecture Guide

## Overview

The Employee API follows a **Service-Oriented Architecture**:

- **Controllers** - Handle HTTP requests/responses
- **Services** - Implement business logic
- **Data Context** - Manage database operations with Entity Framework Core
- **Models** - Define data structures

## Architecture Diagram

```
HTTP Request
    ↓
[Controller]
    ↓ (validates & routes)
[Service Layer]
    ↓ (business logic)
[Entity Framework Core]
    ↓ (data access)
[PostgreSQL Database]
    ↓
[Service Layer]
    ↓ (maps to DTO)
[Controller]
    ↓
HTTP Response
```

## API Endpoints

| Operation     | Method | Endpoint             | Purpose                    |
| ------------- | ------ | -------------------- | -------------------------- |
| **Query All** | GET    | `/api/employee`      | Retrieve all employees     |
| **Query One** | GET    | `/api/employee/{id}` | Retrieve specific employee |
| **Create**    | POST   | `/api/employee`      | Add new employee           |
| **Update**    | PUT    | `/api/employee/{id}` | Modify employee data       |
| **Delete**    | DELETE | `/api/employee/{id}` | Remove employee            |

---

## Data Models

### Employee Model

```csharp
public class Employee
{
    public string Id { get; set; }              // Unique identifier (e.g., "JOH-01234-05JAN1990")
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public decimal DailyRate { get; set; }      // Rate per working day
    public string WorkingDays { get; set; }     // e.g., "Monday,Tuesday,Wednesday,Thursday,Friday"
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }      // Null if employee is active
}
```

### Employee ID Generation

The employee ID is automatically generated using the format:

```
[FIRST 3 LETTERS OF LASTNAME]-[5-DIGIT RANDOM NUMBER]-[DDMMMYYYY DATE OF BIRTH]
```

**Example:** `JOH-42857-05JAN1990`

---

## CRUD Operations

### 1. QUERY DATA (Get Employee/s)

#### Get All Employees

**Endpoint:** `GET /api/employee`

**Flow:**

```
1. HTTP Request arrives at EmployeeController.GetAllEmployees()
2. Controller calls employeeService.GetAll()
3. Service executes: await _context.Employees.ToListAsync()
4. Entity Framework queries PostgreSQL database
5. Service maps Employee objects to EmployeeDto objects
6. Controller returns 200 OK with list of employees
```

**Code Example:**

```csharp
// Service Layer
public async Task<List<EmployeeDto>> GetAll()
{
    // Query all employees from database
    var employees = await _context.Employees.ToListAsync();

    // Map to DTOs and return
    return employees.Select(e => MapToDto(e)).ToList();
}

// Mapping helper
private static EmployeeDto MapToDto(Employee employee) =>
    new EmployeeDto
    {
        Id = employee.Id,
        LastName = employee.LastName,
        FirstName = employee.FirstName,
        MiddleName = employee.MiddleName,
        DateOfBirth = employee.DateOfBirth,
        DailyRate = employee.DailyRate,
        WorkingDays = employee.WorkingDays,
        CreatedAt = employee.CreatedAt,
        UpdatedAt = employee.UpdatedAt,
        StartDate = employee.StartDate,
        EndDate = employee.EndDate
    };
```

#### Get Employee by ID

**Endpoint:** `GET /api/employee/{id}`

**Flow:**

```
1. HTTP Request arrives at EmployeeController.GetEmployeeById(id)
2. Controller calls employeeService.GetById(id)
3. Service executes: await _context.Employees.FindAsync(id)
4. Entity Framework queries database by primary key
5. Service checks if employee exists
6. If not found, throws KeyNotFoundException
7. If found, maps Employee to EmployeeDto
8. Controller returns 200 OK with employee data
```

**Code Example:**

```csharp
// Service Layer
public async Task<EmployeeDto> GetById(string id)
{
    // Query employee by primary key
    Employee? employee = await _context.Employees.FindAsync(id);

    // Handle not found
    if (employee is null)
    {
        _logger.LogWarning($"Employee with ID: {id} not found.");
        throw new KeyNotFoundException($"Employee with ID: {id} not found.");
    }

    // Map and return
    return MapToDto(employee);
}
```

---

### 2. ADD DATA (Create Employee)

**Endpoint:** `POST /api/employee`

**Flow:**

```
1. HTTP POST request with CreateEmployeeDto arrives
2. Controller validates the model
3. Service generates unique Employee ID:
   - Takes first 3 letters of LastName: "SMI"
   - Generates random 5-digit number: "73291"
   - Formats DOB as DDMMMYYYY: "15JUN1995"
   - Result: "SMI-73291-15JUN1995"
4. Creates new Employee entity
5. Entity Framework adds to _context.Employees
6. Saves to PostgreSQL database
7. Returns 201 Created with new employee data
```

**Code Example:**

```csharp
// Service Layer
public async Task<EmployeeDto> Create(CreateEmployeeDto createEmployeeDto)
{
    // Step 1: Extract first 3 letters of last name
    var namePart = createEmployeeDto.LastName
        .Substring(0, Math.Min(3, createEmployeeDto.LastName.Length))
        .ToUpper()
        .Trim();

    // Pad with asterisks if less than 3 letters
    if (namePart.Length < 3)
    {
        namePart = namePart.PadRight(3, '*');
    }

    // Step 2: Generate random 5-digit number
    var randomNumber = new Random().Next(0, 100000).ToString("D5");

    // Step 3: Format date as DDMMMYYYY
    var dobPart = createEmployeeDto.DateOfBirth.ToString("ddMMMyyyy").ToUpper();

    // Step 4: Compose Employee ID
    var employeeId = $"{namePart}-{randomNumber}-{dobPart}";

    // Step 5: Create new Employee entity
    var employee = new Employee
    {
        Id = employeeId,
        LastName = createEmployeeDto.LastName,
        FirstName = createEmployeeDto.FirstName,
        MiddleName = createEmployeeDto.MiddleName,
        DateOfBirth = createEmployeeDto.DateOfBirth,
        DailyRate = createEmployeeDto.DailyRate,
        WorkingDays = createEmployeeDto.WorkingDays,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        StartDate = DateTime.UtcNow,
        EndDate = null
    };

    // Step 6: Add to context and save
    _context.Employees.Add(employee);
    await _context.SaveChangesAsync();

    // Step 7: Return mapped DTO
    return MapToDto(employee);
}
```

---

### 3. UPDATE DATA (Update Employee)

**Endpoint:** `PUT /api/employee/{id}`

**Flow:**

```
1. HTTP PUT request arrives with employee ID
2. Service finds employee by ID
3. Updates fields (not ID, CreatedAt)
4. Sets UpdatedAt to current time
5. Entity Framework updates the record
6. Saves changes to PostgreSQL
7. Returns updated employee data
```

**Code Example:**

```csharp
// Service Layer
public async Task<EmployeeDto> Update(string id, UpdateEmployeeDto updateEmployeeDto)
{
    // Step 1: Find employee
    var employee = await _context.Employees.FindAsync(id);

    // Handle not found
    if (employee is null)
    {
        _logger.LogWarning($"Employee with ID: {id} not found.");
        throw new KeyNotFoundException($"Employee with ID: {id} not found.");
    }

    // Step 2: Update fields
    employee.LastName = updateEmployeeDto.LastName;
    employee.FirstName = updateEmployeeDto.FirstName;
    employee.MiddleName = updateEmployeeDto.MiddleName;
    employee.DateOfBirth = updateEmployeeDto.DateOfBirth;
    employee.DailyRate = updateEmployeeDto.DailyRate;
    employee.WorkingDays = updateEmployeeDto.WorkingDays;
    employee.UpdatedAt = DateTime.UtcNow;
    employee.EndDate = updateEmployeeDto.EndDate;

    // Step 3: Mark as modified and save
    _context.Employees.Update(employee);
    await _context.SaveChangesAsync();

    // Step 4: Return updated DTO
    return MapToDto(employee);
}
```

---

### 4. REMOVE DATA (Delete Employee)

**Endpoint:** `DELETE /api/employee/{id}`

**Flow:**

```
1. HTTP DELETE request arrives with employee ID
2. Service finds employee by ID
3. Removes employee from context
4. Saves changes (record deleted from database)
5. Returns 204 No Content
```

**Code Example:**

```csharp
// Service Layer
public async Task Delete(string id)
{
    // Step 1: Find employee
    Employee? employee = _context.Employees.Find(id);

    // Handle not found
    if (employee is null)
    {
        _logger.LogWarning($"Employee with ID: {id} not found.");
        throw new KeyNotFoundException($"Employee with ID: {id} not found.");
    }

    // Step 2: Remove and save
    _context.Employees.Remove(employee);
    await _context.SaveChangesAsync();
}
```

---

## 5. COMPUTE TAKE HOME PAY

### Overview

Take-home pay calculation is based on:

- **Daily Rate**: The rate per working day
- **Working Days**: The days the employee works (e.g., Monday-Friday)
- **Period**: Number of months/days worked

### Take-Home Pay Formula

```
Monthly Take Home Pay = Daily Rate × Number of Working Days in Month
```

### Flow

```
1. Get employee by ID
2. Parse employee's working days (e.g., "Monday,Tuesday,Wednesday,Thursday,Friday")
3. Count the number of working days in the specified month/period
4. For each day in the period:
   - Check if the day is one of the employee's working days
   - Skip if employee hasn't started yet (StartDate)
   - Skip if employee has ended (EndDate)
   - If it matches working days, increment counter
5. Calculate: Daily Rate × Total Working Days Count
6. Return the computed take-home pay amount
```
