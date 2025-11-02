import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const MagicBento = ({ children, className = '', ...props }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMousePosition({ x, y })
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseenter', () => setIsHovered(true))
      container.addEventListener('mouseleave', () => setIsHovered(false))

      return () => {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseenter', () => setIsHovered(true))
        container.removeEventListener('mouseleave', () => setIsHovered(false))
      }
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={`cursor-target relative overflow-hidden border border-neutral-800 rounded-2xl ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      {...props}
    >
      {/* Magic gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 0.15 : 0,
          background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3), transparent 40%)`,
        }}
      />
      
      {/* Animated border gradient */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.4), transparent 70%)`,
          mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
          maskComposite: 'xor',
          WebkitMask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export default MagicBento