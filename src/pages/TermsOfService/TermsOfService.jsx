import React from 'react';
import { Box, Typography, Paper, Container, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Scale, Users, Gavel, XCircle } from 'lucide-react';

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

export default function TermsOfService() {
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
            Terms of <span style={{ color: '#10B981' }}>Service</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#A0AEC0', mb: 6, textAlign: 'center' }}>
            Effective Date: March 30, 2026
          </Typography>

          <Paper sx={glassPaperStyle}>
            <Section 
              icon={Gavel} 
              title="Acceptance of Terms" 
              content="By accessing or using the Ledgerly application, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access the service." 
              color="#3B82F6"
            />
            
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Users} 
              title="User Responsibility" 
              content="You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Ledgerly is not liable for any losses caused by unauthorized use of your account." 
              color="#10B981"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Scale} 
              title="No Financial Advice" 
              content="Ledgerly is a data-tracking tool and does not provide financial or legal advice. Any insights or reports provided are for informational purposes only. You should consult with a professional financial advisor for specific financial guidance." 
              color="#F59E0B"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={XCircle} 
              title="Termination" 
              content="We reserve the right to suspend or terminate your access to Ledgerly at our discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users of the service." 
              color="#ef4444"
            />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
