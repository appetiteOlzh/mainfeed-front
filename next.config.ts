import type { NextConfig } from "next";
const config: NextConfig = {
  async redirects() {
    return [{ source: "/index.html", destination: "/", permanent: true }];
  },
};
export default config;
