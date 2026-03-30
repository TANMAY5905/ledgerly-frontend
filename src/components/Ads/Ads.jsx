import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Reusable AdSense Component
 * @param {Object} props
 * @param {string} props.adSlot - The specific ad slot ID (default is a placeholder)
 * @param {string} props.adFormat - The format of the ad (default: 'auto')
 * @param {boolean} props.fullWidthResponsive - Whether to take full width (default: true)
 * @param {Object} props.sx - Additional MUI styles
 */
export default function Ads({ 
  adSlot = '8501234567', // Placeholder slot ID
  adFormat = 'auto', 
  fullWidthResponsive = true,
  sx = {}
}) {
  useEffect(() => {
    try {
      // Check if adsbygoogle is available and initialized
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <Box 
      sx={{ 
        my: 4, 
        textAlign: 'center', 
        width: '100%', 
        overflow: 'hidden',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...sx 
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'rgba(255,255,255,0.2)', 
          textTransform: 'uppercase', 
          letterSpacing: 2,
          fontSize: '0.65rem',
          mb: 1
        }}
      >
        Advertisement
      </Typography>

      <Box 
        sx={{ 
          width: '100%',
          bgcolor: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          p: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Google AdSense Code */}
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-9576833046929212"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        />
      </Box>
    </Box>
  );
}
