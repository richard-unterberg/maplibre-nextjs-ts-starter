import { useMemo } from 'react'

const SpaceBackground = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 180 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() < 0.85 ? Math.random() * 2 + 1 : Math.random() * 4 + 3}px`,
      opacity: Math.random() * 0.7 + 0.3,
      duration: `${Math.random() * 6 + 4}s`,
      delay: `${Math.random() * 5}s`,
    }))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 stars-overlay">
      {stars.map(star => (
        <span
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  )
}

export default SpaceBackground
