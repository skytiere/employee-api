import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

interface AddEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded: () => void;
}

function AddEmployee({ isOpen, onClose, onEmployeeAdded }: AddEmployeeProps) {
  // Form state
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    dailyRate: "",
  });
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [workingDays, setWorkingDays] = useState("MWF");

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!dateOfBirth) {
      alert("Please select a date of birth");
      return;
    }
    try {
      setLoading(true);

      const response = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastName: formData.lastName,
          firstName: formData.firstName,
          middleName: formData.middleName || null,
          dateOfBirth: dateOfBirth.toDate(),
          dailyRate: parseFloat(formData.dailyRate),
          workingDays: workingDays,
        }),
      });

      if (!response.ok) throw new Error("Failed to create employee");

      // Success - refresh table and close modal
      onEmployeeAdded(); // Tells parent to refresh
      onClose(); // Close modal

      // Reset form
      setDateOfBirth(null);
      setWorkingDays("MWF");
      setFormData({
        lastName: "",
        firstName: "",
        middleName: "",
        dailyRate: "",
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date of Birth"
            value={dateOfBirth}
            onChange={(value) => setDateOfBirth(value)}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />
        </LocalizationProvider>
        <TextField
          label="Daily Rate"
          name="dailyRate"
          type="number"
          value={formData.dailyRate}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel id="working-days-label">Working Days</InputLabel>
          <Select
            labelId="working-days-label"
            id="working-days"
            variant="outlined"
            label="Working Days"
            name="workingDays"
            value={workingDays}
            onChange={(event: SelectChangeEvent<string>) =>
              setWorkingDays(event.target.value as string)
            }>
            <MenuItem value="MWF">MWF (Monday, Wednesday, Friday)</MenuItem>
            <MenuItem value="TTHS">TTHS (Tuesday, Thursday, Saturday)</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Creating..." : "Add Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEmployee;
