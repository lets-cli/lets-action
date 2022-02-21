
import * as installer from './installer';
import * as core from '@actions/core';
import {dirname} from 'path';


async function _main(): Promise<void> {
    const version = core.getInput('version') || 'latest';
    const goreleaser = await installer.getLets(version);
    core.info(`Lets ${version} installed successfully`);

    const goreleaserDir = dirname(goreleaser);
    core.addPath(goreleaserDir);
    core.debug(`Added ${goreleaserDir} to PATH`);
    return;
}

async function run(): Promise<void> {
    try {
        await _main();
    } catch (error: any) {
        core.setFailed(error.message);
      }
}

run();