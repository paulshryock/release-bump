#!/usr/bin/env node
(function () {
  const Bump = require('./bump.js')

  /**
   * Initialize Release Bump.
   *
   * @since 1.0.0
   */
  async function init () {
    new Bump()
  }

  // Initialize Release Bump.
  init()
})()
