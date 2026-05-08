/**
 * App Icons Collection - All icons must be defined here
 * no manual imports in modules needed / wanted
 * todo: "minimize", "maximize", "close" icons
 */
import { LucideProps } from 'lucide-react'
import dynamic from 'next/dynamic'

const Github = dynamic(() => import('lucide-react').then(module => module.Github))
const Compass = dynamic(() => import('lucide-react').then(module => module.Compass))

export enum ICON {
  NONE,
  GITHUB,
  COMPASS,
}

type ICON_TYPE = {
  [key in ICON]: {
    component: React.ComponentType<LucideProps> | null
    className?: string
  }
}

export const APP_ICON: ICON_TYPE = {
  [ICON.NONE]: { component: null },
  [ICON.GITHUB]: { component: Github },
  [ICON.COMPASS]: { component: Compass },
}
