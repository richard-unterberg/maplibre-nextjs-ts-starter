import Button from '@/components/Button'
import IconCircle from '@/components/IconCircle'
import { AppConfig } from '@/lib/AppConfig'
import { CATEGORY_ID } from '@/lib/constants'
import { Category } from '@/lib/types/entityTypes'
import { theme } from '@/root/tailwind.config'
import useMapStore from '@/zustand/useMapStore'

interface SidebarMenuItemProps {
  handleClick: (categoryId?: CATEGORY_ID) => void
  selected: boolean
  category: Category
}

const SidebarMenuItem = ({ handleClick, selected, category }: SidebarMenuItemProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)

  return (
    <Button
      key={category.id}
      className={`relative p-3 gap-3 w-full flex ${
        selectedCategory ? 'text-white' : ''
      } justify-start`}
      noGutter
      style={{ ...(!selectedCategory ? { color: category.color } : {}) }}
      onClick={() => handleClick(selected ? undefined : category.id)}
      noBorderRadius
    >
      <IconCircle
        path={category.iconPathSVG}
        size={AppConfig.ui.markerIconSize}
        bgColor={selectedCategory?.id === category.id ? theme.colors.white : category.color}
        invert={selectedCategory?.id === category.id}
      />
      <div className={`text-xl ${selectedCategory?.id === category.id ? 'underline' : ''}`}>
        {category.name}
      </div>
    </Button>
  )
}

export default SidebarMenuItem
