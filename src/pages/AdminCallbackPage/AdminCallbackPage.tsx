import { useState } from "react";
import { OAuth2Result, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { AdminCallback } from "../../components/AdminCallback";
import type { FC } from "react";

const AdminCallbackPage: FC = () => {
  const [callbackUrl, setCallbackUrl] = useState<null|string>(null);

  useInitialisedDeskproAppClient(async (client) => {
    const oauth2 = await client.startOauth2Local(
      ({ state, callbackUrl }) => `https://identity.pagerduty.com/oauth/authorize?response_type=code&client_id=xxx&state=${state}&redirect_uri=${callbackUrl}`,
      /code=(?<code>[0-9a-f]+)/,
      async (): Promise<OAuth2Result> => ({ data: { access_token: "", refresh_token: "" } })
    );

    const url = new URL(oauth2.authorizationUrl);
    const redirectUri = url.searchParams.get("redirect_uri");

    if (redirectUri) {
      setCallbackUrl(redirectUri);
    }
  });

  return (
    <AdminCallback callbackUrl={callbackUrl} />
  );
};

export { AdminCallbackPage };
