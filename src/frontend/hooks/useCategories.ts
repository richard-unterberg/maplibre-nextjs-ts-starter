import { useCallback, useRef } from 'react'

import apiCategories from '@/backend/db/api/categoriesMock'
import { CATEGORY_ID } from '@/shared/constants/constants'

const useCategories = () => {
  // use api call here
  const { current: categories } = useRef(apiCategories)

  const getCategoryById = useCallback(
    (id: CATEGORY_ID) => categories.find(category => category.id === id),
    [categories],
  )

  return { categories, getCategoryById }
}

export default useCategories
