using Microsoft.EntityFrameworkCore;
using EmployeeApi.Models;

namespace EmployeeApi.Data;

public class EmployeeContext : DbContext
{
    public EmployeeContext(DbContextOptions<EmployeeContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Employee entity
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        // Seed sample data
        modelBuilder.Entity<Employee>().HasData(
            new Employee
            {
                Id = "DEL-12340-17MAY1994",
                LastName = "DELA CRUZ",
                FirstName = "JUAN",
                MiddleName = null,
                DateOfBirth = new DateTime(1994, 5, 17),
                DailyRate = 2000.00m,
                WorkingDays = "MWF",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Employee
            {
                Id = "JOH-54321-15AUG1985",
                LastName = "JOHNSON",
                FirstName = "ROBERT",
                MiddleName = "MICHAEL",
                DateOfBirth = new DateTime(1985, 8, 15),
                DailyRate = 2500.00m,
                WorkingDays = "TTHS",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );
    }
}