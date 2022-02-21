import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as github from './github';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

const osPlat: string = os.platform();
const osArch: string = os.arch();

export async function getLets(version: string): Promise<string> {
  const release: string | null = await github.getRelease(version);
  if (!release) {
    throw new Error(`Cannot find Lets ${version} release`);
  }

  const filename = getFilename();
  const downloadUrl = util.format(
    'https://github.com/lets-cli/lets/releases/download/%s/%s',
    release,
    filename
  );

  core.info(`Downloading ${downloadUrl}`);
  const downloadPath: string = await tc.downloadTool(downloadUrl);
  core.debug(`Downloaded to ${downloadPath}`);

  core.info('Extracting Lets');
  const extPath: string = await tc.extractTar(downloadPath);
  core.debug(`Extracted to ${extPath}`);

  const cachePath: string = await tc.cacheDir(extPath, 'lets-action', release.replace(/^v/, ''));
  core.debug(`Cached to ${cachePath}`);

  const exePath: string = path.join(cachePath, 'lets');
  core.debug(`Exe path is ${exePath}`);

  return exePath;
}

const getFilename = (): string => {
  let arch: string;
  switch (osArch) {
    case 'x64': {
      arch = 'x86_64';
      break;
    }
    case 'x32': {
      arch = 'i386';
      break;
    }
    case 'arm': {
      const arm_version = (process.config.variables as any).arm_version;
      arch = arm_version ? 'armv' + arm_version : 'arm';
      break;
    }
    default: {
      arch = osArch;
      break;
    }
  }
  if (osPlat == 'darwin') {
    arch = 'all';
  }
  const platform: string = osPlat == 'darwin' ? 'Darwin' : 'Linux';
  const ext: string = 'tar.gz';
  return util.format('lets_%s_%s.%s', platform, arch, ext);
};
