import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const TargetCursor = () => {
  const cursorRef = useRef(null)
  const crosshairRef = useRef(null)
  const centerDotRef = useRef(null)
  const outerRingRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const crosshair = crosshairRef.current
    const centerDot = centerDotRef.current
    const outerRing = outerRingRef.current

    if (!cursor || !crosshair || !centerDot || !outerRing) return

    // Hide default cursor globally
    const style = document.createElement('style')
    style.innerHTML = `
      *, *::before, *::after {
        cursor: none !important;
      }
      body {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)

    // Initial setup
    gsap.set(cursor, { xPercent: -50, yPercent: -50 })
    gsap.set(crosshair, { scale: 1, rotation: 0 })
    gsap.set(centerDot, { scale: 1 })
    gsap.set(outerRing, { scale: 1, rotation: 0 })

    // Create idle rotation animation
    const idleRotation = gsap.to(outerRing, {
      rotation: 360,
      duration: 4,
      ease: 'none',
      repeat: -1,
      paused: false
    })

    // Mouse move handler
    const handleMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      })
    }

    // Check if element is clickable
    const isClickableElement = (element) => {
      if (!element) return false
      
      const clickableSelectors = [
        'button', 'a', '[role="button"]', '[onclick]', 'input', 'textarea', 
        'select', '[tabindex]', '.cursor-target', '[data-clickable]'
      ]
      
      // Check if element matches any clickable selector
      for (const selector of clickableSelectors) {
        if (element.matches && element.matches(selector)) return true
      }
      
      // Check if element has click event listeners
      const hasClickHandler = element.onclick || 
        element.getAttribute('onclick') || 
        element.classList.contains('cursor-target') ||
        element.style.cursor === 'pointer'
      
      return !!hasClickHandler
    }

    // Mouse over handler - check for clickable elements
    const handleMouseOver = (e) => {
      const isClickable = isClickableElement(e.target)
      
      if (isClickable && !isHovering) {
        setIsHovering(true)
        
        // Stop idle rotation
        idleRotation.pause()
        
        // Target locked animation
        gsap.to(crosshair, {
          scale: 1.2,
          rotation: 45,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
        
        gsap.to(centerDot, {
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.out'
        })
        
        gsap.to(outerRing, {
          scale: 1.3,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      } else if (!isClickable && isHovering) {
        setIsHovering(false)
        
        // Back to normal state
        gsap.to(crosshair, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
        
        gsap.to(centerDot, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
        
        gsap.to(outerRing, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => idleRotation.resume()
        })
      }
    }

    // Mouse down handler
    const handleMouseDown = (e) => {
      if (isClickableElement(e.target)) {
        setIsClicking(true)
        
        // Click animation - target fires
        gsap.to(crosshair, {
          scale: 0.8,
          duration: 0.1,
          ease: 'power2.out'
        })
        
        gsap.to(centerDot, {
          scale: 1.5,
          duration: 0.1,
          ease: 'power2.out'
        })
        
        gsap.to(outerRing, {
          scale: 0.9,
          duration: 0.1,
          ease: 'power2.out'
        })
      }
    }

    // Mouse up handler
    const handleMouseUp = (e) => {
      if (isClicking) {
        setIsClicking(false)
        
        // Return to hover state
        if (isClickableElement(e.target)) {
          gsap.to(crosshair, {
            scale: 1.2,
            duration: 0.2,
            ease: 'back.out(1.7)'
          })
          
          gsap.to(centerDot, {
            scale: 0.8,
            duration: 0.2,
            ease: 'power2.out'
          })
          
          gsap.to(outerRing, {
            scale: 1.3,
            duration: 0.2,
            ease: 'power2.out'
          })
        }
      }
    }

    // Mouse leave handler for when cursor leaves the window
    const handleMouseLeave = () => {
      gsap.to(cursor, {
        opacity: 0,
        duration: 0.2
      })
    }

    // Mouse enter handler for when cursor enters the window
    const handleMouseEnter = () => {
      gsap.to(cursor, {
        opacity: 1,
        duration: 0.2
      })
    }

    // Attach event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      
      idleRotation.kill()
      document.head.removeChild(style)
    }
  }, [isHovering, isClicking])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: 'transform' }}
    >
      {/* Outer rotating ring - shows activity */}
      <div ref={outerRingRef} className="relative w-10 h-10">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          className="absolute inset-0"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      {/* Crosshair - main targeting reticle */}
      <div
        ref={crosshairRef}
        className="absolute top-1/2 left-1/2 w-6 h-6"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="w-full h-full"
        >
          {/* Horizontal crosshair line */}
          <line
            x1="2"
            y1="12"
            x2="10"
            y2="12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="12"
            x2="22"
            y2="12"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Vertical crosshair line */}
          <line
            x1="12"
            y1="2"
            x2="12"
            y2="10"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="14"
            x2="12"
            y2="22"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Corner brackets */}
          <path
            d="M6 6 L6 8 M6 6 L8 6 M18 6 L18 8 M18 6 L16 6 M6 18 L6 16 M6 18 L8 18 M18 18 L18 16 M18 18 L16 18"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Center dot - shows precision point */}
      <div
        ref={centerDotRef}
        className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </div>
  )
}

export default TargetCursor