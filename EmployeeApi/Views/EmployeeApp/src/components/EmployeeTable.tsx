import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
  createdAt: string;
  updatedAt: string;
}

function EmployeeTable() {
  const [loading, setLoading] = useState(true);

  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch data when component loads
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
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
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
      flex: 1,
    },
  ];

  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={employees}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.id}
      />
    </Paper>
  );
}

export default EmployeeTable;
