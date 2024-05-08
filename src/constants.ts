export const AUTH_URL = "https://identity.pagerduty.com/oauth";

export const AUTH_ERROR = "You need to navigate to the settings and go through the authorization process again.";

export const ACCESS_TOKEN_PATH = "oauth2/access_token";

export const placeholders = {
  CLIENT_ID: "__client_id__",
  CLIENT_SECRET: "__client_secret.urlencode__",
  ACCESS_TOKEN: `[user[${ACCESS_TOKEN_PATH}]]`,
};
