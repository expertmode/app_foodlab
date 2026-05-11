/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Keep these outside the server bundle.
  // @sparticuz/chromium ships a tar.br binary that the loader expects to find
  // on disk via __dirname; if webpack/Turbopack inlines it, the loader fails
  // with "input directory does not exist" inside Vercel's /var/task.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
};

export default nextConfig;
