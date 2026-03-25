import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  Modal,
  TextField,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tooltip as MuiTooltip,
  Chip,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Groups as Users,
  Add as Plus,
  Close as X,
  PersonAdd as UserPlus,
  Shield as Security,
  Person as UserIcon,
  Search,
  MoreHoriz,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Logout as LeaveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  getUserGroups,
  createGroup,
  searchUsers,
  addMemberToGroup,
  getGroupMembers,
  getGroupMemberCount,
  getGroupTransactions,
  getGroupMyShare,
  removeMember,
  deleteGroup,
  leaveGroup,
} from "../../api/groups";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { ReceiptLong as TransactionIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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

const GroupCard = ({ membership, color, onAddMember, onViewMembers, onViewTransactions, onDeleteGroup, onLeaveGroup }) => {
  const { group, role } = membership;
  const isAdmin = role === "ADMIN";
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [memberCount, setMemberCount] = useState(group.memberCount || 0);
  const [expenseSummary, setExpenseSummary] = useState({ totalExpense: 0, yourShare: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [count, summary] = await Promise.all([
          getGroupMemberCount(group.id),
          getGroupMyShare(group.id)
        ]);
        setMemberCount(count);
        if (summary) setExpenseSummary(summary);
      } catch (error) {
        console.error("Failed to fetch group data:", error);
      }
    };
    if (group.id) fetchData();
  }, [group.id]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddMemberClick = () => {
    handleMenuClose();
    if (!isAdmin) {
      MySwal.fire({
        title: "Access Denied",
        text: "Only group admins can add new members.",
        icon: "error",
        background: "#1A202C",
        color: "#fff",
        confirmButtonColor: "#10B981",
      });
      return;
    }
    onAddMember(group);
  };

  const handleViewMembersClick = () => {
    handleMenuClose();
    onViewMembers(group, role);
  };

  const handleViewTransactionsClick = () => {
    handleMenuClose();
    onViewTransactions(group);
  };

  const handleDeleteGroupClick = () => {
    handleMenuClose();
    onDeleteGroup(group);
  };

  const handleLeaveGroupClick = () => {
    handleMenuClose();
    onLeaveGroup(group);
  };

  const handleUpdate = () => {
    handleMenuClose();
    // Implementation for update if needed
  };

  // Use actual data from API
  const totalExpenses = Number(expenseSummary.totalExpense || 0).toFixed(2);
  const yourShare = Number(expenseSummary.yourShare || 0).toFixed(2);

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Paper
        sx={{
          p: 3,
          bgcolor: "#111",
          color: "#fff",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          height: "100%",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "rgba(16, 185, 129, 0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          },
        }}
      >
        {/* More Menu Icon - Visible on hover */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s ease",
            zIndex: 2,
          }}
        >
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ color: "#A0AEC0", "&:hover": { color: "#fff" } }}
          >
            <MoreHoriz />
          </IconButton>
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
              mt: 1,
              "& .MuiMenuItem-root:hover": {
                bgcolor: "rgba(255,255,255,0.05)",
              },
            },
          }}
        >
          <MuiMenuItem onClick={handleViewMembersClick}>
            <ListItemIcon>
              <Users sx={{ color: "#10B981" }} size={18} />
            </ListItemIcon>
            <MuiListItemText primary="View Members" />
          </MuiMenuItem>
          <MuiMenuItem onClick={handleViewTransactionsClick}>
            <ListItemIcon>
              <TransactionIcon sx={{ color: "#F59E0B" }} size={18} />
            </ListItemIcon>
            <MuiListItemText primary="View Transactions" />
          </MuiMenuItem>
          <MuiMenuItem onClick={handleAddMemberClick}>
            <ListItemIcon>
              <UserPlus sx={{ color: "#3B82F6" }} size={18} />
            </ListItemIcon>
            <MuiListItemText primary="Add Members" />
          </MuiMenuItem>
          {isAdmin ? (
            <MuiMenuItem onClick={handleDeleteGroupClick}>
              <ListItemIcon>
                <DeleteIcon sx={{ color: "#ef4444" }} size={18} />
              </ListItemIcon>
              <MuiListItemText primary="Delete Group" sx={{ color: "#ef4444" }} />
            </MuiMenuItem>
          ) : (
            <MuiMenuItem onClick={handleLeaveGroupClick}>
              <ListItemIcon>
                <LeaveIcon sx={{ color: "#ef4444" }} size={18} />
              </ListItemIcon>
              <MuiListItemText primary="Leave Group" sx={{ color: "#ef4444" }} />
            </MuiMenuItem>
          )}
        </Menu>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: color,
              mr: 2,
              boxShadow: `0 0 15px ${color}44`,
            }}
          >
            <Users size={24} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
              {group.name}
            </Typography>
            <Typography variant="body2" color="#A0AEC0">
              {memberCount} Members
            </Typography>
          </Box>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{
            mt: "auto",
            pt: 2,
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Grid item xs={6}>
            <Typography
              variant="caption"
              color="#A0AEC0"
              sx={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              Total Expenses
            </Typography>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "#10B981" }}
            >
              ₹{totalExpenses}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              color="#A0AEC0"
              sx={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              Your Share
            </Typography>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "#3B82F6" }}
            >
              ₹{yourShare}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </motion.div>
  );
};

const ViewMembersModal = ({ open, onClose, group, isAdmin }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!group) return;
    try {
      setLoading(true);
      const data = await getGroupMembers(group.id);
      setMembers(data || []);
    } catch (error) {
      console.error("Failed to fetch group members:", error);
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => {
    if (open) fetchMembers();
  }, [open, fetchMembers]);

  const handleRemove = async (userId) => {
    const result = await MySwal.fire({
      title: "Remove Member?",
      text: "Are you sure you want to remove this member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "Yes, remove!",
      background: "#111",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await removeMember(group.id, userId);
        MySwal.fire({
          title: "Removed!",
          text: "Member removed successfully.",
          icon: "success",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#10B981",
        });
        await fetchMembers();
      } catch (error) {
        console.error("Failed to remove member:", error);
        MySwal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to remove member.",
          icon: "error",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          maxHeight: "85vh",
          bgcolor: "#111",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.1)",
          p: 4,
          position: "relative",
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#A0AEC0" }}
        >
          <X size={20} />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#fff", mb: 3 }}
        >
          {group?.name} Members
        </Typography>

        <Box 
          sx={{ 
            flexGrow: 1, 
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress size={30} sx={{ color: "#10B981" }} />
            </Box>
          ) : (
            <List>
              {members.map((m) => (
                <React.Fragment key={m.id}>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(16, 185, 129, 0.1)",
                          color: "#10B981",
                        }}
                      >
                        <UserIcon size={20} />
                      </Avatar>
                    </ListItemAvatar>
                    <MuiListItemText
                      primary={
                        <Typography variant="body1" sx={{ color: "#fff" }}>
                          {m.user.name}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "#A0AEC0" }}
                          >
                            @{m.user.username}
                          </Typography>
                          {m.role === "ADMIN" && (
                            <Chip
                              label="Admin"
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: "0.6rem",
                                bgcolor: "rgba(16, 185, 129, 0.2)",
                                color: "#10B981",
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                    {isAdmin && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleRemove(m.user.id)}
                        sx={{
                          color: "#ef4444",
                          borderColor: "#ef4444",
                          textTransform: "none",
                          "&:hover": {
                            borderColor: "#dc2626",
                            bgcolor: "rgba(239, 68, 68, 0.05)",
                          },
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </ListItem>
                  <Divider sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

const AddMemberModal = ({ open, onClose, group, onMemberAdded }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const users = await searchUsers(debouncedQuery);
        setResults(users || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      fetchSearch();
    }
  }, [debouncedQuery, open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const users = await searchUsers(query);
      setResults(users || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (userId) => {
    setAddingId(userId);
    try {
      await addMemberToGroup(group.id, userId);
      MySwal.fire({
        title: "Added!",
        text: "User added to group successfully.",
        icon: "success",
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#10B981",
      });
      onMemberAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add member:", error);
      MySwal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to add member.",
        icon: "error",
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          maxHeight: "80vh",
          bgcolor: "#111",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.1)",
          p: 4,
          position: "relative",
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#A0AEC0" }}
        >
          <X size={20} />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#fff", mb: 1 }}
        >
          Add Member
        </Typography>
        <Typography variant="body2" sx={{ color: "#A0AEC0", mb: 3 }}>
          Add a new member to <strong>{group?.name}</strong>.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by username or email..."
            variant="outlined"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#10B981" },
              },
            }}
          />
          <IconButton
            onClick={handleSearch}
            sx={{
              color: "#10B981",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Search size={20} />
            )}
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", minHeight: 100 }}>
          {results.length > 0 ? (
            <List sx={{ pt: 0 }}>
              {results.map((user) => (
                <React.Fragment key={user.id}>
                  <ListItem
                    secondaryAction={
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAdd(user.id)}
                        disabled={addingId === user.id}
                        sx={{
                          color: "#10B981",
                          borderColor: "#10B981",
                          textTransform: "none",
                          "&:hover": {
                            borderColor: "#0f9d6c",
                            bgcolor: "rgba(16, 185, 129, 0.05)",
                          },
                        }}
                      >
                        {addingId === user.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          "Add"
                        )}
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(59, 130, 246, 0.1)",
                          color: "#3B82F6",
                        }}
                      >
                        <UserIcon size={20} />
                      </Avatar>
                    </ListItemAvatar>
                    <MuiListItemText
                      primary={
                        <Typography variant="body1" sx={{ color: "#fff" }}>
                          {user.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: "#A0AEC0" }}>
                          @{user.username}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                </React.Fragment>
              ))}
            </List>
          ) : (
            !loading &&
            query && (
              <Typography
                variant="body2"
                sx={{ color: "#A0AEC0", textAlign: "center", mt: 4 }}
              >
                No users found matching "{query}".
              </Typography>
            )
          )}
        </Box>
      </Box>
    </Modal>
  );
};

const ViewTransactionsModal = ({ open, onClose, group }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!group) return;
    try {
      setLoading(true);
      const data = await getGroupTransactions(group.id);
      setTransactions(data || []);
    } catch (error) {
      console.error("Failed to fetch group transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => {
    if (open) fetchTransactions();
  }, [open, fetchTransactions]);

  const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;
  const formatDate = (date) => dayjs(date).format("DD MMM YYYY, hh:mm A");

  const renderTags = (transactionTags) => {
    if (!transactionTags || transactionTags.length === 0) return "-";
    return (
      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center" }}>
        {transactionTags.map((item) => (
          <Chip
            key={item.id}
            size="small"
            label={item.tag?.name}
            sx={{
              bgcolor: "rgba(16, 185, 129, 0.15)",
              color: "#10B981",
              fontSize: "0.7rem",
            }}
          />
        ))}
      </Box>
    );
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: 800,
          maxWidth: "95vw",
          maxHeight: "85vh",
          bgcolor: "#111",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.1)",
          p: { xs: 2, sm: 4 },
          position: "relative",
          outline: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#A0AEC0" }}
        >
          <X size={20} />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#fff", mb: 3, pr: 4 }}
        >
          {group?.name} Transactions
        </Typography>

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress size={30} sx={{ color: "#10B981" }} />
            </Box>
          ) : isMobile ? (
            <List sx={{ p: 0 }}>
              {transactions.length === 0 ? (
                <Typography align="center" sx={{ py: 4, color: "#A0AEC0" }}>
                  No transactions found for this group.
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
                        <Typography variant="body1" fontWeight="500" sx={{ color: "#fff" }}>
                          {tx.title || "-"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#A0AEC0", display: "block", mt: 0.5 }}>
                          {formatDate(tx.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#10B981" }}>
                        {formatCurrency(tx.amount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        {renderTags(tx.transactionTags)}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
                        <Avatar sx={{ width: 20, height: 20, fontSize: "0.7rem", bgcolor: "#10B981" }}>
                          {tx.createdBy?.name?.[0] || "?"}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: "#A0AEC0", whiteSpace: "nowrap" }}>
                          {tx.createdBy?.name || "Unknown"}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))
              )}
            </List>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: "transparent", boxShadow: "none" }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ "& th": { color: "#A0AEC0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: "bold" } }}>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">By</TableCell>
                    <TableCell align="center">Note</TableCell>
                    <TableCell align="center">Tags</TableCell>
                    <TableCell align="center">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: "#A0AEC0", py: 4, border: "none" }}>
                        No transactions found for this group.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} sx={{ "& td": { color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.05)" }, "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}>
                        <TableCell align="center" sx={{ fontWeight: "bold", color: "#10B981 !important" }}>
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                            {/* <Avatar sx={{ width: 24, height: 24, fontSize: "0.8rem", bgcolor: "#10B981" }}>
                              {tx.createdBy?.name?.[0] || "?"}
                            </Avatar> */}
                            <Typography variant="body2">{tx.createdBy?.name || "Unknown"}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{tx.title}</Typography>
                          {tx.notes && tx.notes !== tx.title && (
                            <Typography variant="caption" color="#A0AEC0">{tx.notes}</Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">{renderTags(tx.transactionTags)}</TableCell>
                        <TableCell align="center" sx={{ color: "#A0AEC0 !important" }}>{formatDate(tx.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

const CreateGroupModal = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onCreate(name);
      setName("");
      onClose();
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          bgcolor: "#111",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.1)",
          p: 4,
          position: "relative",
          outline: "none",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#A0AEC0" }}
        >
          <X size={20} />
        </IconButton>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#fff", mb: 1 }}
        >
          Create New Group
        </Typography>
        <Typography variant="body2" sx={{ color: "#A0AEC0", mb: 3 }}>
          Organize your shared expenses with a new group.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Group Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#10B981" },
              },
              "& .MuiInputLabel-root": { color: "#A0AEC0" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#10B981" },
              mb: 4,
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              bgcolor: "#10B981",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": { bgcolor: "#0f9d6c" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Group"
            )}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default function Groups() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [viewMembersModalOpen, setViewMembersModalOpen] = useState(false);
  const [viewTransactionsModalOpen, setViewTransactionsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#ec4899",
  ];

  const fetchGroups = async () => {
    try {
      setLoading(true);
      // No longer sending hardcoded userId, backend will extract from token
      const data = await getUserGroups();
      setMemberships(data || []);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (name) => {
    try {
      // No longer sending hardcoded userId, backend will extract from token
      await createGroup(name);
      MySwal.fire({
        title: "Success!",
        text: "Group created successfully.",
        icon: "success",
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#10B981",
      });
      fetchGroups();
    } catch (error) {
      console.error("Failed to create group:", error);
      MySwal.fire({
        title: "Error!",
        text: "Failed to create group.",
        icon: "error",
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const openAddMember = (group) => {
    setSelectedGroup(group);
    setAddMemberModalOpen(true);
  };

  const openViewMembers = (group, role) => {
    setSelectedGroup(group);
    setSelectedRole(role);
    setViewMembersModalOpen(true);
  };

  const handleDeleteGroup = async (group) => {
    const result = await MySwal.fire({
      title: "Delete Group?",
      text: `Do you really want to delete "${group.name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "Yes, delete!",
      background: "#111",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await deleteGroup(group.id);
        MySwal.fire({
          title: "Deleted!",
          text: "Group deleted successfully.",
          icon: "success",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#10B981",
        });
        fetchGroups();
      } catch (error) {
        console.error("Failed to delete group:", error);
        MySwal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to delete group.",
          icon: "error",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  const handleLeaveGroup = async (group) => {
    const result = await MySwal.fire({
      title: "Leave Group?",
      text: `Are you sure you want to leave "${group.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3B82F6",
      confirmButtonText: "Yes, leave!",
      background: "#111",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await leaveGroup(group.id);
        MySwal.fire({
          title: "Left!",
          text: "You have left the group successfully.",
          icon: "success",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#10B981",
        });
        fetchGroups();
      } catch (error) {
        console.error("Failed to leave group:", error);
        MySwal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to leave group.",
          icon: "error",
          background: "#111",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };
  const openViewTransactions = (group) => {
    setSelectedGroup(group);
    setViewTransactionsModalOpen(true);
  };

  return (
    <Box maxWidth="xl" mx="auto">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "#fff",
              background: "linear-gradient(45deg, #fff 30%, #10B981 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Groups
          </Typography>
          <Typography variant="body1" sx={{ color: "#A0AEC0", mt: 0.5 }}>
            Manage and track shared expenses with your friends and family.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            bgcolor: "#10B981",
            color: "#fff",
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#0f9d6c" },
            boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
            alignSelf: { xs: "stretch", sm: "auto" }
          }}
        >
          Create New Group
        </Button>
      </Box>

      <Box sx={{ mt: 6 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
            <CircularProgress sx={{ color: "#10B981" }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {memberships.length === 0 ? (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 8,
                    bgcolor: "#111",
                    color: "#fff",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.05)",
                    textAlign: "center",
                  }}
                >
                  <Users
                    size={48}
                    color="#A0AEC0"
                    style={{ marginBottom: 16 }}
                  />
                  <Typography variant="h6" color="#A0AEC0">
                    No groups found. Create one to start sharing expenses!
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              memberships.map((membership, index) => (
                <Grid item xs={12} sm={6} md={4} key={membership.id}>
                  <GroupCard
                    membership={membership}
                    color={colors[index % colors.length]}
                    onAddMember={openAddMember}
                    onViewMembers={openViewMembers}
                    onViewTransactions={openViewTransactions}
                    onDeleteGroup={handleDeleteGroup}
                    onLeaveGroup={handleLeaveGroup}
                  />
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>

      <CreateGroupModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateGroup}
      />

      <AddMemberModal
        open={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        group={selectedGroup}
        onMemberAdded={fetchGroups}
      />

      <ViewMembersModal
        open={viewMembersModalOpen}
        onClose={() => setViewMembersModalOpen(false)}
        group={selectedGroup}
        isAdmin={selectedRole === 'ADMIN'}
      />
      <ViewTransactionsModal
        open={viewTransactionsModalOpen}
        onClose={() => setViewTransactionsModalOpen(false)}
        group={selectedGroup}
      />
    </Box>
  );
}
