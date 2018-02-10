import { readFile } from './utils/promises';

export interface Config {
  git: {
    baseBranch?: string;
    repo?: string;
    pull?: string;
    commit?: string;
  },
  ci: {
    os?: string;
    buildNumber?: string;
    jobNumber?: string;
  };
  message: {
    github?: string;
  };
  actions: any[];
}

export const getConfig = async (configLocation: string = '.lemmy.json'): Promise<Config> => {
  const file = await readFile(configLocation, 'utf-8');
  const config: Config = {
    git: {
      baseBranch: process.env.TRAVIS_BRANCH || 'master',
      repo: process.env.TRAVIS_REPO_SLUG,
      pull: process.env.TRAVIS_PULL_REQUEST,
      commit: process.env.TRAVIS_COMMIT,
    },
    ci: {
      os: process.env.TRAVIS_OS_NAME,
      buildNumber: process.env.TRAVIS_BUILD_NUMBER,
      jobNumber: process.env.TRAVIS_JOB_NUMBER,
    },
    message: {
      github: process.env.GITHUB_TOKEN,
    },
    ...JSON.parse(file),
  };
  config.actions = config.actions.map(action => typeof action === 'string' ? { name: action } : action);
  return config;
};
