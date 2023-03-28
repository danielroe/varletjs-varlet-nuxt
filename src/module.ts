import { defineNuxtModule } from '@nuxt/kit'

import type { ModuleOptions } from './types'
import { defaults, moduleName } from './config'
import { resolveOptions, resolveComponents, resolveStyles, resolveImports, transformPlugin } from './core'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: moduleName,
    configKey: moduleName
  },
  defaults,
  setup (_options: ModuleOptions, nuxt) {
    const _configs = _options
    resolveOptions()

    nuxt.options.imports.autoImport !== false && resolveImports(_configs)
    nuxt.options.components !== false && resolveComponents(_configs)

    nuxt.hook('vite:extendConfig', (config, { isClient }) => {
      const mode = isClient ? 'client' : 'server'

      config.plugins = config.plugins || []
      config.plugins.push(
        transformPlugin.vite({
          include: _configs.include,
          exclude: _configs.exclude,
          sourcemap: nuxt.options.sourcemap[mode],
          transformStyles: name => resolveStyles(_configs, name)
        })
      )
    })
  }
})