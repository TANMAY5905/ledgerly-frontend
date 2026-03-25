import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_TIPS = [
  "You can add new tags manually by clicking on this button --->",
  "Transactions by default are sorted according to date.",
  // "Keep your daily expenses under the budget for better savings.",
  "Categorizing transactions helps in generating accurate reports.",
  "Check out the Dashboard for a summary of your financial health.",
  "You can assign transactions to specific groups easily.",
  "Adding notes to your transactions makes them easier to search.",
  "You can update or delete previous transactions anytime."
];

export default function Tips() {
  const [tips, setTips] = useState([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Shuffle tips on mount so they are random
    const shuffled = [...INITIAL_TIPS].sort(() => Math.random() - 0.5);
    setTips(shuffled);
  }, []);

  useEffect(() => {
    if (tips.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [tips]);

  if (tips.length === 0) return null;

  return (
    <Box 
      sx={{ 
        display: { xs: 'none', sm: 'flex' }, // Hide on very small screens to save space
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 1, 
        color: '#A0AEC0', 
        width: '100%'
      }}
    >
      <Lightbulb size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
      <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 'bold', flexShrink: 0 }}>
        Tip:
      </Typography>
      <Box sx={{ position: 'relative', height: 48, width: '100%', maxWidth: 500, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', width: '100%', left: 0 }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500, 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'left'
              }}
            >
              {tips[currentTipIndex]}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
