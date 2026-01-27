import "./App.css";

// States
import { useState } from "react";

// Components
import EmployeeTable from "./components/EmployeeTable";
import AddEmployee from "./components/AddEmployee";
import DeleteEmployee from "./components/DeleteEmployee";
import UpdateEmployee from "./components/UpdateEmployee";
import { Button, Stack } from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);

  const handleAddEmployeeClick = () => {
    setModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleUpdateClick = () => {
    setUpdateModalOpen(true);
  };

  const handleEmployeeChange = () => {
    setRefreshTrigger((prev) => prev + 1);
    setSelectedEmployees([]);
  };

  const handleSelectionChange = (selected: any[]) => {
    setSelectedEmployees(selected);
  };

  const handleConfirmDelete = async (ids: string[]) => {
    try {
      // Delete each employee
      await Promise.all(
        ids.map((id) => fetch(`/api/employee/${id}`, { method: "DELETE" })),
      );
      handleEmployeeChange();
    } catch (error) {
      console.error("Error deleting employees:", error);
      alert("Failed to delete employees");
    }
  };

  return (
    <div className="App">
      <h1>Employee Payroll System</h1>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}>
        <Button
          variant="outlined"
          onClick={handleAddEmployeeClick}
          endIcon={<PersonAddAlt1RoundedIcon />}>
          Add
        </Button>
        <Button
          variant="outlined"
          onClick={handleUpdateClick}
          disabled={selectedEmployees.length === 0}
          endIcon={<EditRoundedIcon />}>
          Update
        </Button>
        <Button variant="outlined" endIcon={<AttachMoneyRoundedIcon />}>
          Compute
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteClick}
          disabled={selectedEmployees.length === 0}
          endIcon={<DeleteOutlineIcon />}>
          Delete
        </Button>
      </Stack>
      <EmployeeTable
        key={refreshTrigger}
        onSelectionChange={handleSelectionChange}
      />
      <AddEmployee
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEmployeeAdded={handleEmployeeChange}
      />
      <DeleteEmployee
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedEmployees={selectedEmployees}
        onConfirmDelete={handleConfirmDelete}
      />
      <UpdateEmployee
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        selectedEmployee={
          selectedEmployees.length > 0 ? selectedEmployees[0] : null
        }
        onEmployeeUpdated={handleEmployeeChange}
      />
    </div>
  );
}

export default App;
