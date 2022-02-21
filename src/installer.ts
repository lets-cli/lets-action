import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as github from './github';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

export async function getLets(version: string): Promise<string> {
  const release: string | null = await github.getRelease(version);
  if (!release) {
    throw new Error(`Cannot find Lets ${version} release`);
  }

  const filename = getFilename(os.platform(), os.arch());
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

export const getFilename = (osPlat: string, osArch: string): string => {
  let arch: string;
  switch (osArch) {
    case 'x64': {
      arch = 'x86_64';
      break;
    }
    case 'arm': {
      arch = 'arm64';
      break;
    }
    default: {
      arch = osArch;
      break;
    }
  }
  const platform: string = osPlat == 'darwin' ? 'Darwin' : 'Linux';
  const ext: string = 'tar.gz';
  return util.format('lets_%s_%s.%s', platform, arch, ext);
};
