import { useCallback } from 'react'

import apiCategories from '@/lib/api/categoriesMock'
import { CATEGORY_ID } from '@/lib/constants'

const useCategories = () => {
  // use api call here
  const categories = apiCategories

  const getCategoryById = useCallback(
    (id: CATEGORY_ID) => categories.find(category => category.id === id),
    [categories],
  )

  return { categories, getCategoryById }
}

export default useCategories
