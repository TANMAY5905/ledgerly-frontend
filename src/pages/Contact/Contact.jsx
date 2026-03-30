import React from 'react';
import { Box, Typography, Paper, Container, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send } from 'lucide-react';

const glassPaperStyle = {
  p: { xs: 4, md: 6 },
  borderRadius: 4,
  background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(17, 17, 17, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.05)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
  position: 'relative',
  overflow: 'hidden',
  mb: 4,
  textAlign: 'center'
};

export default function Contact() {
  const contactEmail = 'ledgerly.info@gmail.com';

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.1) 0%, #0a0a0a 60%, #000000 100%)',
      pt: 8,
      pb: 8
    }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" fontWeight="800" sx={{ color: '#fff', mb: 2, textAlign: 'center' }}>
            Get in <span style={{ color: '#10B981' }}>Touch</span>
          </Typography>
          <Typography variant="h6" sx={{ color: '#A0AEC0', mb: 6, textAlign: 'center', fontWeight: 'normal' }}>
            Have questions or feedback? We'd love to hear from you.
          </Typography>

          <Paper sx={glassPaperStyle}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 3 
            }}>
              <Box sx={{ 
                p: 2.5, 
                borderRadius: '50%', 
                bgcolor: 'rgba(16, 185, 129, 0.1)', 
                color: '#10B981',
                mb: 2
              }}>
                <Mail size={40} />
              </Box>
              
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
                Email Us
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#CBD5E0', mb: 4, maxWidth: '300px' }}>
                For any support, inquiries, or business opportunities, reach out to us at:
              </Typography>

              <Box 
                sx={{ 
                  p: 2, 
                  px: 4, 
                  borderRadius: 3, 
                  bgcolor: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#10B981',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  mb: 4,
                  width: '100%',
                  wordBreak: 'break-all'
                }}
              >
                {contactEmail}
              </Box>

              <Button
                variant="contained"
                startIcon={<Send size={18} />}
                href={`mailto:${contactEmail}`}
                sx={{
                  bgcolor: '#10B981',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: '#0d9467',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Send Message
              </Button>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#A0AEC0' }}>
              <MessageCircle size={18} />
              <Typography variant="body2">Support 24/7</Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
