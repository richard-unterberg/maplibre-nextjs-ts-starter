import CategoryColorBg from '@/components/CategoryColorBg'
import Nav from '@/components/Nav'
import CategoryDisplay from '@/components/TopBar/CategoryDisplay'
import { AppConfig, NavVariant } from '@/lib/AppConfig'
import useMapStore from '@/zustand/useMapStore'

const TopBar = () => {
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)

  return isMapGlLoaded ? (
    <div
      className="absolute left-0 top-0 w-full shadow-md"
      style={{ height: AppConfig.ui.barHeight }}
    >
      <CategoryColorBg className="absolute inset-0" />
      <div className="px-4 relative flex items-center justify-between h-full">
        <CategoryDisplay />
        <Nav variant={NavVariant.TOPNAV} />
      </div>
    </div>
  ) : null
}

export default TopBar
