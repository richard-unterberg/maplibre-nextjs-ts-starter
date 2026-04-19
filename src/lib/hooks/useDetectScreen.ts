import { useEffect, useRef } from 'react'

import useMapStore from '@/zustand/useMapStore'

const useDetectScreen = () => {
  const setViewportWidth = useMapStore(state => state.setViewportWidth)
  const setViewportHeight = useMapStore(state => state.setViewportHeight)
  const viewportWidth = useMapStore(state => state.viewportWidth)
  const viewportHeight = useMapStore(state => state.viewportHeight)
  const viewportRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!viewportRef.current) return

    let timeoutId: NodeJS.Timeout

    const observer = new ResizeObserver((entries) => {
      // Debounce the resize event
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect
          if (width) setViewportWidth(width)
          if (height) setViewportHeight(height)
        }
      }, 400)
    })

    observer.observe(viewportRef.current)

    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [setViewportWidth, setViewportHeight])

  return { viewportRef, viewportWidth, viewportHeight } as const
}

export default useDetectScreen
