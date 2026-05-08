import { useCallback } from 'react'

import CategoryColorBg from '@/frontend/components/layout/CategoryColorBg'
import SidebarMenuItem from '@/frontend/components/layout/Sidebar/SidebarMenuItem'
import useCategories from '@/hooks/useCategories'
import { CATEGORY_ID } from '@/shared/constants/constants'
import useMapContext from '@/src/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'

const sidebarClassName = 'absolute left-5 bottom-5 md:w-56 z-30'

const Sidebar = () => {
  const { map } = useMapContext()
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const isAnimating = useMapStore(state => state.isAnimating)
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)
  const setSelectedCategory = useMapStore(state => state.setSelectedCategory)
  const { categories, getCategoryById } = useCategories()

  const handleClick = useCallback(
    (categoryId?: CATEGORY_ID) => {
      if (!map || isAnimating) return

      setMarkerPopup(undefined)

      if (categoryId && selectedCategory?.id !== categoryId) {
        setSelectedCategory(getCategoryById(categoryId))
      } else {
        setSelectedCategory(undefined)
      }
    },
    [getCategoryById, isAnimating, map, selectedCategory, setMarkerPopup, setSelectedCategory],
  )

  return isMapGlLoaded ? (
    <div className={sidebarClassName}>
      <CategoryColorBg outerClassName="p-2">
        <div className="relative z-10 w-full">
          {Object.values(categories).map(category => (
            <SidebarMenuItem
              key={category.id}
              category={category}
              handleClick={handleClick}
              selected={category.id === selectedCategory?.id}
            />
          ))}
        </div>
      </CategoryColorBg>
    </div>
  ) : null
}

export default Sidebar
