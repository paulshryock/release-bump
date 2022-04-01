/** Release Bump options. */
export interface ReleaseBumpOptions {
    /** Path to changelog. */
    changelogPath?: string;
    /** Release date. */
    date?: string;
    /** Dry run. */
    dryRun?: boolean;
    /** Fail on error. */
    failOnError?: boolean;
    /** Path to directory of files to bump. */
    filesPath?: string;
    /** Directories to ignore. */
    ignore?: string[];
    /** Prefix release version with a 'v'. */
    prefix?: boolean;
    /** Quiet, no logs. */
    quiet?: boolean;
    /** Release version. */
    release?: string;
    /** Repository. */
    repository?: string;
}
/**
 * Release Bump.
 *
 * @since  3.0.0
 * @param  {ReleaseBumpOptions} options Release Bump options.
 * @return {string[]}                   Bumped files.
 * @throws {Error}                      On file system read/write error.
 * @todo                                Inject dependencies.
 */
export declare function releaseBump(options: ReleaseBumpOptions): Promise<string[]>;
