using Microsoft.EntityFrameworkCore;
using EmployeeApi.Models;
using System.Diagnostics.CodeAnalysis;

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
                UpdatedAt = DateTime.UtcNow,
                StartDate = new DateTime(2025, 5, 16),
                EndDate = new DateTime(2025, 5, 20)
            },
            new Employee
            {
                Id = "SY*-00779-10SEP1994",
                LastName = "SY",
                FirstName = "ANNIE",
                MiddleName = "",
                DateOfBirth = new DateTime(1994, 9, 1),
                DailyRate = 1500.00m,
                WorkingDays = "TTHS",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                StartDate = new DateTime(2025, 9, 1),
                EndDate = new DateTime(2025, 9, 9)
            },
            new Employee
            {
                Id = "RAM-54321-23DEC1990",
                LastName = "RAMOS",
                FirstName = "CARLOS",
                MiddleName = "LOPEZ",
                DateOfBirth = new DateTime(1990, 12, 23),
                DailyRate = 1800.00m,
                WorkingDays = "MWF",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                StartDate = new DateTime(2025, 12, 1),
                EndDate = null
            }
        );
    }
}