import { AUTH_URL, ACCESS_TOKEN_PATH, REFRESH_TOKEN_PATH } from "../../constants";
import { getAccessTokenService } from "../../api/api";
import { OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient, } from "@deskpro/app-sdk";
import { Settings } from "../../types/deskpro";
import { useLinkIncidents } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";

export type Result = {
  onSignIn: () => void,
  authUrl: string | null,
  error: null | string,
  isLoading: boolean,
};

const useLogin = (): Result => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const { getLinkedIncidents } = useLinkIncidents();
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<null | string>(null);

  useInitialisedDeskproAppClient(async (client) => {

    if (context?.settings.use_deskpro_saas === undefined) {
      // Make sure settings have loaded.
      return;
    }

    const clientId = context?.settings.client_id;
    const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

    if (mode === 'local' && typeof clientId !== 'string') {
      // Local mode requires a clientId.
      return;
    }

    const oauth2 =
      mode === 'local'
        // Local Version (custom/self-hosted app)
        ? await client.startOauth2Local(
          ({ state, callbackUrl }) => {
            return `${AUTH_URL}/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${callbackUrl}`;
          },
          /\bcode=(?<code>[^&#]+)/,
          async (code: string): Promise<OAuth2Result> => {
            // Extract the callback URL from the authorization URL
            const url = new URL(oauth2.authorizationUrl);
            const redirectUri = url.searchParams.get("redirect_uri");

            if (!redirectUri) {
              throw new Error("Failed to get callback URL");
            }

            const data = await getAccessTokenService(client, { code, redirectUri });

            return { data }
          }
        )

        // Global Proxy Service
        : await client.startOauth2Global("aa9376f9-b1f1-4fab-8a69-bc5c5108ce28");

    setAuthUrl(oauth2.authorizationUrl)
    setIsLoading(false)

    try {
      const result = await oauth2.poll()
      await Promise.all([
        client.setUserState(ACCESS_TOKEN_PATH, result.data.access_token, { backend: true }),
        result.data.refresh_token ? client.setUserState(REFRESH_TOKEN_PATH, result.data.refresh_token, { backend: true }) : Promise.resolve(undefined)
      ])

      const linkedIncidents = await getLinkedIncidents()

      if (linkedIncidents && linkedIncidents.length > 0) {
        navigate("/home")
      } else {
        navigate("/findOrCreate")
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
    }
  }, [setAuthUrl, context?.settings.client_id, context?.settings.use_deskpro_saas]);

  const onSignIn = useCallback(() => {
    setIsLoading(true);
    window.open(authUrl ?? "", '_blank');
  }, [setIsLoading, authUrl]);

  return { authUrl, onSignIn, error, isLoading };
};

export { useLogin };
