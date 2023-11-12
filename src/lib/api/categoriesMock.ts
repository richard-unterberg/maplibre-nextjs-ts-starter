import { CATEGORY_ID } from '@/lib/constants'
import { Category } from '@/lib/types/entityTypes'

const apiCategories: Category[] = [
  {
    id: CATEGORY_ID.CAT1,
    name: 'Category One',
    iconPathSVG: 'icons/cookie.svg',
    iconSmall: 'icons/cookie-sm.png',
    iconMedium: 'icons/cookie-md.png',
    color: '#F04B48',
  },
  {
    id: CATEGORY_ID.CAT2,
    name: 'Category Two',
    iconPathSVG: 'icons/cassette-tape.svg',
    iconSmall: 'icons/cassette-tape-sm.png',
    iconMedium: 'icons/cassette-tape-md.png',
    color: '#4F57F0',
  },
  {
    id: CATEGORY_ID.CAT3,
    name: 'Category Three',
    iconPathSVG: 'icons/pocket-knife.svg',
    iconSmall: 'icons/pocket-knife-sm.png',
    iconMedium: 'icons/pocket-knife-md.png',
    color: '#D6B840',
  },
  {
    id: CATEGORY_ID.CAT4,
    name: 'Category Four',
    iconPathSVG: 'icons/package-plus.svg',
    iconSmall: 'icons/package-plus-sm.png',
    iconMedium: 'icons/package-plus-md.png',
    color: '#5FC27F',
  },
]

export default apiCategories
