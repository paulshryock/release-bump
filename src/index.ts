import {Bump} from 'release-bump-core'
import {Command, flags} from '@oclif/command'

class ReleaseBump extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),

    // Release bump flags.
    prefix: flags.boolean({char: 'p'}),
    quiet: flags.boolean({char: 'q'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(ReleaseBump)
    const {prefix, quiet} = flags

    console.info({ args })
    console.info({ flags })

    const bump = new Bump()
    await bump.setup()
    await bump.bump()

    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from ./src/index.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }
  }
}

export = ReleaseBump
