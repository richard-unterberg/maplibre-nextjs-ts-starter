import { LucideProps } from 'lucide-react'
import Image from 'next/image'
import { FunctionComponent } from 'react'

import IconFC from '@/components/IconFC'
import { AppConfig } from '@/lib/AppConfig'

interface IconCircleProps {
  icon?: FunctionComponent<LucideProps>
  path?: string
  bgColor?: string
  color?: string
  invert?: boolean
  size?: number
  shadow?: boolean
}

const IconCircle = ({ icon, path, invert, size, bgColor, color, shadow }: IconCircleProps) => (
  <div
    className={`rounded-full flex justify-center items-center cursor-pointer ${
      shadow ? 'shadow' : ''
    }`}
    style={{
      backgroundColor: bgColor ?? 'transparent',
      width: size ?? AppConfig.ui.markerIconSize,
      height: size ?? AppConfig.ui.markerIconSize,
      color: '#ffffff',
    }}
  >
    {icon && (
      <IconFC
        className={invert ? 'invert' : ''}
        icon={icon}
        size={size ? size - 12 : AppConfig.ui.markerIconSize}
        color={color ?? '#ffffff'}
      />
    )}
    {path && (
      <Image
        src={path}
        className={invert ? 'invert' : ''}
        width={size ? size - 12 : AppConfig.ui.markerIconSize}
        height={size ? size - 12 : AppConfig.ui.markerIconSize}
        alt=""
      />
    )}
  </div>
)

export default IconCircle
