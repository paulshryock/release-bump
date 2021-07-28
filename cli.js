#!/usr/bin/env node
import Bump from './src/Bump.js'
import meow from 'meow'

// Get CLI flags.
const cli = meow(`
  Usage
    $ release-bump <input>

  Options
    --prefix, -p  Include a "v" prefix before the version number.
    --quiet,  -q  Silence console logs.

    --help        Log this help text.
    --version     Log the installed release-bump version.

  Examples
    $ release-bump --prefix --quiet
`, {
  importMeta: import.meta,
  flags: {
    prefix: {
      type: 'boolean',
      alias: 'p',
      default: false,
      isMultiple: false,
      isRequired: false,
    },
    quiet: {
      type: 'boolean',
      alias: 'q',
      default: false,
      isMultiple: false,
      isRequired: false,
    },
  },
})

// Instantiate and initialize Bump with CLI flags.
const bump = new Bump({ ...cli.flags })
bump.init()
