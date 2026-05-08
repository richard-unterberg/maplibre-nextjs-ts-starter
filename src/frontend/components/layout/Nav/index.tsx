import Icon from '@/frontend/components/layout/Icon'
import { AppConfig, NavVariant } from '@/shared/constants/AppConfig'
import { ICON } from '@/theme/iconCollection'
import useMapStore from '@/zustand/useMapStore'

import NavItem from './NavItem'

interface NavProps {
  variant?: NavVariant
}

const Nav = ({ variant = NavVariant.INTRO }: NavProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)

  const textColor = selectedCategory ? 'text-white' : 'text-dark'

  const listClassName =
    variant === NavVariant.TOPNAV
      ? `flex h-full gap-4 text-lg text-sm md:text-base items-center ${textColor}`
      : 'flex h-full flex-col justify-between gap-1 w-fit text-primary'

  return (
    <ul className={listClassName}>
      <NavItem
        href="https://github.com/richard-unterberg/maplibre-nextjs-ts-starter"
        label="Fork on Github"
        icon={<Icon size={AppConfig.ui.barIconSize} icon={ICON.GITHUB} />}
        external
      />
    </ul>
  )
}

export default Nav
