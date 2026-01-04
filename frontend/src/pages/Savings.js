import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { savingsAPI, categoryAPI, memberAPI } from "../services/api";

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSaving, setCurrentSaving] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPaidBy, setFilterPaidBy] = useState("");

  const [formData, setFormData] = useState({
    categoryId: "",
    paidBy: "",
    amount: "",
    description: "",
    frequency: "monthly",
  });

  useEffect(() => {
    fetchSavings();
    fetchCategories();
    fetchMembers();
  }, [selectedMonth, selectedYear]);

  const fetchSavings = async () => {
    try {
      const response = await savingsAPI.getAll(selectedMonth, selectedYear);
      setSavings(response.data);
    } catch (error) {
      console.error("Error fetching savings:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll("savings");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await memberAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleOpen = () => {
    setEditMode(false);
    setFormData({
      categoryId: "",
      paidBy: members.length > 0 ? members[0]._id : "",
      amount: "",
      description: "",
      frequency: "monthly",
    });
    setOpen(true);
  };

  const handleEdit = (saving) => {
    setEditMode(true);
    setCurrentSaving(saving);
    setFormData({
      categoryId: saving.categoryId._id,
      paidBy: saving.paidBy?._id || "",
      amount: saving.amount,
      description: saving.description,
      frequency: saving.frequency,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentSaving(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        month: selectedMonth,
        year: selectedYear,
      };

      if (editMode) {
        await savingsAPI.update(currentSaving._id, data);
      } else {
        await savingsAPI.create(data);
      }

      fetchSavings();
      handleClose();
    } catch (error) {
      console.error("Error saving savings:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this saving entry?")) {
      try {
        await savingsAPI.delete(id);
        fetchSavings();
      } catch (error) {
        console.error("Error deleting savings:", error);
      }
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Filter savings based on selected filters
  const filteredSavings = savings.filter((saving) => {
    const categoryMatch =
      !filterCategory || saving.categoryId?._id === filterCategory;
    const paidByMatch = !filterPaidBy || saving.paidBy?._id === filterPaidBy;
    return categoryMatch && paidByMatch;
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Savings & Investments</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add Savings
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month, index) => (
                  <MenuItem key={index} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {[2023, 2024, 2025, 2026].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={filterCategory}
                label="Filter by Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Paid By</InputLabel>
              <Select
                value={filterPaidBy}
                label="Filter by Paid By"
                onChange={(e) => setFilterPaidBy(e.target.value)}
              >
                <MenuItem value="">All Members</MenuItem>
                {members.map((member) => (
                  <MenuItem key={member._id} value={member._id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Paid By</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSavings.map((saving) => (
                  <TableRow key={saving._id}>
                    <TableCell>
                      {new Date(saving.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{saving.categoryId?.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={saving.paidBy?.name || "Not Set"}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{saving.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={saving.frequency}
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="right">
                      ₹{(saving.amount || 0).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEdit(saving)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(saving._id)}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSavings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No savings found for this period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? "Edit Savings" : "Add Savings"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.categoryId}
                    label="Category"
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Paid By</InputLabel>
                  <Select
                    value={formData.paidBy}
                    label="Paid By"
                    onChange={(e) =>
                      setFormData({ ...formData, paidBy: e.target.value })
                    }
                  >
                    {members.map((member) => (
                      <MenuItem key={member._id} value={member._id}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.frequency}
                    label="Frequency"
                    onChange={(e) =>
                      setFormData({ ...formData, frequency: e.target.value })
                    }
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                    <MenuItem value="one-time">One-time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Savings;
