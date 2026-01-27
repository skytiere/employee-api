import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface EmployeeLite {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

interface DeleteEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployees: EmployeeLite[];
  onConfirmDelete: (ids: string[]) => void;
}

const DeleteEmployee: React.FC<DeleteEmployeeProps> = ({
  isOpen,
  onClose,
  selectedEmployees,
  onConfirmDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const displayName = (emp: EmployeeLite) => {
    if (emp.name) return emp.name;
    if (emp.firstName || emp.lastName) {
      return `${emp.lastName ?? ""} ${emp.firstName ?? ""}`.trim();
    }
    return emp.id;
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const ids = selectedEmployees.map((emp) => emp.id);
      await onConfirmDelete(ids);
      onClose();
    } catch (error) {
      console.error("Error deleting employees:", error);
      alert("Failed to delete employees");
    } finally {
      setLoading(false);
    }
  };

  const nothingSelected = selectedEmployees.length === 0;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningAmberRoundedIcon color="warning" />
        Confirm Deletion
      </DialogTitle>

      <DialogContent dividers>
        {nothingSelected ? (
          <Typography color="text.secondary">No employees selected.</Typography>
        ) : (
          <>
            <Typography gutterBottom>
              The following employees will be deleted:
            </Typography>
            <List dense>
              {selectedEmployees.map((emp) => (
                <ListItem key={emp.id} disablePadding>
                  <ListItemText primary={displayName(emp)} secondary={emp.id} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={nothingSelected || loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEmployee;
