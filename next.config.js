const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  ...(process.env.NETLIFY === 'true' && { target: 'serverless' }),
  env: {
    CMS_GHOST_API_URL: 'https://gaftoblog.digitalpress.blog',
    CMS_GHOST_API_KEY: '2a4cfcc3d2ee9943aef20991b9',
    SITE_URL: 'https://gaftoblog.vercel.app',
    //SITE_URL: 'http://localhost:3000',
  },
  images: {
    deviceSizes: [320, 500, 680, 1040, 2080, 2048, 3120],
    domains: [
      'localhost',
      'images.unsplash.com',
      'static.gotsby.org',
      'static.ghost.org',
      'hooshmand.net',
      'cms.jamify.org',
      'demo.jamify.org',
      'www.jamify.org',
      'www.gatsbyjs.org',
      'cdn.commento.io',
      'gatsby.ghost.io',
      'ghost.org',
      'repository-images.githubusercontent.com',
      'www.gravatar.com',
      'github.githubassets.com',
      'www.crio.do',
      'digitalpress.fra1.cdn.digitaloceanspaces.com',
    ],
  },
  reactStrictMode: true,
})
