import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import dayjs from "dayjs";

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

interface ComputePayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: Employee | null;
}

const ComputePay: React.FC<ComputePayProps> = ({
  isOpen,
  onClose,
  selectedEmployee,
}) => {
  const currentDate = dayjs();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.format("YYYY-MM"),
  );

  // Clamp the initially selected month within the employee's active range
  useEffect(() => {
    if (!selectedEmployee) return;
    const start = dayjs(selectedEmployee.startDate).startOf("month");
    const end = (
      selectedEmployee.endDate ? dayjs(selectedEmployee.endDate) : dayjs()
    ).startOf("month");
    const today = dayjs().startOf("month");
    const clamped = today.isBefore(start)
      ? start
      : today.isAfter(end)
        ? end
        : today;
    setSelectedMonth(clamped.format("YYYY-MM"));
  }, [selectedEmployee]);

  const payCalculation = useMemo(() => {
    if (!selectedEmployee) return null;

    const monthDate = dayjs(selectedMonth);
    const monthStart = monthDate.startOf("month");
    const monthEnd = monthDate.endOf("month");
    const employmentStart = dayjs(selectedEmployee.startDate).startOf("day");
    const employmentEnd = selectedEmployee.endDate
      ? dayjs(selectedEmployee.endDate).endOf("day")
      : dayjs().endOf("day");

    // Active range within this month
    const activeStart = employmentStart.isAfter(monthStart)
      ? employmentStart
      : monthStart;
    const activeEnd = employmentEnd.isBefore(monthEnd)
      ? employmentEnd
      : monthEnd;

    if (activeStart.isAfter(activeEnd)) {
      return {
        month: monthDate.format("MMMM YYYY"),
        workingDaysInMonth: 0,
        workingDaysPay: 0,
        birthdayBonus: 0,
        totalPay: 0,
      };
    }

    const workingDaysStr = selectedEmployee.workingDays;

    // Map working days to day numbers (0 = Sunday, 1 = Monday, etc.)
    const workingDayMap: { [key: string]: number[] } = {
      MWF: [1, 3, 5], // Monday, Wednesday, Friday
      TTHS: [2, 4, 6], // Tuesday, Thursday, Saturday
    };
    const workingDayNumbers = workingDayMap[workingDaysStr] || [];

    // Count working days only within the active range for this month
    let workingDaysInMonth = 0;
    let cursor = activeStart;
    while (
      cursor.isSame(activeEnd, "day") ||
      cursor.isBefore(activeEnd, "day")
    ) {
      if (workingDayNumbers.includes(cursor.day())) {
        workingDaysInMonth++;
      }
      cursor = cursor.add(1, "day");
    }

    // Calculate pay from working days (3 days/week = 2x daily rate)
    const workingDaysPay = workingDaysInMonth * selectedEmployee.dailyRate * 2;

    // Check if birthday occurs in this month AND within active range
    const birthDate = dayjs(selectedEmployee.dateOfBirth);
    const birthdayThisMonth = birthDate.month() === monthDate.month();
    let birthdayBonus = 0;
    if (birthdayThisMonth) {
      const birthdayThisYear = monthDate.date(birthDate.date());
      const birthdayActive =
        (birthdayThisYear.isSame(activeStart, "day") ||
          birthdayThisYear.isAfter(activeStart, "day")) &&
        (birthdayThisYear.isSame(activeEnd, "day") ||
          birthdayThisYear.isBefore(activeEnd, "day"));
      birthdayBonus = birthdayActive ? selectedEmployee.dailyRate : 0;
    }

    // Total pay
    const totalPay = workingDaysPay + birthdayBonus;

    return {
      month: monthDate.format("MMMM YYYY"),
      workingDaysInMonth,
      workingDaysPay,
      birthdayBonus,
      totalPay,
    };
  }, [selectedEmployee, selectedMonth]);

  const handleMonthChange = (event: SelectChangeEvent) => {
    setSelectedMonth(event.target.value);
  };

  // Generate month options between employee start and end (or today if no end date)
  const monthOptions = useMemo(() => {
    if (!selectedEmployee) return [];
    const startMonth = dayjs(selectedEmployee.startDate).startOf("month");
    const endMonth = (
      selectedEmployee.endDate ? dayjs(selectedEmployee.endDate) : dayjs()
    ).startOf("month");

    const options: { value: string; label: string }[] = [];
    let cursor = startMonth;
    while (
      cursor.isSame(endMonth, "month") ||
      cursor.isBefore(endMonth, "month")
    ) {
      options.push({
        value: cursor.format("YYYY-MM"),
        label: cursor.format("MMMM YYYY"),
      });
      cursor = cursor.add(1, "month");
    }
    return options;
  }, [selectedEmployee]);

  if (!selectedEmployee || !payCalculation) {
    return null;
  }

  const displayName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Compute Pay - {displayName}</DialogTitle>

      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Month Selector */}
        <FormControl fullWidth size="small">
          <InputLabel>Select Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Select Month"
            onChange={handleMonthChange}>
            {monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Employee Information Table */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            Employee Information
          </Typography>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                  ID:
                </TableCell>
                <TableCell>{selectedEmployee.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name:</TableCell>
                <TableCell>{displayName}</TableCell>
              </TableRow>
              {selectedEmployee.middleName && (
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Middle Name:
                  </TableCell>
                  <TableCell>{selectedEmployee.middleName}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Date of Birth:
                </TableCell>
                <TableCell>
                  {dayjs(selectedEmployee.dateOfBirth).format("MMM DD, YYYY")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Daily Rate:</TableCell>
                <TableCell>₱{selectedEmployee.dailyRate.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Working Days:</TableCell>
                <TableCell>{selectedEmployee.workingDays}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Start Date:</TableCell>
                <TableCell>
                  {dayjs(selectedEmployee.startDate).format("MMM DD, YYYY")}
                </TableCell>
              </TableRow>
              {selectedEmployee.endDate && (
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>End Date:</TableCell>
                  <TableCell>
                    {dayjs(selectedEmployee.endDate).format("MMM DD, YYYY")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {/* Pay Calculation */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            Pay Calculation for {payCalculation.month}
          </Typography>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Working Days in Month:
                </TableCell>
                <TableCell>{payCalculation.workingDaysInMonth} days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Working Days Pay (2x daily rate):
                </TableCell>
                <TableCell>
                  {payCalculation.workingDaysInMonth} × ₱
                  {(selectedEmployee.dailyRate * 2).toFixed(2)} = ₱
                  {payCalculation.workingDaysPay.toFixed(2)}
                </TableCell>
              </TableRow>
              {payCalculation.birthdayBonus > 0 && (
                <TableRow sx={{ backgroundColor: "#fff3e0" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Birthday Bonus (100% daily rate):
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    ₱{payCalculation.birthdayBonus.toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
              <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Total Pay:</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  ₱{payCalculation.totalPay.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComputePay;
