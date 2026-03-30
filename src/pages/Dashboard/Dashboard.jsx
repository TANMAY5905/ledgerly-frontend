import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton as MuiIconButton,
  Slide
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Brush,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Activity,
  Tags,
} from "lucide-react";
import { getDashboardData, getGroupDashboardData } from "../../api/dashboard";
import { getUserGroups } from "../../api/groups";
import dayjs from "dayjs";
import Ads from "../../components/Ads/Ads";


const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

const glassPaperStyle = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 4,
  background:
    "linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(17, 17, 17, 0.95) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.5)",
  position: "relative",
  overflow: "hidden",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 40px 0 rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
  },
};

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  delay,
  colorClass = "#10b981",
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 15 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    style={{ height: "100%" }}
  >
    <Paper
      sx={{
        ...glassPaperStyle,
        height: "100%",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px 0 rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 150,
          height: 150,
          background: `radial-gradient(circle, ${colorClass}30 0%, transparent 70%)`,
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#A0AEC0",
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            component="div"
            fontWeight="800"
            sx={{ color: "#fff", letterSpacing: "-0.5px" }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            background: `${colorClass}15`,
            color: colorClass,
            border: `1px solid ${colorClass}30`,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {trend === "up" ? (
          <TrendingUp size={18} color="#10b981" />
        ) : trend === "down" ? (
          <TrendingDown size={18} color="#ef4444" />
        ) : (
          <Activity size={18} color="#A0AEC0" />
        )}
        <Typography
          variant="body2"
          sx={{
            color:
              trend === "up"
                ? "#10b981"
                : trend === "down"
                  ? "#ef4444"
                  : "#A0AEC0",
            fontWeight: 600,
          }}
        >
          {trendValue}
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
          vs last period
        </Typography>
      </Box>
    </Paper>
  </motion.div>
);

export default function Dashboard() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [enlargedChart, setEnlargedChart] = useState(null);

  const [filterType, setFilterType] = useState('LAST_7_DAYS');
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('PERSONAL');

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await getUserGroups();
        setGroups(res);
      } catch (err) {
        console.error("Error loading groups:", err);
      }
    };
    loadGroups();
  }, []);

  const handleResetFilters = () => {
    setSelectedGroupId('PERSONAL');
    setFilterType('LAST_7_DAYS'); 
    setCustomStart(null);
    setCustomEnd(null);
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (selectedGroupId === 'PERSONAL') {
        if (filterType === 'CUSTOM' && (!customStart || !customEnd)) {
          setLoading(false);
          return;
        }
        
        const startStr = customStart ? customStart.format('YYYY-MM-DD') : null;
        const endStr = customEnd ? customEnd.format('YYYY-MM-DD') : null;

        const res = await getDashboardData(filterType, startStr, endStr);
        setData(res);
      } else {
        const res = await getGroupDashboardData(selectedGroupId);
        setData({
          totalExpense: res.totalExpense || 0,
          perPersonShare: res.perPersonShare || 0,
          dailyExpenses: res.monthlyExpenses?.map(m => ({ date: m.month, total: m.total })) || [],
          tagExpenses: res.memberExpenses?.map(m => ({ tagName: m.username, total: m.amount })) || [],
          groupExpenses: res.memberExpenses?.map(m => ({ groupName: m.username, total: m.amount })) || [],
          recentTransactions: res.settlements?.map((s, i) => ({
            id: i,
            title: `${s.fromUser} -> ${s.toUser}`,
            createdAt: new Date().toISOString(),
            amount: s.amount
          })) || []
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filterType, customStart, customEnd, selectedGroupId]);

  if (loading) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top right, #111 0%, #000 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={50} thickness={4} sx={{ color: "#10b981" }} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top right, #111 0%, #000 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="error" variant="h6">
          {error || "No data available."}
        </Typography>
      </Box>
    );
  }

  const dailyData =
    data.dailyExpenses?.map((d) => ({
      name: selectedGroupId === 'PERSONAL' ? dayjs(d.date).format("MMM DD") : d.date,
      amount: d.total || 0,
    })) || [];

  const tagData =
    data.tagExpenses
      ?.map((t) => ({
        name: t.tagName || "Unknown",
        value: parseFloat(t.total) || 0,
      }))
      .filter((t) => t.value > 0.001) || [];

  const groupData =
    data.groupExpenses?.map((g) => ({
      name: selectedGroupId === 'PERSONAL' ? (g.groupName ? `Group ${g.groupName}` : "Personal") : g.groupName,
      amount: g.total || 0,
    })) || [];

  const avgDaily =
    dailyData.length > 0 ? (data.totalExpense || 0) / dailyData.length : 0;

  const totalTagAmount = tagData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(16, 185, 129, 0.1) 0%, #0a0a0a 60%, #000000 100%)",
        pb: 8,
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          pt: { xs: 4, md: 6 },
        }}
      >
        {/* HEADER */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
          <Box sx={{ maxWidth: 1500, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
            <Box>
              <Typography
                variant="h4"
                md="h3"
                fontWeight="800"
                sx={{ color: "#fff", mb: 1 }}
              >
                Analytics Dashboard
              </Typography>
              <Typography variant="body1" sx={{ color: "#A0AEC0" }}>
                Your complete financial overview.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: '#A0AEC0', '&.Mui-focused': { color: '#10B981' } }}>View As</InputLabel>
                <Select
                  value={selectedGroupId}
                  label="View As"
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  sx={{
                    color: '#fff',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10B981' },
                    '.MuiSvgIcon-root': { color: '#A0AEC0' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { bgcolor: '#1A202C', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                    }
                  }}
                >
                  <MenuItem value="PERSONAL">Personal</MenuItem>
                  {groups.map((g) => (
                    <MenuItem key={g.group.id} value={g.group.id}>
                      {g.group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedGroupId === 'PERSONAL' && (
                <>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel sx={{ color: '#A0AEC0', '&.Mui-focused': { color: '#10B981' } }}>Time Range</InputLabel>
                    <Select
                      value={filterType}
                      label="Time Range"
                      onChange={(e) => setFilterType(e.target.value)}
                      sx={{
                        color: '#fff',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#10B981' },
                        '.MuiSvgIcon-root': { color: '#A0AEC0' }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: { bgcolor: '#1A202C', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
                        }
                      }}
                    >
                      <MenuItem value="LAST_7_DAYS">Last 7 Days</MenuItem>
                      <MenuItem value="LAST_MONTH">Last Month</MenuItem>
                      <MenuItem value="LAST_3_MONTHS">Last 3 Months</MenuItem>
                      <MenuItem value="CUSTOM">Custom Range</MenuItem>
                    </Select>
                  </FormControl>

                  {filterType === 'CUSTOM' && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start Date"
                        value={customStart}
                        onChange={(newValue) => setCustomStart(newValue)}
                        slotProps={{
                          textField: { 
                            size: 'small', 
                            sx: {
                              width: 140,
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&.Mui-focused fieldset": { borderColor: "#10B981" },
                              },
                              "& .MuiInputLabel-root": { color: "#A0AEC0" },
                              "& .MuiInputLabel-root.Mui-focused": { color: "#10B981" },
                              "& .MuiSvgIcon-root": { color: "#A0AEC0" },
                            }
                          }
                        }}
                      />
                      <DatePicker
                        label="End Date"
                        value={customEnd}
                        onChange={(newValue) => setCustomEnd(newValue)}
                        slotProps={{
                          textField: { 
                            size: 'small', 
                            sx: {
                              width: 140,
                              "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                "&.Mui-focused fieldset": { borderColor: "#10B981" },
                              },
                              "& .MuiInputLabel-root": { color: "#A0AEC0" },
                              "& .MuiInputLabel-root.Mui-focused": { color: "#10B981" },
                              "& .MuiSvgIcon-root": { color: "#A0AEC0" },
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  )}
                </>
              )}
              
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleResetFilters}
                sx={{
                  color: "#A0AEC0",
                  borderColor: "rgba(255,255,255,0.1)",
                  backgroundColor: "#1A202C",
                  height: "40px",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  },
                  textTransform: "none",
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ===================== SECTION 1: STAT CARDS ===================== */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Box sx={{ maxWidth: 1500, width: "100%" }}>
            <Paper sx={{ ...glassPaperStyle, p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <StatCard
                    {...{
                      title: "Total Expenses",
                      value: `₹${(data.totalExpense || 0).toFixed(2)}`,
                      icon: <Wallet />,
                      trend: "down",
                      trendValue: "2.4%",
                      delay: 0.1,
                      colorClass: "#ef4444",
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <StatCard
                    {...{
                      title: selectedGroupId === 'PERSONAL' ? "Avg Daily Expense" : "Per Person Share",
                      value: selectedGroupId === 'PERSONAL' ? `₹${avgDaily.toFixed(2)}` : `₹${(data.perPersonShare || 0).toFixed(2)}`,
                      icon: <DollarSign />,
                      trend: "up",
                      trendValue: "1.2%",
                      delay: 0.2,
                      colorClass: "#3b82f6",
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <StatCard
                    {...{
                      title: selectedGroupId === 'PERSONAL' ? "Active Categories" : "Active Members",
                      value: tagData.length,
                      icon: <Tags />,
                      trend: "neutral",
                      trendValue: "-",
                      delay: 0.3,
                      colorClass: "#10b981",
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <StatCard
                    {...{
                      title: selectedGroupId === 'PERSONAL' ? "Recent Transactions" : "Pending Settlements",
                      value: data.recentTransactions?.length || 0,
                      icon: <Activity />,
                      trend: "up",
                      trendValue: "10%",
                      delay: 0.4,
                      colorClass: "#8b5cf6",
                    }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* AdSense Integration */}
            <Ads adSlot="0987654321" />
          </Box>
        </Box>


        {/* ===================== SECTION 2 ===================== */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Box sx={{ maxWidth: 1500, width: "100%" }}>
            <Paper sx={{ ...glassPaperStyle, p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {/* DAILY TREND */}
                <Box sx={{ flex: 1 }}>
                  <Paper
                    sx={{ ...glassPaperStyle, height: { xs: 350, md: 440 } }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: "#fff" }}>
                        {selectedGroupId === 'PERSONAL' ? 'Daily Expense Trend' : 'Monthly Expense Trend'}
                      </Typography>
                      <MuiIconButton 
                        size="small" 
                        onClick={() => setEnlargedChart({ type: 'line', title: selectedGroupId === 'PERSONAL' ? 'Daily Expense Trend' : 'Monthly Expense Trend', data: dailyData })}
                        sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                      >
                        <FullscreenIcon />
                      </MuiIconButton>
                    </Box>
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: '100%', 
                        mt: 1, 
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': { height: '6px' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px' }
                      }}
                    >
                      {dailyData.length > 0 ? (
                        <Box sx={{ minWidth: dailyData.length > 20 ? dailyData.length * 40 : '100%', height: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                            <LineChart data={dailyData} margin={{ bottom: 20 }}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.05)"
                              />
                              <XAxis 
                                dataKey="name" 
                                stroke="#A0AEC0" 
                                angle={-45} 
                                textAnchor="end" 
                                height={60}
                                interval={dailyData.length > 15 ? 'preserveStartEnd' : 0}
                              />
                              <YAxis 
                                stroke="#A0AEC0" 
                                width={80}
                                tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#000000",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                                }}
                                itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                                labelStyle={{
                                  color: "#A0AEC0",
                                  paddingBottom: "4px",
                                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                                  marginBottom: "4px",
                                }}
                                cursor={{
                                  stroke: "rgba(255, 255, 255, 0.1)",
                                  strokeWidth: 2,
                                }}
                                formatter={(value) => [`₹${value}`, "Expense"]}
                              />
                              <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#10b981' }}
                                activeDot={{ r: 6 }}
                              />
                              {dailyData.length > 15 && (
                                <Brush 
                                  dataKey="name" 
                                  height={30} 
                                  stroke="#10b981" 
                                  fill="#111" 
                                  travellerWidth={10}
                                />
                              )}
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body2" color="#A0AEC0">No expense data for this period</Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>

                {/* CATEGORY */}
                <Box sx={{ flex: 1 }}>
                  <Paper
                    sx={{ ...glassPaperStyle, height: { xs: 350, md: 440 } }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: "#fff" }}>
                        {selectedGroupId === 'PERSONAL' ? 'Category Breakdown' : 'Member Breakdown'}
                      </Typography>
                      <MuiIconButton 
                        size="small" 
                        onClick={() => setEnlargedChart({ type: 'pie', title: selectedGroupId === 'PERSONAL' ? 'Category Breakdown' : 'Member Breakdown', data: tagData })}
                        sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                      >
                        <FullscreenIcon />
                      </MuiIconButton>
                    </Box>
                    <Box sx={{ height: '100%', width: '100%', mt: 1 }}>
                      {tagData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                          <PieChart>
                            <Pie data={tagData} dataKey="value" innerRadius="60%" outerRadius="80%" paddingAngle={5}>
                              {tagData.map((entry, index) => {
                                const hue = Math.round((index * 360) / Math.max(1, tagData.length));
                                return (
                                  <Cell
                                    key={index}
                                    fill={`hsl(${hue}, 70%, 50%)`}
                                  />
                                );
                              })}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#000000",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                              }}
                              itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                              formatter={(value, name) => {
                                const percent = totalTagAmount > 0 ? ((value / totalTagAmount) * 100).toFixed(1) : 0;
                                return [`₹${Number(value).toFixed(2)} (${percent}%)`, name];
                              }}
                            />
                            {isDesktop && <Legend />}
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body2" color="#A0AEC0">No category data available</Typography>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* ===================== SECTION 3 ===================== */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Box sx={{ maxWidth: 1500, width: "100%" }}>
            <Paper sx={{ ...glassPaperStyle, p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {/* GROUP */}
                <Box sx={{ flex: 1 }}>
                  <Paper
                    sx={{ ...glassPaperStyle, height: { xs: 350, md: 440 } }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: "#fff" }}>
                        {selectedGroupId === 'PERSONAL' ? 'Group Expenses Overview' : 'Member Expenses Overview'}
                      </Typography>
                      <MuiIconButton 
                        size="small" 
                        onClick={() => setEnlargedChart({ type: 'bar', title: selectedGroupId === 'PERSONAL' ? 'Group Expenses Overview' : 'Member Expenses Overview', data: groupData })}
                        sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                      >
                        <FullscreenIcon />
                      </MuiIconButton>
                    </Box>
                    <Box 
                      sx={{ 
                        height: '90%', 
                        width: '100%', 
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': { height: '6px' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px' }
                      }}
                    >
                      <Box sx={{ minWidth: groupData.length > 10 ? groupData.length * 80 : '100%', height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={groupData} margin={{ bottom: 20 }}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="rgba(255,255,255,0.05)"
                            />
                            <XAxis 
                              dataKey="name" 
                              stroke="#A0AEC0" 
                              angle={-45} 
                              textAnchor="end" 
                              height={60}
                              interval={0}
                            />
                            <YAxis 
                              stroke="#A0AEC0" 
                              width={80}
                              tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#000000",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                              }}
                              itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                              labelStyle={{
                                color: "#A0AEC0",
                                paddingBottom: "4px",
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                marginBottom: "4px",
                              }}
                              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                              formatter={(value) => [`₹${value}`, "Amount"]}
                            />
                            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                            {groupData.length > 8 && (
                              <Brush 
                                dataKey="name" 
                                height={30} 
                                stroke="#10b981" 
                                fill="#111" 
                                travellerWidth={10}
                              />
                            )}
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                {/* TRANSACTIONS */}
                <Box sx={{ flex: 1 }}>
                  <Paper
                    sx={{
                      ...glassPaperStyle,
                      height: { xs: 350, md: 440 },
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                      {selectedGroupId === 'PERSONAL' ? 'Recent Transactions' : 'Settlements'}
                    </Typography>
                    <List>
                      {data.recentTransactions?.slice(0, 5).map((tx) => (
                        <ListItem key={tx.id}>
                          <ListItemText
                            primary={tx.title}
                            secondary={selectedGroupId === 'PERSONAL' ? dayjs(tx.createdAt).format("DD MMM") : "Pending"}
                          />
                          ₹{tx.amount}
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      {/* CHART MODAL */}
      <Dialog
        fullScreen={!isDesktop}
        maxWidth="lg"
        fullWidth
        open={Boolean(enlargedChart)}
        onClose={() => setEnlargedChart(null)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        PaperProps={{
          sx: {
            bgcolor: "#0a0a0a",
            backgroundImage: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.1) 0%, #0a0a0a 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: isDesktop ? 4 : 0,
            color: "#fff",
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" fontWeight="800" sx={{ color: "#10b981" }}>
            {enlargedChart?.title}
          </Typography>
          <MuiIconButton
            onClick={() => setEnlargedChart(null)}
            sx={{ color: "#A0AEC0", "&:hover": { color: "#fff" } }}
          >
            <CloseIcon />
          </MuiIconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, md: 4 }, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          <Box 
            sx={{ 
              flexGrow: 1, 
              width: '100%', 
              height: 500,
              mt: 2,
              overflowX: 'auto',
              '&::-webkit-scrollbar': { height: '8px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '10px' }
            }}
          >
            {enlargedChart?.type === 'line' && (
              <Box sx={{ minWidth: enlargedChart.data.length > 10 ? enlargedChart.data.length * 60 : '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={enlargedChart.data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#A0AEC0" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#A0AEC0" 
                      tickFormatter={(value) => `₹${value}`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`₹${value}`, "Expense"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#10b981' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}

            {enlargedChart?.type === 'pie' && (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie 
                    data={enlargedChart.data} 
                    dataKey="value" 
                    innerRadius="50%" 
                    outerRadius="75%" 
                    paddingAngle={5}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                  >
                    {enlargedChart.data.map((entry, index) => {
                      const hue = Math.round((index * 360) / Math.max(1, enlargedChart.data.length));
                      return <Cell key={index} fill={`hsl(${hue}, 70%, 50%)`} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [`₹${Number(value).toFixed(2)}`, name]}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            )}

            {enlargedChart?.type === 'bar' && (
              <Box sx={{ minWidth: enlargedChart.data.length > 5 ? enlargedChart.data.length * 100 : '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={enlargedChart.data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#A0AEC0" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                    />
                    <YAxis 
                      stroke="#A0AEC0" 
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                      }}
                      cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                    />
                    <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      </Box>
    </Box>
  );
}
