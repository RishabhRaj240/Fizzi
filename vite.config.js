import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Never inline binary assets — GLBs/textures must always be served as
    // real files with correct MIME types, not base64-encoded data URIs.
    assetsInlineLimit: 0,
  },

  // Ensure Vite treats these binary formats as static assets (not inlined)
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.png', '**/*.jpg'],
})
