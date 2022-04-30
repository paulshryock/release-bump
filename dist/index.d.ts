/** Release Bump options. */
export interface ReleaseBumpOptions {
    /** Path to changelog. */
    changelogPath?: string;
    /** Path to config file. */
    configPath?: string;
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
 * Bumps Changelog and docblock versions for a code release.
 *
 * Use `unreleased` in your Changelog and docblock comments, and Release Bump
 * will automatically bump it to the correct release version.
 *
 * @since  3.0.0
 * @param  {ReleaseBumpOptions} options Release Bump options.
 * @return {string[]}                   Bumped files.
 * @throws {Error}                      On file system read/write error.
 */
export declare function releaseBump(options?: ReleaseBumpOptions): Promise<string[]>;
