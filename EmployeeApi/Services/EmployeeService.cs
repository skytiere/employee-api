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

    private static EmployeeDto MapToDto(Employee employee) =>
        new EmployeeDto
        {
            Id = employee.Id,
            Name = employee.Name,
            DateOfBirth = employee.DateOfBirth,
            DailyRate = employee.DailyRate,
            WorkingDays = employee.WorkingDays,
            CreatedAt = employee.CreatedAt,
            UpdatedAt = employee.UpdatedAt
        };

    public async Task<List<EmployeeDto>> GetAll()
    {
        var employees = await _context.Employees.ToListAsync();

        if (!employees.Any())
        {
            _logger.LogWarning("No employees found.");
            throw new KeyNotFoundException("No employees found.");
        }

        return employees.Select(e => MapToDto(e)).ToList();
    }

    public async Task<EmployeeDto> GetById(string id)
    {
        Employee? employee = await _context.Employees.FindAsync(id);

        if (employee is null)
        {
            _logger.LogWarning($"Employee with ID: {id} not found.");
            throw new KeyNotFoundException($"Employee with ID: {id} not found.");
        }

        return MapToDto(employee);
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
        await _context.SaveChangesAsync();

        return MapToDto(employee);
    }

    public async Task<EmployeeDto> Update(string id, UpdateEmployeeDto updateEmployeeDto)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee is null)
        {
            _logger.LogWarning($"Employee with ID: {id} not found.");
            throw new KeyNotFoundException($"Employee with ID: {id} not found.");
        }

        employee.Name = updateEmployeeDto.Name;
        employee.DateOfBirth = updateEmployeeDto.DateOfBirth;
        employee.DailyRate = updateEmployeeDto.DailyRate;
        employee.WorkingDays = updateEmployeeDto.WorkingDays;
        employee.UpdatedAt = DateTime.UtcNow;

        _context.Employees.Update(employee);
        await _context.SaveChangesAsync();

        return MapToDto(employee);
    }

    public async Task Delete(string id)
    {
        Employee? employee = _context.Employees.Find(id);

        if (employee is null)
        {
            _logger.LogWarning($"Employee with ID: {id} not found.");
            throw new KeyNotFoundException($"Employee with ID: {id} not found.");
        }

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
    }
}