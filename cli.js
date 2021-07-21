#!/usr/bin/env node
import Bump from './src/Bump.js'
import meow from 'meow'

const cli = meow(`
  Usage
    $ release-bump <input>

  Options
    --prefix, -p  Include a "v" prefix before the version number.

  Examples
    $ release-bump --prefix
`, {
  importMeta: import.meta,
  flags: {
    prefix: {
      type: 'boolean',
      alias: 'p',
      default: false,
      isMultiple: false,
      isRequired: false,
    }
  }
})

;(async function () {
  const bump = new Bump({ ...cli.flags })
  await bump.init()
})();
