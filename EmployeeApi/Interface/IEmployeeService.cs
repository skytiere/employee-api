using EmployeeApi.Models;

namespace EmployeeApi.Interface;

public interface IEmployeeService
{
    Task<List<EmployeeDto>> GetAll();
    Task<EmployeeDto> GetById(string id);
    Task<List<EmployeeDto>> GetPage(int pageSize, int pageNumber);
    Task<EmployeeDto> Create(CreateEmployeeDto createEmployeeDto);
    Task<EmployeeDto> Update(string id, UpdateEmployeeDto updateEmployeeDto);
    Task Delete(string id);
}