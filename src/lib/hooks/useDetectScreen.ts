import { useEffect } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import useMapStore from '@/zustand/useMapStore'

const useDetectScreen = () => {
  const setViewportWidth = useMapStore(state => state.setViewportWidth)
  const setViewportHeight = useMapStore(state => state.setViewportHeight)
  const viewportWidth = useMapStore(state => state.viewportWidth)
  const viewportHeight = useMapStore(state => state.viewportHeight)

  const {
    width,
    height,
    ref: viewportRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 400,
  })

  useEffect(() => {
    if (width && viewportRef.current) {
      setViewportWidth(width)
    }
  }, [width, viewportRef, setViewportWidth])

  useEffect(() => {
    if (height && viewportRef.current) {
      setViewportHeight(height)
    }
  }, [height, setViewportHeight, viewportRef])

  return { viewportRef, viewportWidth, viewportHeight } as const
}

export default useDetectScreen
