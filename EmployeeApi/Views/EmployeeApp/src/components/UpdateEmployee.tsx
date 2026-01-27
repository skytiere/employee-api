import { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { SelectChangeEvent } from "@mui/material/Select";

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

interface UpdateEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: Employee | null;
  onEmployeeUpdated: () => void;
}

function UpdateEmployee({
  isOpen,
  onClose,
  selectedEmployee,
  onEmployeeUpdated,
}: UpdateEmployeeProps) {
  // Form state
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
  });
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  const [dailyRate, setDailyRate] = useState("");
  const [workingDays, setWorkingDays] = useState("MWF");
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  // Populate form when employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        lastName: selectedEmployee.lastName,
        firstName: selectedEmployee.firstName,
        middleName: selectedEmployee.middleName || "",
      });
      setDateOfBirth(dayjs(selectedEmployee.dateOfBirth));
      setDailyRate(selectedEmployee.dailyRate.toString());
      setWorkingDays(selectedEmployee.workingDays);
      setEndDate(
        selectedEmployee.endDate ? dayjs(selectedEmployee.endDate) : null,
      );
    }
  }, [selectedEmployee, isOpen]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/employee/${selectedEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastName: formData.lastName.toUpperCase().trim(),
          firstName: formData.firstName.toUpperCase().trim(),
          middleName: formData.middleName.toUpperCase().trim() || null,
          dateOfBirth: dateOfBirth?.toDate(),
          dailyRate: parseFloat(dailyRate),
          workingDays: workingDays,
          endDate: endDate ? endDate.toDate() : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update employee");

      // Success - refresh table and close modal
      onEmployeeUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Update Employee -{" "}
        {selectedEmployee
          ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
          : ""}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: 2,
        }}>
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
          type="number"
          value={dailyRate}
          onChange={(e) => setDailyRate(e.target.value)}
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
            value={workingDays}
            onChange={(event: SelectChangeEvent<string>) =>
              setWorkingDays(event.target.value as string)
            }>
            <MenuItem value="MWF">MWF (Monday, Wednesday, Friday)</MenuItem>
            <MenuItem value="TTHS">TTHS (Tuesday, Thursday, Saturday)</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End Date (Optional)"
            value={endDate}
            onChange={(value) => setEndDate(value)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Updating..." : "Update Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateEmployee;
