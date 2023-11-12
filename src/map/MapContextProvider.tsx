import { createContext, useState } from 'react'
import { MapRef } from 'react-map-gl'

interface MapContextValues {
  map: MapRef | undefined
  setMap: (e: MapRef | undefined) => void
}

export const MapContext = createContext<MapContextValues | undefined>(undefined)

interface MapContextProviderProps {
  children: React.ReactNode
}

const MapContextProvider = ({ children }: MapContextProviderProps) => {
  const [map, setMap] = useState<MapRef | undefined>(undefined)

  return <MapContext.Provider value={{ map, setMap }}>{children}</MapContext.Provider>
}

export default MapContextProvider
