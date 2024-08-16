import Icon from '@/components/Icon'
import IconCircle from '@/components/IconCircle'
import { AppConfig } from '@/lib/AppConfig'
import { ICON } from '@/theme/iconCollection'
import useMapStore from '@/zustand/useMapStore'

const CategoryDisplay = () => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const throttledViewState = useMapStore(state => state.throttledViewState)

  return (
    <div className="relative">
      {selectedCategory ? (
        <div
          key={selectedCategory.id}
          className="absolute flex left-0 top-0 gap-1 md:gap-2 text-white h-full items-center"
        >
          <IconCircle path={selectedCategory.iconPathSVG} size={AppConfig.ui.markerIconSize} />
          <span className="uppercase md:text-xl font-bold whitespace-nowrap ">
            {selectedCategory.name}
          </span>
        </div>
      ) : (
        <div className="absolute flex left-0 top-0 h-full items-center">
          <span className="inline-flex items-center gap-2 uppercase font-bold">
            <Icon size={AppConfig.ui.barIconSize} icon={ICON.COMPASS} />
            <div className="text-sm md:text-lg">
              <p className="leading-none">{throttledViewState?.latitude}</p>
              <p className="leading-none">{throttledViewState?.longitude}</p>
            </div>
          </span>
        </div>
      )}
    </div>
  )
}

export default CategoryDisplay
