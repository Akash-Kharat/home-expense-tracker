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
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { categoryAPI, memberAPI } from "../services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    fixedAmount: "",
    handlerId: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await memberAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpen = (type) => {
    setEditMode(false);
    setFormData({
      name: "",
      type: type,
      fixedAmount: "",
      handlerId: members.length > 0 ? members[0]._id : "",
      description: "",
    });
    setOpen(true);
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      fixedAmount: category.fixedAmount || "",
      handlerId: category.handlerId?._id || "",
      description: category.description,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCategory(null);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await categoryAPI.update(currentCategory._id, formData);
      } else {
        await categoryAPI.create(formData);
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryAPI.delete(id);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const savingsCategories = categories.filter((c) => c.type === "savings");

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Categories
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Expense Categories" />
          <Tab label="Savings Categories" />
        </Tabs>

        {tabValue === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Expense Categories</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpen("expense")}
              >
                Add Expense Category
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell>Handler</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenseCategories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="right">
                        ₹{(category.fixedAmount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.handlerId?.name || "Not Set"}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive ? "Active" : "Inactive"}
                          color={category.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(category)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(category._id)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {expenseCategories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No expense categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}

        {tabValue === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Savings Categories</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpen("savings")}
              >
                Add Savings Category
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Budget</TableCell>
                    <TableCell>Handler</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savingsCategories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="right">
                        ₹{(category.fixedAmount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.handlerId?.name || "Not Set"}
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive ? "Active" : "Inactive"}
                          color={category.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(category)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(category._id)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {savingsCategories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No savings categories found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </motion.div>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="savings">Savings</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Fixed Monthly Budget"
              type="number"
              value={formData.fixedAmount}
              onChange={(e) =>
                setFormData({ ...formData, fixedAmount: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Handler (Manages Fund)</InputLabel>
              <Select
                value={formData.handlerId}
                label="Handler (Manages Fund)"
                onChange={(e) =>
                  setFormData({ ...formData, handlerId: e.target.value })
                }
              >
                {members.map((member) => (
                  <MenuItem key={member._id} value={member._id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
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

export default Categories;
