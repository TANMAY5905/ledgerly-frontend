import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { loginAPI, registerAPI, forgotPasswordAPI } from '../../api/auth';
import { FullPageLoader } from '../../components/Loader/CoinLoader';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(initialMode !== 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || (!isLogin && (!name || !email))) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await loginAPI(username, password);
      } else {
        data = await registerAPI(username, name, email, password);
      }
      
      // If backend returns a token or success
      if (data && data.token) {
        sessionStorage.setItem('token', data.token);
        navigate('/dashboard');
        // We explicitly do NOT setLoading(false) here to avoid a split-second 
        // flash of the login form while the dashboard is loading
      } else if (!isLogin) {
        // Fallback for registration without auto-login token
        setIsLogin(true);
        setError('');
        setUsername('');
        setPassword('');
        setLoading(false);
      } else {
        setError('Invalid response from server.');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || (isLogin ? 'Invalid username or password.' : 'Registration failed.'));
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    setForgotLoading(true);
    setForgotMessage({ type: '', text: '' });
    try {
      const data = await forgotPasswordAPI(forgotEmail);
      setForgotMessage({ type: 'success', text: data.message || 'Reset link sent to your registered email.' });
      // Keep modal open so they can see the message, or close after delay
      setTimeout(() => {
        if (!forgotMessage.text.includes('error')) {
          // setShowForgotModal(false);
        }
      }, 5000);
    } catch (err) {
      setForgotMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send reset link.' });
    } finally {
      setForgotLoading(false);
    }
  };

  if (loading) {
    return <FullPageLoader text="Authenticating..." />;
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2
      }}
    >
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Paper 
            elevation={24} 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: '1px solid rgba(16, 185, 129, 0.1)' // subtle green glow border
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Box sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: '50%', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src="/logo.png" alt="Logo" style={{ width: 100, height: 100, objectFit: 'contain' }} />
              </Box>
            </motion.div>

            <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              {isLogin ? 'Enter your credentials to access your financial dashboard.' : 'Sign up to start managing your finances effectively.'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {!isLogin && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus={isLogin}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: { xs: 2, sm: 3 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {isLogin && (
                <Box sx={{ mb: 2, textAlign: 'right' }}>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => {
                      setShowForgotModal(true);
                      setForgotMessage({ type: '', text: '' });
                      setForgotEmail('');
                    }}
                    sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 500 }}
                  >
                    Forgot Password?
                  </Button>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  py: 1.5, 
                  fontWeight: 'bold', 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.23)',
                  }
                }}
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  {isLogin ? "Don't have an account? Register" : "Already have an account? Log In"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog 
        open={showForgotModal} 
        onClose={() => !forgotLoading && setShowForgotModal(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 3,
            p: 1,
            minWidth: { xs: '90vw', sm: 400 },
            border: '1px solid rgba(255,255,255,0.05)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email address and we'll send a link to reset your password.
          </Typography>
          
          {forgotMessage.text && (
            <Alert severity={forgotMessage.type} sx={{ mb: 2 }}>
              {forgotMessage.text}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Email Address"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            disabled={forgotLoading}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setShowForgotModal(false)} 
            disabled={forgotLoading}
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleForgotPassword}
            variant="contained"
            disabled={forgotLoading}
            startIcon={forgotLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ 
              fontWeight: 'bold',
              textTransform: 'none',
              px: 3
            }}
          >
            Send Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
