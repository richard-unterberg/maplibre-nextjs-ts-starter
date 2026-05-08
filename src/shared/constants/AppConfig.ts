// FIXME: naming and structure
export const AppConfig = {
  defaultLanguage: 'en',
  defaultMarkerCount: 500,
  defaultClusterRadius: 80,
  ui: {
    barHeight: 80,
    barIconSize: 32,
    bigIconSize: 48,
    markerIconSize: 32,
    twBorderRadius: 'rounded',
    mapIconSizeSmall: 28,
    mapIconSizeBig: 56,
  },
  map: {
    deadzone: 50,
    tileKey: process.env.NEXT_PUBLIC_MAPTILER_KEY,
  },
  animationDuration: 500,
}

export enum NavVariant {
  INTRO = 'vertical',
  TOPNAV = 'horizontal',
}
