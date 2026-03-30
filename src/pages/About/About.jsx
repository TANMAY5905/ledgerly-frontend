import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Info, Target, Award } from 'lucide-react';

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

export default function About() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.1) 0%, #0a0a0a 60%, #000000 100%)',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" fontWeight="800" sx={{ color: '#fff', mb: 1, textAlign: 'center' }}>
            About <span style={{ color: '#10B981' }}>Ledgerly</span>
          </Typography>
          <Typography variant="h6" sx={{ color: '#A0AEC0', mb: 6, textAlign: 'center', fontWeight: 'normal' }}>
            Your Intelligent Financial Companion
          </Typography>

          <Paper sx={glassPaperStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <Info size={24} />
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>General Overview</Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#CBD5E0', lineHeight: 1.8 }}>
              Ledgerly is a next-generation expense management and financial tracking application designed to help individuals and groups take full control of their finances. Whether you're tracking daily personal spending or managing shared expenses with friends and family, Ledgerly provides a seamless, intuitive, and data-driven experience.
            </Typography>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper sx={{ ...glassPaperStyle, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                    <Target size={24} />
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>Our Mission</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#CBD5E0', lineHeight: 1.8 }}>
                  Our mission is to simplify personal finance through automation and insightful analytics. We believe that financial clarity leads to better decision-making and a more secure future for everyone.
                </Typography>
              </Paper>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper sx={{ ...glassPaperStyle, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                    <Award size={24} />
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>Why Ledgerly?</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#CBD5E0', lineHeight: 1.8 }}>
                  Unlike traditional apps, Ledgerly focuses on collaborative tracking and deep analytical insights. With features like real-time group settlements, category-wise breakdowns, and visual trends, we make sure you're always aware of where your money goes.
                </Typography>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
