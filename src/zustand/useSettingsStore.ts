import { create } from 'zustand'

import { AppConfig } from '@/lib/AppConfig'

interface SettingsStoreValues {
  markersCount: number
  setMarkersCount: (payload: number | undefined) => void
  markerSize: number
  setMarkerSize: (payload: number) => void
  clusterRadius: number
  setClusterRadius: (payload: number | undefined) => void
  markerJSXRendering: boolean
  setMarkerJSXRendering: (payload: boolean) => void
}

/**
 * A custom hook that returns a Zustand store for managing settings.
 * @returns {SettingsStoreValues} The Zustand store for managing settings.
 */
const useSettingsStore = create<SettingsStoreValues>()(set => ({
  markersCount: AppConfig.defaultMarkerCount,
  setMarkersCount: payload => set(() => ({ markersCount: payload })),

  markerSize: AppConfig.ui.markerIconSize,
  setMarkerSize: payload => set(() => ({ markerSize: payload })),

  clusterRadius: AppConfig.defaultClusterRadius,
  setClusterRadius: payload => set(() => ({ clusterRadius: payload })),

  markerJSXRendering: false,
  setMarkerJSXRendering: payload => set(() => ({ markerJSXRendering: payload })),
}))

export default useSettingsStore
