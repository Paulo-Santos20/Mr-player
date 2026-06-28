import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['chrome >= 38'],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/actual/promise',
        'core-js/actual/dom-exception',
      ],
      polyfills: [
        'es.symbol',
        'es.symbol.description',
        'es.object.assign',
        'es.object.values',
        'es.object.entries',
        'es.promise',
        'es.promise.finally',
        'es.string.iterator',
        'es.array.iterator',
        'es.array.from',
        'es.array.find',
        'es.array.find-index',
        'es.array.includes',
        'es.array.flat',
        'es.array.flat-map',
        'es.string.starts-with',
        'es.string.ends-with',
        'es.string.includes',
        'es.string.trim',
        'es.number.constructor',
        'es.number.is-nan',
        'es.number.is-integer',
        'es.number.is-finite',
        'es.map',
        'es.set',
        'es.weak-map',
        'es.weak-set',
        'es.reflect.to-string-tag',
        'web.dom-collections.iterator',
        'web.dom-collections.for-each',
        'web.url',
        'web.url.to-json',
      ],
    }),
  ],
})