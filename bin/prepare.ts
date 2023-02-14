import { install } from 'husky'

const isCi = process.env.CI !== undefined

if (!isCi) install('bin/husky')
