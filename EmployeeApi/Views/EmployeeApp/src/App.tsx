import "./App.css";
import EmployeeTable from "./components/EmployeeTable";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";

function App() {
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
        <Button variant="outlined" endIcon={<PersonAddAlt1RoundedIcon />}>
          Add Employee
        </Button>
        <Button variant="outlined" endIcon={<EditRoundedIcon />}>
          Update Employee
        </Button>
        <Button variant="outlined" endIcon={<AttachMoneyRoundedIcon />}>
          Compute Take Home
        </Button>
        <Button variant="outlined" endIcon={<DeleteIcon />}>
          Delete Employee
        </Button>
      </Stack>
      <EmployeeTable />
    </div>
  );
}

export default App;
