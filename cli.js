#!/usr/bin/env node
import Bump from './src/Bump.js'

;(async function () {
  const bump = new Bump()
  await bump.init()
})();
