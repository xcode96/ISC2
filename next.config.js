/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // The GitHub Actions workflow will automatically inject basePath
  // when using actions/configure-pages@v5 with static_site_generator: next
  // So we don't need to manually set it anymore
}

module.exports = nextConfig
