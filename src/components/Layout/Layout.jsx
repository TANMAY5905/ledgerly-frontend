import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar, 
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Button,
  Badge,
  Menu,
  MenuItem,
  Divider,
  DialogTitle
} from '@mui/material';
import { 
  LayoutDashboard, 
  FileEdit, 
  History, 
  Users,
  Menu as MenuIcon,
  LogOut,
  Bell,
  Tag,
  Info,
  Shield,
  FileText,
  Mail as MailIcon
} from 'lucide-react';


import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { createTag } from '../../api/tags';
import { getNotifications, markAsRead } from '../../api/groups';
import { getMeAPI } from '../../api/auth';
import Tips from '../Tips/Tips';

const MySwal = withReactContent(Swal);


const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
  { text: 'Log Transaction', icon: <FileEdit size={20} />, path: '/log-transaction' },
  { text: 'Transaction History', icon: <History size={20} />, path: '/transaction-history' },
  { text: 'Groups', icon: <Users size={20} />, path: '/groups' }
];



export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Tag creation modal state
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [tagName, setTagName] = useState('');
  const [tagDescription, setTagDescription] = useState('');
  const [tagLoading, setTagLoading] = useState(false);
  const [tagError, setTagError] = useState('');

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [anchorElNotif, setAnchorElNotif] = useState(null);

  const fetchNotifs = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // User state
  const [user, setUser] = useState({
    username: '...',
    email: '...'
  });

  const fetchUser = async () => {
    try {
      const data = await getMeAPI();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  React.useEffect(() => {
    fetchNotifs();
    fetchUser();
  }, []);

  const handleOpenNotifs = async (event) => {
    setAnchorElNotif(event.currentTarget);
    
    try {
      const data = await getNotifications();
      const currentUnread = data.filter(n => !n.read);
      
      // Update UI optimistically
      setNotifications(data.map(n => ({ ...n, read: true })));
      
      // Tell backend
      if (currentUnread.length > 0) {
        Promise.all(currentUnread.map(n => markAsRead(n.id))).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseNotifs = () => {
    setAnchorElNotif(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateTag = async () => {
    if (!tagName.trim()) {
      setTagError('Category name is required');
      return;
    }
    try {
      setTagLoading(true);
      setTagError('');
      await createTag(tagName, tagDescription);
      setTagDialogOpen(false);
      setTagName('');
      setTagDescription('');
      
      MySwal.fire({
        title: 'Success!',
        text: 'Category created successfully.',
        icon: 'success',
        background: '#1A202C',
        color: '#fff',
        confirmButtonColor: '#10B981',
        iconColor: '#10B981'
      });
      
      // Notify other components that a tag was created
      window.dispatchEvent(new Event('tagCreated'));
    } catch (err) {
      console.error('Failed to create tag', err);
      // For now, if it fails due to no backend, still gracefully show error
      setTagError(err.response?.data?.message || 'Failed to create category');
      
      MySwal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to create category',
        icon: 'error',
        background: '#1A202C',
        color: '#fff',
        confirmButtonColor: '#10B981'
      });
    } finally {
      setTagLoading(false);
    }
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/logo.png" alt="Ledgerly Logo" style={{ width: 50, height: 50, objectFit: 'contain' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', letterSpacing: 1 }}>
          Ledgerly
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: isActive ? '#10B981' : '#A0AEC0',
                  '&:hover': {
                    bgcolor: 'rgba(16, 185, 129, 0.08)',
                    color: '#10B981',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.95rem'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>



      {/* Bottom User Profile Section */}
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: '#10B981', 
              color: '#fff', 
              fontWeight: 'bold',
              width: 40, 
              height: 40 
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, noWrap: true }}>
              {user.username}
            </Typography>
            <Typography variant="caption" sx={{ color: '#A0AEC0', noWrap: true, display: 'block' }}>
              {user.email}
            </Typography>
          </Box>
          <IconButton 
            size="small" 
            sx={{ 
              color: '#A0AEC0', 
              '&:hover': { 
                color: '#ef4444',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.2)'
              } 
            }} 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: '#0A0A0A', borderBottom: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: '#A0AEC0' }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <img src="/logo.png" alt="Ledgerly" style={{ width: 28, height: 28 }} />
              <Typography variant="h6" noWrap component="div" sx={{ color: '#10B981', fontWeight: 'bold' }}>
                Ledgerly
              </Typography>
            </Box>

            {/* Icons for Mobile */}
            <IconButton 
              onClick={() => setTagDialogOpen(true)}
              sx={{ color: '#A0AEC0', mr: 0.5 }}
            >
              <Tag size={18} />
            </IconButton>

            <IconButton onClick={handleOpenNotifs} sx={{ color: '#A0AEC0' }}>
              <Badge badgeContent={unreadCount} color="error">
                <Bell size={18} />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#050505', color: '#fff' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box', 
              bgcolor: '#050505', 
              color: '#fff',
              borderRight: '1px solid rgba(16, 185, 129, 0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` }, display: 'flex', flexDirection: 'column' }}>
        {/* Global Navbar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: 'rgba(10, 10, 10, 0.8)', 
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(16, 185, 129, 0.1)' 
          }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end', position: 'relative' }}>
            <Box sx={{ flexGrow: 1 }} />
            
            <Box 
              sx={{ 
                position: 'absolute', 
                left: '50%', 
                transform: 'translateX(-50%)',
                display: 'flex', 
                alignItems: 'center',
                width: '100%',
                maxWidth: { xs: 200, sm: 400, md: 500 },
                justifyContent: 'center',
                pointerEvents: 'none' // So it doesn't block clicks underneath if it overlaps
              }}
            >
              {/* <Tips /> */}

            </Box>
            
            {/* Tag / Category Creation Icon */}
            <IconButton 
              onClick={() => setTagDialogOpen(true)}
              sx={{ color: '#A0AEC0', mr: 1, '&:hover': { color: '#10B981', bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
              title="Create Category/Tag"
            >
              <Tag size={20} />
            </IconButton>

            <IconButton onClick={handleOpenNotifs} sx={{ color: '#A0AEC0', '&:hover': { color: '#10B981', bgcolor: 'rgba(16, 185, 129, 0.1)' } }}>
              <Badge badgeContent={unreadCount} color="error">
                <Bell size={20} />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorElNotif}
              open={Boolean(anchorElNotif)}
              onClose={handleCloseNotifs}
              PaperProps={{
                sx: {
                  bgcolor: '#1A202C',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  mt: 1.5,
                  minWidth: 300,
                  maxWidth: 350,
                  maxHeight: 400,
                  '& .MuiMenuItem-root:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                  },
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
              </Box>
              {notifications.length === 0 ? (
                <MenuItem disabled sx={{ opacity: '1 !important', py: 3, justifyContent: 'center' }}>
                  <Typography variant="body2" color="#A0AEC0">No new notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map((n, idx) => (
                  <Box key={n.id || idx}>
                    <MenuItem sx={{ whiteSpace: 'normal', py: 1.5 }}>
                      <Typography variant="body2">{n.message}</Typography>
                    </MenuItem>
                    {idx < notifications.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />}
                  </Box>
                ))
              )}
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Create Tag Dialog */}
      <Dialog 
        open={tagDialogOpen} 
        onClose={() => !tagLoading && setTagDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1A202C',
            color: '#fff',
            borderRadius: 3,
            minWidth: { xs: '90vw', sm: 400 },
            border: '1px solid rgba(255,255,255,0.05)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Category</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#A0AEC0" sx={{ mb: 3 }}>
            Add a new category or tag to logically organize your transactions.
          </Typography>
          
          <TextField
            autoFocus
            fullWidth
            label="Category Name"
            value={tagName}
            onChange={(e) => {
              setTagName(e.target.value);
              if (tagError) setTagError('');
            }}
            error={Boolean(tagError)}
            helperText={tagError}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#10B981' }
              },
              '& .MuiInputLabel-root': { color: '#A0AEC0' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#10B981' },
            }}
          />
          {/* <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={2}
            value={tagDescription}
            onChange={(e) => setTagDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#10B981' }
              },
              '& .MuiInputLabel-root': { color: '#A0AEC0' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#10B981' },
            }}
          /> */}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setTagDialogOpen(false)} 
            disabled={tagLoading}
            sx={{ color: '#A0AEC0', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTag}
            variant="contained"
            disabled={tagLoading}
            startIcon={tagLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ 
              bgcolor: '#10B981', 
              color: '#fff', 
              textTransform: 'none',
              '&:hover': { bgcolor: '#0f9d6c' },
              '&.Mui-disabled': { bgcolor: 'rgba(16, 185, 129, 0.5)', color: 'rgba(255,255,255,0.5)' }
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
