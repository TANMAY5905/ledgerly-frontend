import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar,
  useTheme,
  useMediaQuery,
  Link,
  Grid
} from "@mui/material";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Ads from "../../components/Ads/Ads";

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ bgcolor: "#000", minHeight: "100vh", color: "#fff", overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ bgcolor: "rgba(0,0,0,0.7)", backdropFilter: "blur(15px)", borderBottom: "1px solid rgba(255,255,255,0.05)", boxShadow: 'none' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <img src="/logo.png" alt="Ledgerly" style={{ width: 35, height: 35 }} />
              <Typography variant="h5" fontWeight="900" sx={{ color: "#fff", letterSpacing: -0.5 }}>
                Ledgerly
              </Typography>
            </Box>

            {/* Navbar Links - Desktop only */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 3 }}>
                <Button onClick={() => navigate("/about")} sx={{ color: "#718096", textTransform: 'none', fontWeight: 500, '&:hover': { color: '#10B981' } }}>
                  About Us
                </Button>
                <Button onClick={() => navigate("/privacy-policy")} sx={{ color: "#718096", textTransform: 'none', fontWeight: 500, '&:hover': { color: '#10B981' } }}>
                  Privacy Policy
                </Button>
                <Button onClick={() => navigate("/terms-of-service")} sx={{ color: "#718096", textTransform: 'none', fontWeight: 500, '&:hover': { color: '#10B981' } }}>
                  Terms & Conditions
                </Button>
                <Button onClick={() => navigate("/contact")} sx={{ color: "#718096", textTransform: 'none', fontWeight: 500, '&:hover': { color: '#10B981' } }}>
                  Contact Us
                </Button>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 } }}>
              <Button onClick={() => navigate("/login")} sx={{ color: "#A0AEC0", textTransform: 'none', fontWeight: 600, '&:hover': { color: '#fff' } }}>
                Login
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate("/login?mode=signup")}
                sx={{ bgcolor: "#10B981", color: "#fff", fontWeight: "bold", textTransform: "none", borderRadius: 2, px: { xs: 2, sm: 3 }, '&:hover': { bgcolor: "#0d9467" } }}
              >
                Get Started
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: { xs: 5, md: 8 }, flexGrow: 1, background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.05) 0%, transparent 30%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: "3.5rem", md: "5.5rem" }, 
                  fontWeight: 900, 
                  lineHeight: 1.1, 
                  mb: 3,
                  background: 'linear-gradient(to right, #fff, #10B981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Master Your Finances with Ease
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h5" sx={{ color: "#A0AEC0", mb: 6, fontWeight: 400, px: { xs: 2, md: 0 } }}>
                The intelligent way to track personal spending, manage group expenses, and visualize your financial heartbeat.
              </Typography>
            </motion.div>
 
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexDirection: { xs: "column", sm: "row" }, px: 4, mb: 10 }}>
                <Button 
                  size="large" 
                  variant="contained" 
                  onClick={() => navigate("/login?mode=signup")}
                  endIcon={<ChevronRight />}
                  sx={{ bgcolor: "#10B981", color: "#fff", py: 2, px: 5, borderRadius: 3, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem", '&:hover': { bgcolor: "#0d9467", transform: 'scale(1.02)' }, transition: 'all 0.2s' }}
                >
                  Get Started
                </Button>
                <Button 
                  size="large" 
                  variant="outlined" 
                  onClick={() => navigate("/login")}
                  sx={{ borderColor: "rgba(255,255,255,0.1)", color: "#fff", py: 2, px: 5, borderRadius: 3, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem", '&:hover': { bgcolor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)" } }}
                >
                  Login
                </Button>
              </Box>
            </motion.div>

            {/* AdSense Integration on Landing Page */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Ads adSlot="3344556677" sx={{ mt: 5 }} />
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 8, borderTop: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(0,0,0,0.5)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Link 
                onClick={() => navigate("/about")} 
                sx={{ color: '#718096', textDecoration: 'none', cursor: 'pointer', '&:hover': { color: '#10B981' }, transition: 'all 0.2s' }}
              >
                About Us
              </Link>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Link 
                onClick={() => navigate("/privacy-policy")} 
                sx={{ color: '#718096', textDecoration: 'none', cursor: 'pointer', '&:hover': { color: '#10B981' }, transition: 'all 0.2s' }}
              >
                Privacy Policy
              </Link>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Link 
                onClick={() => navigate("/terms-of-service")} 
                sx={{ color: '#718096', textDecoration: 'none', cursor: 'pointer', '&:hover': { color: '#10B981' }, transition: 'all 0.2s' }}
              >
                Terms & Conditions
              </Link>
            </Grid>
            <Grid item xs={6} sm={3} sx={{ textAlign: 'center' }}>
              <Link 
                onClick={() => navigate("/contact")} 
                sx={{ color: '#718096', textDecoration: 'none', cursor: 'pointer', '&:hover': { color: '#10B981' }, transition: 'all 0.2s' }}
              >
                Contact Us
              </Link>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ color: '#4A5568', textAlign: 'center' }}>
            © 2026 Ledgerly. All rights reserved.
          </Typography>
        </Container>
      </Box>

    </Box>
  );
}
