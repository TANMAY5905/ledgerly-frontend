import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Chip,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getAllTags } from "../../api/tags";
import { updateTransaction } from "../../api/transactions";
import { getUserGroups } from "../../api/groups";

const MySwal = withReactContent(Swal);

const validationSchema = Yup.object({
  type: Yup.string().required("Transaction type is required"),
  amount: Yup.number()
    .min(0, "Amount cannot be negative")
    .required("Amount is required"),
  category: Yup.array()
    .min(1, "Select at least one category")
    .required("Category is required"),
  group: Yup.string(),
  date: Yup.date()
    .required("Date is required")
    .test("is-not-future", "Date cannot be in the future", (value) => {
      return value ? dayjs(value).isBefore(dayjs().add(1, "minute")) : false;
    }),
  note: Yup.string().max(250, "Note must be under 250 characters"),
});

export default function UpdateTransaction() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;

  const [tags, setTags] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  // If no transaction data in state, redirect back
  useEffect(() => {
    if (!transaction) {
      navigate("/transaction-history");
    }
  }, [transaction, navigate]);

  const fetchTags = async () => {
    try {
      const data = await getAllTags();
      const tagArray = Array.isArray(data) ? data : data?.tags || [];
      setTags(tagArray);
    } catch (err) {
      console.error("Failed to load tags:", err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await getUserGroups();
      const groupArray = Array.isArray(data) ? data.map((m) => m.group) : [];
      setGroups(groupArray);
    } catch (err) {
      console.error("Failed to load groups:", err);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchGroups();
  }, []);

  const formik = useFormik({
    initialValues: {
      type: "expense",
      amount: transaction?.amount || "",
      category: transaction?.transactionTags?.map((item) => item.tag) || [],
      group: transaction?.group?.id || "",
      date: dayjs(transaction?.createdAt) || dayjs(),
      note: transaction?.notes || transaction?.title || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const tagIds = values.category.map((tag) => tag.id || tag._id);

        await updateTransaction(id, {
          groupId: values.group || null,
          title:
            values.note || `Transaction on ${values.date.format("YYYY-MM-DD")}`,
          amount: values.amount,
          tagIds: tagIds,
          note: values.note,
          date: values.date.toISOString(),
        });

        MySwal.fire({
          title: "Success!",
          text: "Transaction updated successfully.",
          icon: "success",
          background: "#1A202C",
          color: "#fff",
          confirmButtonColor: "#10B981",
          iconColor: "#10B981",
        }).then(() => {
          navigate("/transaction-history");
        });
      } catch (err) {
        console.error("Failed to update transaction:", err);
        MySwal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to update transaction",
          icon: "error",
          background: "#1A202C",
          color: "#fff",
          confirmButtonColor: "#10B981",
        });
      }
    },
  });

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
      "&.Mui-focused fieldset": { borderColor: "#10B981" },
    },
    "& .MuiInputLabel-root": { color: "#A0AEC0" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#10B981" },
    "& .MuiFormHelperText-root": { color: "#ef4444" },
  };

  if (!transaction) return null;

  return (
    <Box maxWidth="md" mx="auto">
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#fff", mb: 3 }}
      >
        Update Transaction
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          bgcolor: "#111",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Box component="form" onSubmit={formik.handleSubmit}>
          {/* Row 1: Type, Amount, Category */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 5 },
              mb: { xs: 3, md: 7 },
              mt: 5,
            }}
          >
            {/* Type */}
            <Box sx={{ flex: 1 }}>
              <TextField
                select
                fullWidth
                disabled
                id="type"
                name="type"
                label="Type"
                value={formik.values.type}
                onChange={formik.handleChange}
                sx={textFieldSx}
                SelectProps={{
                  sx: { "& .MuiSelect-icon": { color: "#fff" } },
                }}
              >
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Box>

            {/* Amount */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                id="amount"
                name="amount"
                label="Amount"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="#A0AEC0">₹</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Box>

            {/* Category */}
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                multiple
                id="category"
                options={tags}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) =>
                  (option.id || option._id) === (value.id || value._id)
                }
                value={formik.values.category}
                onChange={(e, newValue) =>
                  formik.setFieldValue("category", newValue)
                }
                onBlur={() => formik.setFieldTouched("category", true)}
                loading={isLoadingTags}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option.id || option._id || option.name}
                      variant="filled"
                      label={option.name}
                      sx={{
                        bgcolor: "rgba(16, 185, 129, 0.2)",
                        color: "#10B981",
                        "& .MuiChip-deleteIcon": {
                          color: "#10B981",
                          "&:hover": { color: "#0f9d6c" },
                        },
                      }}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categories"
                    placeholder="Search categories..."
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                    helperText={
                      formik.touched.category && formik.errors.category
                    }
                    sx={textFieldSx}
                  />
                )}
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
            </Box>
          </Box>

          {/* Row 2: Group, Date, note */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 5 },
              mb: { xs: 5, md: 7 },
              mt: { xs: 0, md: 5 },
            }}
          >
            {/* Group */}
            <Box sx={{ flex: 1 }}>
              <TextField
                select
                fullWidth
                id="group"
                name="group"
                label="Group (Optional)"
                value={formik.values.group}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.group && Boolean(formik.errors.group)}
                helperText={formik.touched.group && formik.errors.group}
                sx={textFieldSx}
                SelectProps={{
                  sx: { "& .MuiSelect-icon": { color: "#fff" } },
                }}
              >
                <MenuItem value="">
                  <em>None (Personal)</em>
                </MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Date */}
            <Box sx={{ flex: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(newValue) =>
                    formik.setFieldValue("date", newValue)
                  }
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#10B981" },
                    },
                    "& .MuiInputLabel-root": { color: "#A0AEC0" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#10B981" },
                    "& .MuiSvgIcon-root": { color: "#A0AEC0" },
                  }}
                  slotProps={{
                    textField: {
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText: formik.touched.date && formik.errors.date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            {/* note */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                id="note"
                name="note"
                label="Note"
                placeholder="What was this for?"
                value={formik.values.note}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.note && Boolean(formik.errors.note)}
                helperText={formik.touched.note && formik.errors.note}
                sx={textFieldSx}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              gap: 3,
              mb: 5,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/transaction-history")}
              sx={{
                py: 1.5,
                px: 6,
                color: "#A0AEC0",
                borderColor: "#A0AEC0",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#fff",
                  color: "#fff",
                  borderWidth: 2,
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                px: 6,
                bgcolor: "#10B981",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
                "&:hover": {
                  bgcolor: "#0f9d6c",
                  boxShadow: "0 6px 20px rgba(16, 185, 129, 0.23)",
                },
              }}
            >
              Update Transaction
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
