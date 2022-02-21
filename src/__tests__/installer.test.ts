import fs = require('fs');
import * as installer from '../installer';

describe('installer', () => {
  it('acquires v0.0.45 version of Lets', async () => {
    const lets = await installer.getLets('v0.0.45');
    expect(fs.existsSync(lets)).toBe(true);
  }, 100000);

  it('acquires latest version of Lets', async () => {
    const lets = await installer.getLets('latest');
    expect(fs.existsSync(lets)).toBe(true);
  }, 100000);

  it('can not acquire wrong Lets version', async () => {
    const version = 'v.xxx';
    await expect(installer.getLets(version))
    .rejects
    .toThrow(`Cannot find Lets ${version} release`);
  }, 100000);
});

describe('getFilename', () => {
  it('filename for linux amd64', () => {
    const filename = installer.getFilename('linux', 'x64');
    expect(filename).toBe('lets_Linux_x86_64.tar.gz');
  });

  it('filename for MacOS amd64', () => {
    const filename = installer.getFilename('darwin', 'x64');
    expect(filename).toBe('lets_Darwin_x86_64.tar.gz');
  });
  
  it('filename for MacOS arm64', () => {
    const filename = installer.getFilename('darwin', 'arm');
    expect(filename).toBe('lets_Darwin_arm64.tar.gz');
  });
});