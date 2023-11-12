import { useEffect } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { shallow } from 'zustand/shallow'

import useMapStore from '@/zustand/useMapStore'

const useDetectScreen = () => {
  const [setViewportWidth, setViewportHeight, viewportWidth, viewportHeight] = useMapStore(
    state => [
      state.setViewportWidth,
      state.setViewportHeight,
      state.viewportWidth,
      state.viewportHeight,
    ],
    shallow,
  )

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
