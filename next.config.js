const nextConfig = {
  reactStrictMode: true,
  // route every mapbox-gl import to maplibre-gl
  webpack: config => {
    config.resolve.alias['mapbox-gl'] = 'maplibre-gl'
    return config
  },
}

module.exports = nextConfig
