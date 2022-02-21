import * as httpm from '@actions/http-client';

export const getRelease = async (version: string): Promise<string | null> => {
  return version === 'latest' ? await getLatestTag() : await getTag(version);
};

interface GitHubTag {
  tag_name: string;
}

const getLatestTag = async (): Promise<string | null> => {
  const http: httpm.HttpClient = new httpm.HttpClient('lets-action');
  const url: string = `https://github.com/lets-cli/lets/releases/latest`;
  const latest = await http.getJson<GitHubTag>(url);
  return latest.result?.tag_name ?? null;
};

const getTag = async (version: string): Promise<string | null> => {
  const http: httpm.HttpClient = new httpm.HttpClient('lets-action');
  const url: string = `https://github.com/lets-cli/lets/releases/${version}`;

  let tag;
  try {
    const versionJSON = await http.getJson<GitHubTag>(url);
    tag = versionJSON.result?.tag_name ?? null;
  } catch (error: any) {
    tag = null;
  }
  
  return tag;
};
