import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";
import createNextIntlPlugin from "next-intl/plugin";
// const locales = ["en", "de", "cs"];
const nextConfig: NextConfig = withContentlayer({
  /* config options here */
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
});

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
