import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
  	alias: {
  		'@': path.resolve(__dirname, './src'),
  		'@c': path.resolve(__dirname, './src/component'),
  		'@r': path.resolve(__dirname, './src/route'),
  		'@s': path.resolve(__dirname, './src/store'),
      '@style': path.resolve(__dirname, './src/style'),
      '@service': path.resolve(__dirname, './src/service'),
  	}
  }
})
