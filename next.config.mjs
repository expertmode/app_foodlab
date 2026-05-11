/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Keep these outside the server bundle. @sparticuz/chromium ships a tar.br
  // binary that the loader expects to find on disk via __dirname; if
  // webpack/Turbopack inlines it, the loader fails with
  // "input directory does not exist" inside Vercel's /var/task.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  // Externalization alone is not enough on Vercel — its NFT (Node File Tracer)
  // also has to be told to copy the chromium binary into the function bundle.
  outputFileTracingIncludes: {
    '/api/admin/catalog/export': [
      './node_modules/@sparticuz/chromium/**/*',
    ],
  },
};

export default nextConfig;
