import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TextField,
  TablePagination,
  TableSortLabel,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getUserTransactions, deleteTransaction } from "../../api/transactions";
import { getAllTags } from "../../api/tags";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Ads from "../../components/Ads/Ads";


const MySwal = withReactContent(Swal);

// Simple debounce function hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function TransactionHistory() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const fetchTags = async () => {
    try {
      const data = await getAllTags();
      const tagArray = Array.isArray(data) ? data : data?.tags || [];
      setAllTags(tagArray);
    } catch (err) {
      console.error("Failed to load tags:", err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleMenuOpen = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  const handleUpdate = () => {
    if (selectedTransaction) {
      navigate(`/update-transaction/${selectedTransaction.id}`, {
        state: { transaction: selectedTransaction },
      });
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedTransaction) return;

    handleMenuClose();
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      background: "#1A202C",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await deleteTransaction(selectedTransaction.id);
        MySwal.fire({
          title: "Deleted!",
          text: "Transaction has been deleted.",
          icon: "success",
          background: "#1A202C",
          color: "#fff",
          confirmButtonColor: "#10B981",
        });
        fetchHistory();
      } catch (err) {
        console.error("Failed to delete transaction:", err);
        MySwal.fire({
          title: "Error!",
          text: "Failed to delete transaction.",
          icon: "error",
          background: "#1A202C",
          color: "#fff",
          confirmButtonColor: "#10B981",
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      keyword: "",
      minAmount: "",
      maxAmount: "",
      tagIds: [],
      date: null,
    },
    validationSchema: Yup.object({
      keyword: Yup.string(),
      minAmount: Yup.number().min(0, "Min amount cannot be negative"),
      maxAmount: Yup.number()
        .positive("Max amount must be greater than 0")
        .integer("Max amount must be an integer (no decimals)"),
    }),
    onSubmit: () => {
      // Live filtering handled by debounced values
    },
  });

  const handleResetFilters = () => {
    formik.resetForm();
    setSortBy("createdAt");
    setSortDir("desc");
    setPage(0);
  };

  // Debounced filter values
  const debouncedKeyword = useDebounce(formik.values.keyword, 500);
  const debouncedMinAmount = useDebounce(formik.values.minAmount, 500);
  const debouncedMaxAmount = useDebounce(formik.values.maxAmount, 500);
  const debouncedTagIds = useDebounce(formik.values.tagIds, 500);
  const debouncedDate = useDebounce(formik.values.date, 500);

  const fetchHistory = useCallback(async () => {
    if (Object.keys(formik.errors).length > 0) return;
    try {
      setLoading(true);
      const params = {
        page: page,
        size: rowsPerPage,
        sortBy: sortBy,
        sortDir: sortDir,
        ...(debouncedKeyword && { keyword: debouncedKeyword }),
        ...(debouncedMinAmount && { minAmount: debouncedMinAmount }),
        ...(debouncedMaxAmount && { maxAmount: debouncedMaxAmount }),
        ...(debouncedTagIds.length > 0 && { tagIds: debouncedTagIds }),
        ...(debouncedDate && { date: debouncedDate.format("YYYY-MM-DD") }),
      };

      // No longer sending hardcoded userId, backend will extract from token
      const data = await getUserTransactions(params);
      setTransactions(data?.content || (Array.isArray(data) ? data : []));
      setTotalElements(
        data?.totalElements || (Array.isArray(data) ? data.length : 0),
      );
    } catch (err) {
      console.error("Failed to load transaction history", err);
      setError("Failed to load transaction history.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    rowsPerPage,
    sortBy,
    sortDir,
    debouncedKeyword,
    debouncedMinAmount,
    debouncedMaxAmount,
    debouncedTagIds,
    debouncedDate,
  ]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortRequest = (property) => {
    const isAsc = sortBy === property && sortDir === "asc";
    setSortDir(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return `₹${Number(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD MMM YYYY, hh:mm A");
  };

  const renderTags = (transactionTags) => {
    if (!transactionTags || transactionTags.length === 0) return "-";
    return (
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center" }}>
        {transactionTags.map((item) => {
          const tag = item.tag;
          if (!tag) return null;
          return (
            <Chip
              key={item.id || tag.id || tag.name}
              size="small"
              label={tag.name}
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.15)",
                color: "#10B981",
                fontSize: "0.75rem",
              }}
            />
          );
        })}
      </Box>
    );

  };

  return (
    <Box maxWidth="xl" mx="auto">
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#fff", mb: 4 }}
      >
        Transaction History
      </Typography>

      {/* Search and Filters */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          gap: 2, 
          mb: 3, 
          flexWrap: "wrap",
          alignItems: "stretch"
        }}
      >
        <TextField
          name="keyword"
          placeholder="Search by amount or note..."
          variant="outlined"
          size="small"
          value={formik.values.keyword}
          onChange={(e) => {
            formik.handleChange(e);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#A0AEC0" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flexGrow: 2,
            minWidth: { xs: "100%", sm: "240px" },
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              backgroundColor: "#111",
              "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&.Mui-focused fieldset": { borderColor: "#10B981" },
            },
          }}
        />

        {/* Date Filter */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            placeholder="Filter by Date"
            value={formik.values.date}
            onChange={(newValue) => {
              formik.setFieldValue("date", newValue);
              setPage(0);
            }}
            slotProps={{
              textField: {
                size: "small",
                placeholder: "Date",
                sx: {
                  width: { xs: "100%", sm: "160px" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    backgroundColor: "#111",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&.Mui-focused fieldset": { borderColor: "#10B981" },
                  },
                  "& .MuiSvgIcon-root": { color: "#A0AEC0" },
                },
              },
            }}
          />
        </LocalizationProvider>

        {/* Tag Filter */}
        <Autocomplete
          multiple
          limitTags={1}
          id="tag-filter"
          options={allTags}
          getOptionLabel={(option) => option.name || ""}
          value={allTags.filter(t => formik.values.tagIds.includes(t.id))}
          onChange={(e, newValue) => {
            formik.setFieldValue("tagIds", newValue.map(v => v.id));
            setPage(0);
          }}
          loading={isLoadingTags}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Filter by Tags"
              size="small"
              sx={{
                width: { xs: "100%", sm: "220px" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  backgroundColor: "#111",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "#10B981" },
                },
              }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option.id}
                variant="filled"
                label={option.name}
                size="small"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.2)",
                  color: "#10B981",
                  "& .MuiChip-deleteIcon": {
                    color: "#10B981",
                  },
                }}
                {...getTagProps({ index })}
              />
            ))
          }
          PaperProps={{
            sx: {
              bgcolor: "#1A202C",
              color: "#fff",
              '& .MuiAutocomplete-option[aria-selected="true"]': {
                bgcolor: "rgba(16, 185, 129, 0.2)",
              },
              "& .MuiAutocomplete-option:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            },
          }}
          componentsProps={{
            clearIndicator: { sx: { color: "#A0AEC0" } },
            popupIndicator: { sx: { color: "#A0AEC0" } },
          }}
        />
        
        <Box sx={{ display: "flex", gap: 2, flexGrow: 1, flexDirection: { xs: "row", sm: "row" } }}>
          <TextField
            type="number"
            name="minAmount"
            placeholder="Min Amount"
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            value={formik.values.minAmount}
            onChange={(e) => {
              formik.handleChange(e);
              setPage(0);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.minAmount && Boolean(formik.errors.minAmount)}
            helperText={formik.touched.minAmount && formik.errors.minAmount}
            inputProps={{ min: 0 }}
            sx={{
              width: { xs: "50%", sm: "140px", md: "180px" },
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                backgroundColor: "#111",
                "& fieldset": {
                  borderColor: formik.touched.minAmount && formik.errors.minAmount ? "#ef4444" : "rgba(255,255,255,0.1)",
                },
              },
              "& .MuiFormHelperText-root": { color: "#ef4444", position: "absolute", bottom: -24 },
            }}
          />
          <TextField
            type="number"
            name="maxAmount"
            placeholder="Max Amount"
            variant="outlined"
            size="small"
            fullWidth={isMobile}
            value={formik.values.maxAmount}
            onChange={(e) => {
              formik.handleChange(e);
              setPage(0);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.maxAmount && Boolean(formik.errors.maxAmount)}
            helperText={formik.touched.maxAmount && formik.errors.maxAmount}
            sx={{
              width: { xs: "50%", sm: "140px", md: "180px" },
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                backgroundColor: "#111",
                "& fieldset": {
                  borderColor: formik.touched.maxAmount && formik.errors.maxAmount ? "#ef4444" : "rgba(255,255,255,0.1)",
                },
              },
              "& .MuiFormHelperText-root": { color: "#ef4444", position: "absolute", bottom: -24 },
            }}
          />
        </Box>

        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleResetFilters}
          sx={{
            color: "#A0AEC0",
            borderColor: "rgba(255,255,255,0.1)",
            backgroundColor: "#111",
            height: "40px",
            minWidth: { xs: "100%", sm: "auto" },
            "&:hover": {
              borderColor: "rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.05)",
            },
            textTransform: "none",
          }}
        >
          Reset Filters
        </Button>
      </Box>

      {/* AdSense Integration */}
      <Ads adSlot="1234567890" sx={{ mb: 4 }} />


      <Paper
        elevation={0}
        sx={{
          p: 0,
          bgcolor: "#111",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {loading && transactions.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 10,
            }}
          >
            <CircularProgress sx={{ color: "#10B981" }} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}>
            {isMobile ? (
              <List sx={{ p: 2 }}>
                {transactions.length === 0 ? (
                  <Typography align="center" sx={{ py: 5, color: "#A0AEC0" }}>
                    No transactions found.
                  </Typography>
                ) : (
                  transactions.map((tx) => (
                    <ListItem
                      key={tx.id}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 3,
                        mb: 2,
                        flexDirection: "column",
                        alignItems: "flex-start",
                        p: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Box sx={{ pr: 2 }}>
                          <Typography variant="body1" fontWeight="500" sx={{ color: "#fff", mb: 0.5 }}>
                            {tx.notes || "-"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#A0AEC0", display: "block" }}>
                            {formatDate(tx.createdAt)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: "#10B981" }}>
                            {formatCurrency(tx.amount)}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, tx)}
                            sx={{ color: "#A0AEC0", ml: 1 }}
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          {renderTags(tx.transactionTags)}
                        </Box>
                        <Typography variant="caption" sx={{ color: "#A0AEC0", ml: 2, whiteSpace: "nowrap" }}>
                          {tx.group?.name || "-"}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))
                )}
              </List>
            ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#A0AEC0",
                        fontWeight: "bold",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        width: "20%",
                      }}
                    >
                      <TableSortLabel
                        active={sortBy === "amount"}
                        direction={sortBy === "amount" ? sortDir : "desc"}
                        onClick={() => handleSortRequest("amount")}
                        sx={{
                          color: "#A0AEC0 !important",
                          "& .MuiTableSortLabel-icon": {
                            color: "#10B981 !important",
                          },
                        }}
                      >
                        Amount
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#A0AEC0",
                        fontWeight: "bold",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        width: "20%",
                      }}
                    >
                      <TableSortLabel
                        active={sortBy === "notes"}
                        direction={sortBy === "notes" ? sortDir : "asc"}
                        onClick={() => handleSortRequest("notes")}
                        sx={{
                          color: "#A0AEC0 !important",
                          "& .MuiTableSortLabel-icon": {
                            color: "#10B981 !important",
                          },
                        }}
                      >
                        Note
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#A0AEC0",
                        fontWeight: "bold",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        width: "20%",
                      }}
                    >
                      Tags / Category
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#A0AEC0",
                        fontWeight: "bold",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        width: "20%",
                      }}
                    >
                      Group
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#A0AEC0",
                        fontWeight: "bold",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        width: "20%",
                      }}
                    >
                      <TableSortLabel
                        active={sortBy === "createdAt"}
                        direction={sortBy === "createdAt" ? sortDir : "desc"}
                        onClick={() => handleSortRequest("createdAt")}
                        sx={{
                          color: "#A0AEC0 !important",
                          "& .MuiTableSortLabel-icon": {
                            color: "#10B981 !important",
                          },
                        }}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: "#A0AEC0",
                        fontWeight: "bold",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        width: "10%",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ py: 5, color: "#A0AEC0", borderBottom: "none" }}
                      >
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow
                        key={tx.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <Typography variant="body2" fontWeight="500">
                            {tx.notes || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {renderTags(tx.transactionTags)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#A0AEC0",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {tx.group?.name || "-"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "#fff",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {formatDate(tx.createdAt)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, tx)}
                            sx={{ color: "#A0AEC0" }}
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            )}
          </Box>

          <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: "#1A202C",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  "& .MuiMenuItem-root:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  },
                },
              }}
            >
              <MuiMenuItem onClick={handleUpdate}>
                <ListItemIcon>
                  <EditIcon fontSize="small" sx={{ color: "#10B981" }} />
                </ListItemIcon>
                <ListItemText primary="Edit" />
              </MuiMenuItem>
              <MuiMenuItem onClick={handleDelete}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" sx={{ color: "#ef4444" }} />
                </ListItemIcon>
                <ListItemText primary="Delete" sx={{ color: "#ef4444" }} />
              </MuiMenuItem>
            </Menu>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count, page }) => {
                return `Page ${page + 1} of ${Math.ceil(count / rowsPerPage)}`;
              }}
              sx={{
                color: "#A0AEC0",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                ".MuiTablePagination-selectIcon": { color: "#A0AEC0" },
                ".MuiIconButton-root": { color: "#fff" },
                ".Mui-disabled": { color: "rgba(255,255,255,0.2) !important" },
              }}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}
