import { motion } from 'framer-motion'
import { useState } from 'react'

const StarBorder = ({ children, className = '', ...props }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Animated star border */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg, 
              #ff6b6b 0deg, 
              #4ecdc4 60deg, 
              #45b7d1 120deg, 
              #96ceb4 180deg, 
              #ffeaa7 240deg, 
              #dda0dd 300deg, 
              #ff6b6b 360deg)`,
            filter: 'blur(2px)',
          }}
          animate={{
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{
            rotate: {
              duration: 3,
              ease: "linear",
              repeat: isHovered ? Infinity : 0,
            },
            scale: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
        />
        
        {/* Inner content mask */}
        <div className="absolute inset-[2px] bg-black rounded-lg z-10" />
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
      
      {/* Sparkle effects */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${10 + (i % 3) * 30}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default StarBorder