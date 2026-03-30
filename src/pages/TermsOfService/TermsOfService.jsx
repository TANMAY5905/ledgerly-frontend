import React from 'react';
import { Box, Typography, Paper, Container, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Gavel, Users, Database, ShieldAlert, Edit3, Share2, XCircle, Scale, Mail as MailIcon } from 'lucide-react';

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
    <Typography variant="body1" sx={{ color: '#CBD5E0', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
      {content}
    </Typography>
  </Box>
);

export default function TermsOfService() {
  const contactEmail = 'ledgerly.info@gmail.com';

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
            Terms of <span style={{ color: '#10B981' }}>Use</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#A0AEC0', mb: 6, textAlign: 'center' }}>
            Effective Date: March 30, 2026
          </Typography>

          <Paper sx={glassPaperStyle}>
            <Typography variant="body1" sx={{ color: '#CBD5E0', mb: 6, textAlign: 'center', fontStyle: 'italic' }}>
              By accessing and using Ledgerly, you agree to the following terms:
            </Typography>

            <Section 
              icon={Gavel} 
              title="Use of Service" 
              content="Ledgerly provides tools for managing personal and group expenses. You agree to use the service only for lawful purposes." 
              color="#3B82F6"
            />
            
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Users} 
              title="User Responsibilities" 
              content={`• You are responsible for maintaining the confidentiality of your account\n• You agree not to misuse the platform or attempt unauthorized access`} 
              color="#10B981"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Database} 
              title="Data Accuracy" 
              content="Ledgerly is not responsible for inaccuracies in financial data entered by users." 
              color="#F59E0B"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={ShieldAlert} 
              title="Limitation of Liability" 
              content="Ledgerly shall not be held liable for any direct or indirect damages resulting from the use of the service." 
              color="#ef4444"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Edit3} 
              title="Modifications" 
              content="We reserve the right to modify or discontinue the service at any time without notice." 
              color="#8B5CF6"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Share2} 
              title="Third-Party Services" 
              content="Our platform may include integrations such as Google AdSense. We are not responsible for third-party services." 
              color="#10B981"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={XCircle} 
              title="Termination" 
              content="We reserve the right to suspend or terminate accounts that violate these terms." 
              color="#ef4444"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Scale} 
              title="Governing Law" 
              content="These terms shall be governed by applicable laws." 
              color="#3B82F6"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={MailIcon} 
              title="Contact" 
              content={`For any questions regarding these Terms, contact us at:\n${contactEmail}`} 
              color="#10B981"
            />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
