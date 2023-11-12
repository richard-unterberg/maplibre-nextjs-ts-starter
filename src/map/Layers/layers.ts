import type { LayerProps } from 'react-map-gl'

import { theme } from '@/root/tailwind.config'

export const clusterLayer = (categoryId: string, size: number, color: string): LayerProps => ({
  id: `cluster-${categoryId}`,
  type: 'circle',
  source: `source-${categoryId}`, // Use the correct source ID
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': color,
    'circle-radius': size / 2,
  },
})

export const clusterBelowLayer = (categoryId: string, size: number, color: string): LayerProps => ({
  id: `cluster-below-${categoryId}`,
  type: 'circle',
  source: `source-${categoryId}`, // Use the correct source ID
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': color,
    'circle-opacity': 0.5,
    'circle-radius': size / 2 + 8,
  },
})

export const clusterCountLayer = (categoryId: string): LayerProps => ({
  id: `cluster-count-${categoryId}`,
  type: 'symbol',
  source: `source-${categoryId}`, // Use the correct source ID
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['Catamaran Bold', 'Arial Unicode MS Bold'],
    'text-size': 10,
    'text-allow-overlap': true,
  },
  paint: {
    'text-color': theme.colors.white,
    'text-opacity': 0.95,
  },
})

export const clusterCountBadgeLayer = (categoryId: string, size: number): LayerProps => ({
  id: `cluster-badge-count-${categoryId}`,
  type: 'circle',
  source: `source-${categoryId}`, // Use the correct source ID
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': 'transparent',
    'circle-radius': size / 2 - 6,
    'circle-stroke-opacity': 0.5,
    // 'circle-translate': [0, -size / 2 / 1.4],
    'circle-stroke-width': 1, // Adjust the border width as needed
    'circle-stroke-color': theme.colors.white,
  },
})

export const markerLayer = (categoryId: string, size: number, color: string): LayerProps => ({
  id: `marker-${categoryId}`,
  type: 'circle',
  source: `source-${categoryId}`, // Use the correct source ID
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': color,
    'circle-radius': size / 2,
  },
})

export const iconLayer = (category: string, size: number): LayerProps => ({
  id: `icon-layer-${category}`,
  type: 'symbol',
  source: `source-${category}`, // Make sure to replace this with your source id
  layout: {
    'text-allow-overlap': true,
    'icon-image': `category-thumb-${category}`, // Use the name you specified when loading the icon
    'icon-size': (size / 2) * 0.025, // Adjust the size as needed
    'text-ignore-placement': true,
    'text-optional': true,
  },
})
