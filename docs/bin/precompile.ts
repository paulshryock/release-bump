import { bumpLicenseYear } from './bump-license-year.js'
import { copyRepoFiles } from './copy-repo-files.js'

// Bump license year to current year.
await bumpLicenseYear()

// Copy repo files.
await copyRepoFiles()
