import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import type { GridPaginationModel } from "@mui/x-data-grid";
import type { GridPaginationMeta } from "@mui/x-data-grid";
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
  const [hasNextPage, setHasNextPage] = useState(true);
  const useServerPagination = true;
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const paginationMeta: GridPaginationMeta = { hasNextPage };
  const rowCount = hasNextPage
    ? (paginationModel.page + 1) * paginationModel.pageSize + 1
    : paginationModel.page * paginationModel.pageSize + employees.length;

  const fetchEmployees = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/employee");
      if (!response.ok) throw new Error("Failed to fetch");

      const data: Employee[] = await response.json();
      setEmployees(data);
      setHasNextPage(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeByPage = async (page: number, pageSize: number) => {
    setLoading(true);

    try {
      const query = new URLSearchParams({
        pageSize: String(pageSize),
        pageNumber: String(page + 1),
      });

      const response = await fetch(`/api/employee/page?${query.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch page");

      const data: Employee[] = await response.json();
      setEmployees(data);
      setHasNextPage(data.length === pageSize);
    } catch (error) {
      console.error("Error fetching employee page:", error);
      setEmployees([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever page or page size changes
  useEffect(() => {
    if (useServerPagination) {
      fetchEmployeeByPage(paginationModel.page, paginationModel.pageSize);
      return;
    }

    fetchEmployees();
  }, [paginationModel.page, paginationModel.pageSize, useServerPagination]);
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
        pagination
        paginationMode="server"
        rowCount={rowCount}
        paginationMeta={paginationMeta}
        pageSizeOptions={[5, 10, 20]}
        paginationModel={paginationModel}
        onPaginationModelChange={(newModel) => {
          if (newModel.pageSize !== paginationModel.pageSize) {
            setPaginationModel({ page: 0, pageSize: newModel.pageSize });
            return;
          }

          setPaginationModel(newModel);
        }}
        checkboxSelection
        getRowId={(row) => row.id}
        onRowSelectionModelChange={handleSelectionChange}
      />
    </Paper>
  );
}

export default EmployeeTable;
