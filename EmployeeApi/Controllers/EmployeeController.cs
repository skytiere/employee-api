using EmployeeApi.Models;
using Microsoft.AspNetCore.Mvc;
using EmployeeApi.Interface;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("api/employee")]

public class EmployeeController : ControllerBase
{
    private readonly ILogger<EmployeeController> _logger;
    private readonly IEmployeeService _employeeService;

    public EmployeeController(
        ILogger<EmployeeController> logger,
        IEmployeeService employeeService)
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
            var result = await _employeeService.GetAll();

            return Ok(result);
        }
        catch (KeyNotFoundException notFoundEx)
        {
            _logger.LogWarning(notFoundEx.Message);
            return NotFound(notFoundEx.Message);
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
            var result = await _employeeService.GetById(id);

            return Ok(result);
        }
        catch (KeyNotFoundException notFoundEx)
        {
            _logger.LogWarning(notFoundEx.Message);
            return NotFound(notFoundEx.Message);
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
            var createdEmployee = await _employeeService.Create(createEmployeeDto);
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
            var result = await _employeeService.Update(id, updateEmployeeDto);

            return Ok(result);
        }
        catch (KeyNotFoundException notFoundEx)
        {
            _logger.LogWarning(notFoundEx.Message);
            return NotFound(notFoundEx.Message);
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
            await _employeeService.Delete(id);
            return NoContent();
        }
        catch (KeyNotFoundException notFoundEx)
        {
            _logger.LogWarning(notFoundEx.Message);
            return NotFound(notFoundEx.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"An error occurred while deleting employee with ID: {id}");
            return StatusCode(500, "Internal server error");
        }
    }
}