using EmployeeApi.Models;

namespace EmployeeApi.Interface;

public interface IEmployeeService
{
    List<EmployeeDto> GetAll();
    EmployeeDto GetById(string id);
    EmployeeDto Create(CreateEmployeeDto createEmployeeDto);
    EmployeeDto Update(string id, UpdateEmployeeDto updateEmployeeDto);
    void Delete(string id);
}