import { LucideProps } from 'lucide-react'
import { Suspense } from 'react'

import { APP_ICON, ICON } from '@/theme/iconCollection'

interface AppIconProps extends LucideProps {
  icon: ICON
}

const Icon = ({ icon, ...props }: AppIconProps) => {
  const AppIconComponent = APP_ICON[icon].component ?? null

  if (AppIconComponent) {
    return (
      <Suspense>
        <AppIconComponent {...props} />
      </Suspense>
    )
  }
  return null
}

export default Icon
