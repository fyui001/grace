import { fixupConfigRules } from '@eslint/compat'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import storybook from 'eslint-plugin-storybook'

const config = [
  {
    ignores: ['.next/**', 'storybook-static/**', 'node_modules/**'],
  },
  ...fixupConfigRules(nextCoreWebVitals),
  ...fixupConfigRules(nextTypescript),
  ...storybook.configs['flat/recommended'],
  prettier,
  {
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      'storybook/no-renderer-packages': 'off',
    },
  },
]

export default config
