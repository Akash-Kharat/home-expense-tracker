import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { dashboardAPI } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [selectedMonth, selectedYear]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSummary(
        selectedMonth,
        selectedYear
      );
      setSummaryData(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summaryData) {
    return <Typography>Loading...</Typography>;
  }

  const expenseChartData = Object.entries(
    summaryData.expenseByCategory || {}
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const savingsChartData = Object.entries(
    summaryData.savingsByCategory || {}
  ).map(([name, value]) => ({
    name,
    value,
  }));

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

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
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
        </Grid>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ bgcolor: "#e3f2fd" }}>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Income
                      </Typography>
                      <Typography variant="h5">
                        ₹{(summaryData.totalIncome || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    <AccountBalance sx={{ fontSize: 40, color: "#1976d2" }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card sx={{ bgcolor: "#ffebee" }}>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Expenses
                      </Typography>
                      <Typography variant="h5">
                        ₹{(summaryData.totalExpenses || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    <TrendingDown sx={{ fontSize: 40, color: "#d32f2f" }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ bgcolor: "#e8f5e9" }}>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Savings
                      </Typography>
                      <Typography variant="h5">
                        ₹{(summaryData.totalSavings || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 40, color: "#388e3c" }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                sx={{
                  bgcolor:
                    (summaryData.totalBalance || 0) >= 0
                      ? "#f3e5f5"
                      : "#fce4ec",
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Balance
                      </Typography>
                      <Typography
                        variant="h5"
                        color={
                          (summaryData.totalBalance || 0) >= 0
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        ₹{(summaryData.totalBalance || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    <PieChartIcon sx={{ fontSize: 40, color: "#7b1fa2" }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Member Balances */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Member-wise Settlement
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell align="right">Income</TableCell>
                        <TableCell align="right">Paid Out</TableCell>
                        <TableCell align="right">Should Receive</TableCell>
                        <TableCell align="right">Savings Paid</TableCell>
                        <TableCell align="right">Net Position</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(summaryData.memberBalances || []).map((member) => (
                        <TableRow key={member.memberId}>
                          <TableCell>{member.memberName}</TableCell>
                          <TableCell align="right">
                            ₹{(member.income || 0).toLocaleString()}
                          </TableCell>
                          <TableCell align="right" sx={{ color: "error.main" }}>
                            ₹{(member.paidOut || 0).toLocaleString()}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ color: "success.main" }}
                          >
                            ₹{(member.shouldReceive || 0).toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            ₹{(member.savingsPaid || 0).toLocaleString()}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color:
                                (member.netPosition || 0) >= 0
                                  ? "success.main"
                                  : "error.main",
                              fontWeight: "bold",
                            }}
                          >
                            ₹{(member.netPosition || 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </motion.div>
          </Grid>

          {/* Category Budget Breakdown */}
          {summaryData.categoryBreakdown &&
            summaryData.categoryBreakdown.length > 0 && (
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Category Budget Breakdown
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Handler</TableCell>
                            <TableCell align="right">Budget</TableCell>
                            <TableCell align="right">Spent</TableCell>
                            <TableCell align="right">Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(summaryData.categoryBreakdown || []).map(
                            (category) => (
                              <TableRow key={category.categoryId}>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell>{category.handler}</TableCell>
                                <TableCell align="right">
                                  ₹{(category.budget || 0).toLocaleString()}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: "error.main" }}
                                >
                                  ₹{(category.spent || 0).toLocaleString()}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    color:
                                      (category.balance || 0) >= 0
                                        ? "success.main"
                                        : "error.main",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ₹{(category.balance || 0).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </motion.div>
              </Grid>
            )}

          {/* Over-Expenses (Non-Handler Expenses) */}
          {summaryData.overExpenses &&
            summaryData.overExpenses.some((m) => m.totalOverExpense > 0) && (
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Over-Expenses (Non-Handler Spending)
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Expenses made by members on categories they don't handle
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {summaryData.overExpenses
                      .filter((member) => member.totalOverExpense > 0)
                      .map((member) => (
                        <Box key={member.memberId} sx={{ mb: 3 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {member.memberName} - Total: ₹
                            {(member.totalOverExpense || 0).toLocaleString()}
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Category</TableCell>
                                  <TableCell>Handler</TableCell>
                                  <TableCell align="right">
                                    Amount Spent
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {member.categories.map((cat) => (
                                  <TableRow key={cat.categoryId}>
                                    <TableCell>{cat.categoryName}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={cat.handler}
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                      />
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      sx={{ color: "warning.main" }}
                                    >
                                      ₹{(cat.amount || 0).toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      ))}
                  </Paper>
                </motion.div>
              </Grid>
            )}

          {/* Charts */}
          {expenseChartData.length > 0 && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Expenses by Category
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </motion.div>
            </Grid>
          )}

          {savingsChartData.length > 0 && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Savings by Category
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={savingsChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
