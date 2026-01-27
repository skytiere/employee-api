using Microsoft.EntityFrameworkCore;
using EmployeeApi.Models;

namespace EmployeeApi.Data;

public class EmployeeContext : DbContext
{
    public EmployeeContext(DbContextOptions<EmployeeContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; } = null!;// Maps to "Employees" table
}