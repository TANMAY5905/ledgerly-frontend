import React from 'react';
import { Box, Typography, Paper, Container, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Database, Handshake } from 'lucide-react';

const glassPaperStyle = {
  p: { xs: 3, md: 5 },
  borderRadius: 4,
  background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(17, 17, 17, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.05)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
  position: 'relative',
  overflow: 'hidden',
  mb: 4
};

const Section = ({ icon: Icon, title, content, color = "#10B981" }) => (
  <Box sx={{ mb: 6 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color: color }}>
        <Icon size={24} />
      </Box>
      <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>{title}</Typography>
    </Box>
    <Typography variant="body1" sx={{ color: '#CBD5E0', lineHeight: 1.8 }}>
      {content}
    </Typography>
  </Box>
);

export default function PrivacyPolicy() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.1) 0%, #0a0a0a 60%, #000000 100%)',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" fontWeight="800" sx={{ color: '#fff', mb: 1, textAlign: 'center' }}>
            Privacy <span style={{ color: '#10B981' }}>Policy</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#A0AEC0', mb: 6, textAlign: 'center' }}>
            Last updated: March 30, 2026
          </Typography>

          <Paper sx={glassPaperStyle}>
            <Section 
              icon={Eye} 
              title="Data Collection" 
              content="We collect minimal personal information necessary to provide our services, such as your email address and username. We do not store or access your banking credentials or sensitive financial data outside of what you manually enter or import into the app." 
              color="#3B82F6"
            />
            
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Database} 
              title="Data Security" 
              content="Your data is encrypted both in transit and at rest. We implement robust security protocols to protect your financial history from unauthorized access. Our commitment to privacy means your transaction logs are strictly confidential." 
              color="#10B981"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Handshake} 
              title="Third-Party Sharing" 
              content="We do not sell your personal data to third parties. Some data may be shared with trusted service providers strictly for the purpose of maintaining the platform (e.g., hosting services, email delivery)." 
              color="#F59E0B"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={ShieldCheck} 
              title="User Control" 
              content="You have full control over your data. You can export or delete your account and all associated transaction logs at any time from the account settings menu." 
              color="#ef4444"
            />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
