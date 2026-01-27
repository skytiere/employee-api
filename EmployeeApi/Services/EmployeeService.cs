using Microsoft.AspNetCore.Mvc;
using EmployeeApi.Models;
using EmployeeApi.Data;
using EmployeeApi.Interface;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Services;

public class EmployeeService : IEmployeeService
{

    private readonly ILogger<EmployeeService> _logger;
    private readonly EmployeeContext _context;

    public EmployeeService(ILogger<EmployeeService> logger, EmployeeContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<List<EmployeeDto>> GetAll()
    {
        var employees = await _context.Employees.ToListAsync();

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

    public async Task<EmployeeDto> GetById(string id)
    {
        Employee? employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            _logger.LogWarning($"Employee with ID: {id} not found.");
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

    public async Task<EmployeeDto> Create(CreateEmployeeDto createEmployeeDto)
    {
        var randomNumber = new Random().Next(0, 100000).ToString("D5");
        var namePart = createEmployeeDto.Name.Substring(0, Math.Min(3, createEmployeeDto.Name.Length)).ToUpper();
        var dobPart = createEmployeeDto.DateOfBirth.ToString("ddMMMyyyy");
        var employeeId = $"{namePart}{randomNumber}{dobPart}";

        Employee? employee = new Employee
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

        if (employee == null)
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

    public async Task<EmployeeDto> Update(string id, UpdateEmployeeDto updateEmployeeDto)
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

        if (employee == null)
        {
            _logger.LogError($"An error occurred while updating employee with ID: {id} in the database.");
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

    public async Task Delete(string id)
    {
        var employee = _context.Employees.Find(id);

        if (employee == null)
        {
            _logger.LogWarning($"Employee with ID: {id} not found.");
            return;
        }

        _context.Employees.Remove(employee);
        _context.SaveChanges();
    }
}