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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { memberAPI } from "../services/api";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    monthlyIncome: "",
  });

  useEffect(() => {
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

  const handleOpen = () => {
    setEditMode(false);
    setFormData({
      name: "",
      monthlyIncome: "",
    });
    setOpen(true);
  };

  const handleEdit = (member) => {
    setEditMode(true);
    setCurrentMember(member);
    setFormData({
      name: member.name,
      monthlyIncome: member.monthlyIncome,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentMember(null);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await memberAPI.update(currentMember._id, formData);
      } else {
        await memberAPI.create(formData);
      }
      fetchMembers();
      handleClose();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await memberAPI.delete(id);
        fetchMembers();
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Family Members</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
            Add Member
          </Button>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Monthly Income</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell align="right">
                      ₹{member.monthlyIncome.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.isActive ? "Active" : "Inactive"}
                        color={member.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEdit(member)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(member._id)}
                        size="small"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No members found. Add your first family member!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Edit Member" : "Add Member"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Monthly Income"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) =>
                setFormData({ ...formData, monthlyIncome: e.target.value })
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

export default Members;
