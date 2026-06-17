import path from "node:path"
import { fileURLToPath } from "node:url"

const appDir = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(appDir, "../..")

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {
    root: workspaceRoot,
  },
}

export default nextConfig
