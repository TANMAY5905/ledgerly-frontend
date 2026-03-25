import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

export function CoinLoader({ size = "md", text }) {
  const sizeClasses = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 }
  };

  const coinSize = {
    sm: 32,
    md: 48,
    lg: 64
  };

  // primary colors from theme
  const primaryColor = "#10b981"; // from theme
  const primaryForeground = "#000000";

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative', width: sizeClasses[size].width, height: sizeClasses[size].height }}>
        {/* Stack of coins animation */}
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: index * 4,
              }}
              animate={{
                y: [0, -20, 0],
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.2,
                delay: index * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width={coinSize[size] * 0.6}
                height={coinSize[size] * 0.6}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.5))' }}
              >
                {/* Coin body */}
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill={primaryColor}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity={1 - index * 0.2}
                />
                {/* Dollar sign */}
                <path
                  d="M12 6v12M9 9c0-1.5 1.5-2 3-2s3 .5 3 2-1.5 2-3 2-3 .5-3 2 1.5 2 3 2 3-.5 3-2"
                  stroke={primaryForeground}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          ))}
        </motion.div>

        {/* Sparkle effects */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: primaryColor,
              left: `${25 + Math.random() * 50}%`,
              top: `${25 + Math.random() * 50}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              delay: i * 0.25,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </Box>

      {text && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
}

export function FullPageLoader({ text = "Loading..." }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <CoinLoader size="lg" text={text} />
    </Box>
  );
}
