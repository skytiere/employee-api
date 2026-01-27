import "./App.css";

// States
import { useState } from "react";

// Components
import EmployeeTable from "./components/EmployeeTable";
import AddEmployee from "./components/AddEmployee";
import { Button, Stack } from "@mui/material/";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddEmployeeClick = () => {
    setModalOpen(true);
  };

  const handleEmployeeChange = () => {
    setRefreshTrigger((prev) => prev + 1);
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
        <Button variant="outlined" endIcon={<EditRoundedIcon />}>
          Update
        </Button>
        <Button variant="outlined" endIcon={<AttachMoneyRoundedIcon />}>
          Compute
        </Button>
        <Button variant="outlined" endIcon={<DeleteIcon />}>
          Delete
        </Button>
      </Stack>
      <EmployeeTable key={refreshTrigger} />
      <AddEmployee
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEmployeeAdded={handleEmployeeChange}
      />
    </div>
  );
}

export default App;
