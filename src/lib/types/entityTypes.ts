import Supercluster, { PointFeature } from 'supercluster'

import { CATEGORY_ID } from '@/lib/constants'

export type Category = {
  id: CATEGORY_ID
  name: string
  iconPathSVG: string
  iconSmall: string
  iconMedium: string
  color: string
  hideInNav?: boolean
}

export type Place = {
  id: number
  headline: string
  population: number
  longitude: number
  latitude: number
  category: CATEGORY_ID
}

export type Bound = PointFeature<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [_: string]: any
}>

export type Cluster =
  | supercluster.PointFeature<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [_: string]: any
    }>
  | Supercluster.PointFeature<Supercluster.ClusterProperties & Supercluster.AnyProps>
