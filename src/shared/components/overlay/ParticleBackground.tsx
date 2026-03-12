import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  delay: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 15000,
    }))

    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient orbs
      const drawOrb = (x: number, y: number, r: number, alpha: number) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, `hsla(142, 72%, 50%, ${alpha})`)
        grad.addColorStop(1, 'hsla(142, 72%, 50%, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      drawOrb(canvas.width * 0.2, canvas.height * 0.3, 200, 0.04)
      drawOrb(canvas.width * 0.8, canvas.height * 0.7, 250, 0.03)

      // Draw SVG-like decorative lines
      ctx.strokeStyle = `hsla(142, 72%, 50%, 0.06)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, canvas.height * 0.6)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.3)
      ctx.lineTo(canvas.width, canvas.height * 0.5)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.1, 0)
      ctx.lineTo(canvas.width * 0.6, canvas.height * 0.4)
      ctx.stroke()

      // Draw particles
      particles.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX

        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(142, 72%, 50%, ${p.opacity})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
