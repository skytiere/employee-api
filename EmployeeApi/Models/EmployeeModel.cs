namespace EmployeeApi.Models;

public class Employee
{
    public required string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int DailyRate { get; set; }
    public required string WorkingDays { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class EmployeeDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int DailyRate { get; set; }
    public required string WorkingDays { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateEmployeeDto
{
    public required string Name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int DailyRate { get; set; }
    public required string WorkingDays { get; set; }
}

public class UpdateEmployeeDto
{
    public required string Name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int DailyRate { get; set; }
    public required string WorkingDays { get; set; }
}