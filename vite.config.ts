import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [ 
    vue(
    {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => {
            return tag.includes('CDO')
          }
        },
        transformAssetUrls
      }
    }
  ),

  quasar({
    sassVariables: 'src/quasar-variables.sass'
  })

],
  server: {
    port: 3000
  }
})
