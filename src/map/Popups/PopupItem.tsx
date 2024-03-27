import { Minimize2, X } from 'lucide-react'
import { Popup } from 'react-map-gl'

import Button from '@/components/Button'
import IconCircle from '@/components/IconCircle'
import useCategories from '@/hooks/useCategories'
import { AppConfig } from '@/lib/AppConfig'
import { Place } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

interface PopupItemProps {
  place: Place
  handleBackToCluster: () => void
}

const PopupItem = ({ place, handleBackToCluster }: PopupItemProps) => {
  const { getCategoryById } = useCategories()
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const markerSize = useSettingsStore(state => state.markerSize)
  const currentCat = getCategoryById(place.category)

  if (!currentCat) return null

  return (
    <Popup
      className="w-10/12"
      closeOnClick={false}
      closeButton={false}
      longitude={place.longitude}
      latitude={place.latitude}
      maxWidth="320px"
      anchor="top"
      offset={[0, -AppConfig.ui.markerIconSize] as never}
    >
      <div className="bg-mapBg text-dark shadow-md rounded-md p-2 -mt-3 relative">
        <div className="flex justify-center absolute w-full left-0 top-0 mt-4">
          <IconCircle path={`/${currentCat.iconMedium}`} size={markerSize} invert />
        </div>
        <Button
          className="absolute right-0 top-2 text-dark inline-block"
          onClick={() => setMarkerPopup(undefined)}
          small
        >
          <X size={AppConfig.ui.mapIconSizeSmall} />
        </Button>
        <div className="flex flex-row justify-center pt-3">
          <div
            className="flex flex-col justify-center p-3 text-center w-full"
            style={{ marginTop: markerSize }}
          >
            <h3 className="text-lg font-bold leading-none m-0">{place.headline}</h3>
            <p className="text-darkLight m-0  mt-2">Population: {place.population}</p>
            <div className="flex flex-row justify-between gap-2 mt-6">
              <Button
                className="bg-warning text-white gap-2"
                onClick={() => handleBackToCluster()}
                small
              >
                <Minimize2 size={AppConfig.ui.mapIconSizeSmall} />
                Minimize
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default PopupItem
