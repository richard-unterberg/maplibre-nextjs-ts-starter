import { useCallback } from 'react'
import { rsc } from 'react-styled-classnames'

import CategoryColorBg from '@/components/CategoryColorBg'
import SidebarMenuItem from '@/components/Sidebar/SidebarMenuItem'
import useCategories from '@/hooks/useCategories'
import { CATEGORY_ID } from '@/lib/constants'
import useMapContext from '@/src/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'

const StyledSidebar = rsc.div`
  absolute
  left-5
  bottom-5
  md:w-56
  z-30
`

const Sidebar = () => {
  const { map } = useMapContext()
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const isAnimating = useMapStore(state => state.isAnimating)
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)
  const setSelectedCategory = useMapStore(state => state.setSelectedCategory)
  const { categories, getCategoryById } = useCategories()

  // todo: split into smaller event handlers
  const handleClick = useCallback(
    (categoryId?: CATEGORY_ID) => {
      if (!map || isAnimating) return

      // reset popups
      setMarkerPopup(undefined)

      // set category
      if (categoryId && selectedCategory?.id !== categoryId) {
        setSelectedCategory(getCategoryById(categoryId))
      } else {
        setSelectedCategory(undefined)
      }
    },
    [getCategoryById, isAnimating, map, selectedCategory, setMarkerPopup, setSelectedCategory],
  )

  return isMapGlLoaded ? (
    <StyledSidebar>
      <CategoryColorBg outerClassName="p-2">
        <div className="w-full z-10 relative">
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
    </StyledSidebar>
  ) : null
}

export default Sidebar
