namespace EmployeeApi.Models;

public class Employee
{
    public required string Id { get; set; }
    public required string LastName { get; set; }
    public required string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public decimal DailyRate { get; set; }
    public required string WorkingDays { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class EmployeeDto
{
    public required string Id { get; set; }
    public required string LastName { get; set; }
    public required string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public decimal DailyRate { get; set; }
    public required string WorkingDays { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class CreateEmployeeDto
{
    public required string LastName { get; set; }
    public required string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public decimal DailyRate { get; set; }
    public required string WorkingDays { get; set; }
}

public class UpdateEmployeeDto
{
    public required string LastName { get; set; }
    public required string FirstName { get; set; }
    public string? MiddleName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public decimal DailyRate { get; set; }
    public required string WorkingDays { get; set; }
    public DateTime? EndDate { get; set; }
}

public class EmployeePageDto
{
    public List<EmployeeDto> Employees { get; set; } = new List<EmployeeDto>();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalRecords { get; set; }
}

public class EmployeePageResponseDto
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}