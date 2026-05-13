import Icon from '@/components/Icon'
import { AppConfig, NavVariant } from '@/lib/AppConfig'
import { ICON } from '@/theme/iconCollection'
import useMapStore from '@/zustand/useMapStore'

import NavItem from './NavItem'

interface StyledListProps {
  $variant: NavVariant
  $isSelectedCategory?: boolean
  children?: React.ReactNode
}

const StyledList = ({ $variant, $isSelectedCategory, children, ...props }: StyledListProps) => {
  const textColor = $isSelectedCategory ? `text-white` : `text-dark`
  const dynamicClasses = $variant === NavVariant.TOPNAV
    ? `gap-4 text-lg text-sm md:text-base items-center ${textColor}`
    : 'flex-col justify-between gap-1 w-fit text-primary'

  return (
    <ul className={`flex h-full ${dynamicClasses}`} {...props}>
      {children}
    </ul>
  )
}

interface NavProps {
  variant?: NavVariant
}

const Nav = ({ variant = NavVariant.INTRO }: NavProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)

  return (
    <StyledList $variant={variant} $isSelectedCategory={!!selectedCategory}>
      <NavItem
        href="https://github.com/richard-unterberg/maplibre-nextjs-ts-starter"
        label="Fork on Github"
        icon={<Icon size={AppConfig.ui.barIconSize} icon={ICON.GITHUB} />}
        external
      />
    </StyledList>
  )
}

export default Nav
