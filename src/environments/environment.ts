import settings from './secrets.json';

export const environment = {
  ...settings,
  production: false,
};
