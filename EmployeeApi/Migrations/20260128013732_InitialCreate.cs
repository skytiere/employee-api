using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EmployeeApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    MiddleName = table.Column<string>(type: "text", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DailyRate = table.Column<decimal>(type: "numeric", nullable: false),
                    WorkingDays = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "CreatedAt", "DailyRate", "DateOfBirth", "EndDate", "FirstName", "LastName", "MiddleName", "StartDate", "UpdatedAt", "WorkingDays" },
                values: new object[,]
                {
                    { "DEL-12340-17MAY1994", new DateTime(2026, 1, 28, 1, 37, 32, 515, DateTimeKind.Utc).AddTicks(9140), 2000.00m, new DateTime(1994, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "JUAN", "DELA CRUZ", null, new DateTime(2025, 5, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 28, 1, 37, 32, 515, DateTimeKind.Utc).AddTicks(9142), "MWF" },
                    { "RAM-54321-23DEC1990", new DateTime(2026, 1, 28, 1, 37, 32, 515, DateTimeKind.Utc).AddTicks(9149), 1800.00m, new DateTime(1990, 12, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "CARLOS", "RAMOS", "LOPEZ", new DateTime(2025, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 28, 1, 37, 32, 515, DateTimeKind.Utc).AddTicks(9149), "MWF" },
                    { "SY*-00779-10SEP1994", new DateTime(2026, 1, 28, 1, 37, 32, 515, DateTimeKind.Utc).AddTicks(9146), 1500.00m, new DateTime(1994, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "ANNIE", "SY", "", new DateTime(2025, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 28, 1, 37, 32, 515, DateTimeKind.Utc).AddTicks(9147), "TTHS" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
