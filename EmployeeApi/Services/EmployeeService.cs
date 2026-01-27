using Microsoft.AspNetCore.Mvc;
using EmployeeApi.Models;
using EmployeeApi.Data;

namespace EmployeeApi.Services;

public class EmployeeService : Interface.IEmployeeService
{
    private readonly ILogger<EmployeeService> _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<EmployeeService>();
    private readonly EmployeeContext _context;

    public EmployeeService(EmployeeContext context)
    {
        _context = context;
    }

    public List<EmployeeDto> GetAll()
    {
        var employees = new List<EmployeeDto>();
        try
        {
            employees = _context.Employees.ToList();
        }
        catch (Exception)
        {
            _logger.LogError("An error occurred while retrieving employees from the database.");
            return new List<EmployeeDto>();
        }

        if (employees == null || employees.Count == 0)
        {
            _logger.LogWarning("No employees found in the database.");
            return new List<EmployeeDto>();
        }

        return employees.Select(e => new EmployeeDto
        {
            Id = e.Id,
            Name = e.Name,
            DateOfBirth = e.DateOfBirth,
            DailyRate = e.DailyRate,
            WorkingDays = e.WorkingDays,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        }).ToList();
    }

    public EmployeeDto GetById(string id)
    {
        Employee? employee;
        try
        {
            employee = _context.Employees.Find(id);
            if (employee == null)
            {
                _logger.LogWarning($"Employee with ID: {id} not found.");
                return null!;
            }
        }
        catch (Exception)
        {
            _logger.LogError($"An error occurred while retrieving employee with ID: {id} from the database.");
            return null!;
        }


        return new EmployeeDto
        {
            Id = employee.Id,
            Name = employee.Name,
            DateOfBirth = employee.DateOfBirth,
            DailyRate = employee.DailyRate,
            WorkingDays = employee.WorkingDays,
            CreatedAt = employee.CreatedAt,
            UpdatedAt = employee.UpdatedAt
        };
    }

    public EmployeeDto Create(CreateEmployeeDto createEmployeeDto)
    {
        Employee? employee;
        try
        {
            var randomNumber = new Random().Next(0, 100000).ToString("D5");
            var namePart = createEmployeeDto.Name.Substring(0, Math.Min(3, createEmployeeDto.Name.Length)).ToUpper();
            var dobPart = createEmployeeDto.DateOfBirth.ToString("ddMMMyyyy");
            var employeeId = $"{namePart}{randomNumber}{dobPart}";

            employee = new Employee
            {
                Id = employeeId,
                Name = createEmployeeDto.Name,
                DateOfBirth = createEmployeeDto.DateOfBirth,
                DailyRate = createEmployeeDto.DailyRate,
                WorkingDays = createEmployeeDto.WorkingDays,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            _context.SaveChanges();
        }
        catch (Exception)
        {
            _logger.LogError("An error occurred while creating a new employee in the database.");
            return null!;
        }

        return new EmployeeDto
        {
            Id = employee.Id,
            Name = employee.Name,
            DateOfBirth = employee.DateOfBirth,
            DailyRate = employee.DailyRate,
            WorkingDays = employee.WorkingDays,
            CreatedAt = employee.CreatedAt,
            UpdatedAt = employee.UpdatedAt
        };
    }

    public EmployeeDto Update(string id, UpdateEmployeeDto updateEmployeeDto)
    {
        try
        {
            var employee = _context.Employees.Find(id);
            if (employee == null)
            {
                _logger.LogWarning($"Employee with ID: {id} not found.");
                return null!;
            }

            employee.Name = updateEmployeeDto.Name;
            employee.DateOfBirth = updateEmployeeDto.DateOfBirth;
            employee.DailyRate = updateEmployeeDto.DailyRate;
            employee.WorkingDays = updateEmployeeDto.WorkingDays;
            employee.UpdatedAt = DateTime.UtcNow;

            _context.Employees.Update(employee);
            _context.SaveChanges();

            return new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                DateOfBirth = employee.DateOfBirth,
                DailyRate = employee.DailyRate,
                WorkingDays = employee.WorkingDays,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt
            };
        }
        catch (Exception)
        {
            _logger.LogError($"An error occurred while updating employee with ID: {id} in the database.");
            return null!;
        }
    }

    public void Delete(string id)
    {
        var employee = _context.Employees.Find(id);

        try
        {
            if (employee == null)
            {
                _logger.LogWarning($"Employee with ID: {id} not found.");
                return;
            }

            _context.Employees.Remove(employee);
            _context.SaveChanges();
        }
        catch (Exception)
        {
            _logger.LogError($"An error occurred while deleting employee with ID: {id} from the database.");
        }
    }
}