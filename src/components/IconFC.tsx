import { LucideProps } from 'lucide-react'
import { FunctionComponent, useMemo } from 'react'

export type IconFCProps = {
  icon?: FunctionComponent<LucideProps>
  color?: string
  size?: number
  className?: string
}

const IconFC = ({ icon, color, size, className }: IconFCProps) => {
  const IconComponent = useMemo(() => icon ?? null, [icon])

  return (
    <div {...(className ? { className } : {})}>
      {IconComponent && <IconComponent color={color} size={size} />}
    </div>
  )
}

export default IconFC
