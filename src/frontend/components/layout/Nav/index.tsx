import { User, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'

import Icon from '@/frontend/components/layout/Icon'
import { getFirebaseAuth, getFirebaseConfigError } from '@/frontend/services/firebase'
import { AppConfig, NavVariant } from '@/shared/constants/AppConfig'
import { ICON } from '@/theme/iconCollection'
import useMapStore from '@/zustand/useMapStore'

import NavItem from './NavItem'

interface NavProps {
  variant?: NavVariant
}

const Nav = ({ variant = NavVariant.INTRO }: NavProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (getFirebaseConfigError()) {
      return undefined
    }

    const auth = getFirebaseAuth()

    return onAuthStateChanged(auth, user => {
      setCurrentUser(user)
    })
  }, [])

  const textColor = selectedCategory ? 'text-white' : 'text-dark'

  const listClassName =
    variant === NavVariant.TOPNAV
      ? `flex h-full gap-4 text-lg text-sm md:text-base items-center ${textColor}`
      : 'flex h-full flex-col justify-between gap-1 w-fit text-primary'

  const accountLabel = currentUser
    ? currentUser.displayName || currentUser.email || 'Account'
    : 'Login'

  return (
    <ul className={listClassName}>
      <NavItem
        href="/login"
        label={accountLabel}
        icon={<Icon size={AppConfig.ui.barIconSize} icon={ICON.USER} />}
      />

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
