import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

interface Employee {
  id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  dateOfBirth: string;
  dailyRate: number;
  workingDays: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface EmployeeTableProps {
  onSelectionChange?: (selectedEmployees: Employee[]) => void;
}

function EmployeeTable({ onSelectionChange }: EmployeeTableProps) {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch data on component load
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employee");
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };
  // Define table columns
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 2,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1.5,
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1.5,
    },
    {
      field: "dailyRate",
      headerName: "Daily Rate",
      flex: 1,
      type: "number",
    },
    {
      field: "workingDays",
      headerName: "Working Days",
      flex: 1.5,
    },
  ];

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    let selectedEmployees: Employee[];

    // Handle select-all
    if (
      typeof newSelection === "object" &&
      newSelection !== null &&
      "type" in newSelection &&
      newSelection.type === "exclude"
    ) {
      const excludedIds = Array.from(
        (newSelection.ids as Set<string>) || new Set(),
      );
      selectedEmployees = employees.filter(
        (emp) => !excludedIds.includes(emp.id),
      );
    } else {
      // Handle normal selection
      const selectedIds = Array.from(newSelection.ids).map(String);
      selectedEmployees = employees.filter((employee) =>
        selectedIds.includes(employee.id),
      );
    }

    onSelectionChange?.(selectedEmployees);
  };

  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={employees}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.id}
        onRowSelectionModelChange={handleSelectionChange}
      />
    </Paper>
  );
}

export default EmployeeTable;
