import React from 'react';
import { Box, Typography, Paper, Container, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Database, Handshake, Cookie, Settings, Bell, Mail as MailIcon } from 'lucide-react';

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

export default function PrivacyPolicy() {
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
            Privacy <span style={{ color: '#10B981' }}>Policy</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#A0AEC0', mb: 6, textAlign: 'center' }}>
            Effective Date: March 30, 2026
          </Typography>

          <Paper sx={glassPaperStyle}>
            <Typography variant="body1" sx={{ color: '#CBD5E0', mb: 6, textAlign: 'center', fontStyle: 'italic' }}>
              At Ledgerly, we value your privacy and are committed to protecting your personal information.
            </Typography>

            <Section 
              icon={Eye} 
              title="Information We Collect" 
              content={`We may collect the following types of information:\n\n• Personal information (such as name, email address)\n• Financial data entered by users (expenses, categories, etc.)\n• Usage data (how you interact with the application)\n• Cookies and tracking technologies (for analytics and advertising)`} 
              color="#3B82F6"
            />
            
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Settings} 
              title="How We Use Your Information" 
              content={`We use your information to:\n\n• Provide and improve our services\n• Analyze user behavior to enhance user experience\n• Display relevant advertisements through third-party services such as Google AdSense`} 
              color="#10B981"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Cookie} 
              title="Cookies and Advertising" 
              content={`We use cookies to personalize content and ads, and to analyze our traffic. Third-party vendors, including Google, use cookies to serve ads based on users' prior visits to this or other websites.\n\nUsers may opt out of personalized advertising by visiting Google Ads Settings.`} 
              color="#F59E0B"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={ShieldCheck} 
              title="Data Security" 
              content="We take appropriate measures to protect your data, but no method of transmission over the internet is 100% secure." 
              color="#ef4444"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Handshake} 
              title="Third-Party Services" 
              content="We may use third-party services (such as Google AdSense) which have their own privacy policies." 
              color="#8B5CF6"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Database} 
              title="Your Consent" 
              content="By using Ledgerly, you consent to our Privacy Policy." 
              color="#10b981"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={Bell} 
              title="Updates" 
              content="We may update this policy from time to time. Changes will be posted on this page." 
              color="#3b82f6"
            />

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 6 }} />

            <Section 
              icon={MailIcon} 
              title="Contact Us" 
              content={`If you have any questions about this Privacy Policy, please contact us at:\n${contactEmail}`} 
              color="#10B981"
            />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
