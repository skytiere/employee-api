using EmployeeApi.Models;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("api/[controller]")]

public class EmployeeController : ControllerBase
{
    private readonly ILogger<EmployeeController> _logger;
    private readonly EmployeeService _employeeService;

    public EmployeeController(
        ILogger<EmployeeController> logger,
        EmployeeService employeeService)
    {
        _logger = logger;
        _employeeService = employeeService;
    }

    [HttpGet]
    public async Task<ActionResult<List<EmployeeDto>>> GetAllEmployees()
    {
        _logger.LogInformation("Fetching all employees.");

        try
        {
            var employees = _employeeService.GetAll();

            if (employees == null || employees.Count == 0)
            {
                _logger.LogWarning("No employees found.");
                return NotFound("No employees found.");
            }

            return Ok(employees);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching employees.");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDto>> GetEmployeeById(string id)
    {
        _logger.LogInformation($"Fetching employee with ID: {id}");

        try
        {
            var employee = _employeeService.GetById(id);
            if (employee == null)
            {
                _logger.LogWarning($"Employee with ID: {id} not found.");
                return NotFound($"Employee with ID: {id} not found.");
            }

            return Ok(employee);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while fetching employee with ID: {id}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> CreateEmployee([FromBody] CreateEmployeeDto createEmployeeDto)
    {
        _logger.LogInformation("Creating a new employee.");

        try
        {
            var createdEmployee = _employeeService.Create(createEmployeeDto);
            return CreatedAtAction(nameof(GetEmployeeById), new { id = createdEmployee.Id }, createdEmployee);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating a new employee.");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<EmployeeDto>> UpdateEmployee(string id, [FromBody] UpdateEmployeeDto updateEmployeeDto)
    {
        _logger.LogInformation($"Updating employee with ID: {id}");

        try
        {
            var updatedEmployee = _employeeService.Update(id, updateEmployeeDto);
            if (updatedEmployee == null)
            {
                _logger.LogWarning($"Employee with ID: {id} not found.");
                return NotFound($"Employee with ID: {id} not found.");
            }

            return Ok(updatedEmployee);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while updating employee with ID: {id}");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(string id)
    {
        _logger.LogInformation($"Deleting employee with ID: {id}");

        try
        {
            _employeeService.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while deleting employee with ID: {id}");
            return StatusCode(500, "Internal server error");
        }
    }
}