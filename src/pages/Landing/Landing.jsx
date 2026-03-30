import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  AppBar, 
  Toolbar,
  useTheme,
  useMediaQuery,
  Link
} from "@mui/material";
import { motion } from "framer-motion";
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight,
  PieChart,
  History
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const glassStyle = {
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: 4,
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <Paper sx={{ ...glassStyle, p: 4, height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', borderColor: 'rgba(16, 185, 129, 0.3)', bgcolor: 'rgba(16, 185, 129, 0.02)' } }}>
      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'inline-flex', mb: 3 }}>
        <Icon size={28} />
      </Box>
      <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff', mb: 2 }}>{title}</Typography>
      <Typography variant="body1" sx={{ color: '#A0AEC0', lineHeight: 1.7 }}>{description}</Typography>
    </Paper>
  </motion.div>
);

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ bgcolor: "#000", minHeight: "100vh", color: "#fff", overflowX: 'hidden' }}>
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
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: { xs: 10, md: 15 }, background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.05) 0%, transparent 30%)' }}>
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
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexDirection: { xs: "column", sm: "row" }, px: 4 }}>
                <Button 
                  size="large" 
                  variant="contained" 
                  onClick={() => navigate("/login?mode=signup")}
                  endIcon={<ChevronRight />}
                  sx={{ bgcolor: "#10B981", color: "#fff", py: 2, px: 5, borderRadius: 3, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem", '&:hover': { bgcolor: "#0d9467", transform: 'scale(1.02)' }, transition: 'all 0.2s' }}
                >
                  Start Tracking Free
                </Button>
                <Button 
                  size="large" 
                  variant="outlined" 
                  onClick={() => navigate("/login")}
                  sx={{ borderColor: "rgba(255,255,255,0.1)", color: "#fff", py: 2, px: 5, borderRadius: 3, fontWeight: "bold", textTransform: "none", fontSize: "1.1rem", '&:hover': { bgcolor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)" } }}
                >
                  View My Dashboard
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="overline" sx={{ color: '#10B981', fontWeight: 'bold', letterSpacing: 3 }}>
            POWERFUL FEATURES
          </Typography>
          <Typography variant="h3" fontWeight="800" sx={{ mt: 2 }}>
            Everything you need <br /> for financial clarity
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={TrendingUp} 
              title="Personal Tracking" 
              description="Log your daily expenses in seconds. Category breakdowns help you see exactly where your money goes every month." 
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={Users} 
              title="Group Settlements" 
              description="Split bills with friends, roommates, or family. Track who owes what and settle up with one click." 
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={PieChart} 
              title="Visual Analytics" 
              description="Beautifully crafted charts and trends provide deep insights into your financial behavior over time." 
              delay={0.3}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={History} 
              title="Global History" 
              description="Access your entire transaction history across all groups and personal accounts with advanced filtering." 
              delay={0.4}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={ShieldCheck} 
              title="Bank-Level Security" 
              description="Your data is encrypted and protected. We value your privacy and keep your financial data strictly confidential." 
              delay={0.5}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={Wallet} 
              title="Smart Budgeting" 
              description="Set targets and get notified when you're nearing your limits. Stay ahead of your finances effortlessly." 
              delay={0.6}
            />
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Paper sx={{ ...glassStyle, p: { xs: 6, md: 10 }, textAlign: 'center', background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(10, 10, 10, 0.95) 100%)' }}>
          <Typography variant="h2" fontWeight="800" sx={{ mb: 3 }}>
            Ready to take control?
          </Typography>
          <Typography variant="h6" sx={{ color: '#A0AEC0', mb: 6, maxWidth: 600, mx: 'auto' }}>
            Join thousands of users who are already mastering their finances with Ledgerly. Start your journey today.
          </Typography>
          <Button 
            size="large" 
            variant="contained" 
            onClick={() => navigate("/login?mode=signup")}
            sx={{ bgcolor: "#10B981", color: "#fff", py: 2, px: 8, borderRadius: 3, fontWeight: "bold", textTransform: "none", fontSize: "1.2rem", '&:hover': { bgcolor: "#0d9467", transform: 'scale(1.05)' }, transition: 'all 0.2s' }}
          >
            Get Started Now
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 10, borderTop: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(0,0,0,0.5)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <img src="/logo.png" alt="Ledgerly" style={{ width: 30, height: 30 }} />
                <Typography variant="h6" fontWeight="900" sx={{ color: "#fff" }}>
                  Ledgerly
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#718096', lineHeight: 1.8 }}>
                The ultimate companion for personal and shared finance. Simplify your life, track your wealth, and reach your goals.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff', mb: 3 }}>Product</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link onClick={() => navigate("/dashboard")} sx={{ color: '#718096', cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#10B981' } }}>Dashboard</Link>
                <Link onClick={() => navigate("/groups")} sx={{ color: '#718096', cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#10B981' } }}>Groups</Link>
                <Link onClick={() => navigate("/about")} sx={{ color: '#718096', cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#10B981' } }}>About Us</Link>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff', mb: 3 }}>Legal</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link onClick={() => navigate("/privacy-policy")} sx={{ color: '#718096', cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#10B981' } }}>Privacy Policy</Link>
                <Link onClick={() => navigate("/terms-of-service")} sx={{ color: '#718096', cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#10B981' } }}>Terms of Use</Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff', mb: 3 }}>Support</Typography>
              <Typography variant="body2" sx={{ color: '#718096', mb: 2 }}>
                Questions or issues? We're here to help.
              </Typography>
              <Link onClick={() => navigate("/contact")} sx={{ color: '#10B981', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                ledgerly.info@gmail.com
              </Link>
            </Grid>
          </Grid>
          <Box sx={{ mt: 8, pt: 8, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#4A5568' }}>
              © 2026 Ledgerly. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
