import { AUTH_URL, ACCESS_TOKEN_PATH, REFRESH_TOKEN_PATH } from "../../constants";
import { getAccessTokenService } from "../../api/api";
import { IOAuth2, OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient, } from "@deskpro/app-sdk";
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
  const [authUrl, setAuthUrl] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false)
  const [oauth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)

  useInitialisedDeskproAppClient(async (client) => {

    if (context?.settings.use_deskpro_saas === undefined) {
      // Make sure settings have loaded.
      return;
    }

    const clientId = context?.settings.client_id;
    const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

    if (mode === 'local' && (typeof clientId !== 'string' || clientId.trim() === "")) {
      // Local mode requires a clientId.
      return;
    }

    // Start OAuth process depending on the authentication mode
    const oauth2Response =
      mode === 'local'
        // Local Version (custom/self-hosted app)
        ? await client.startOauth2Local(
          ({ state, callbackUrl }) => {
            return `${AUTH_URL}/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${callbackUrl}`;
          },
          /\bcode=(?<code>[^&#]+)/,
          async (code: string): Promise<OAuth2Result> => {
            // Extract the callback URL from the authorization URL
            const url = new URL(oauth2Response.authorizationUrl);
            const redirectUri = url.searchParams.get("redirect_uri");

            if (!redirectUri) {
              throw new Error("Failed to get callback URL");
            }

            const data = await getAccessTokenService(client, { code, redirectUri });

            return { data }
          }
        )

        // Global Proxy Service
        : await client.startOauth2Global("2edbb59b-ff63-41fb-bffd-d81da0868404");

    setAuthUrl(oauth2Response.authorizationUrl)
    setOAuth2Context(oauth2Response)

  }, [setAuthUrl, context?.settings.client_id, context?.settings.use_deskpro_saas]);

  useInitialisedDeskproAppClient((client) => {
    if (!oauth2Context) {
      return
    }

    const startPolling = async () => {
      try {
        const result = await oauth2Context.poll()

        await client.setUserState(ACCESS_TOKEN_PATH, result.data.access_token, { backend: true })
        if (result.data.refresh_token) {
          await client.setUserState(REFRESH_TOKEN_PATH, result.data.refresh_token, { backend: true })
        }

        const linkedIncidents = await getLinkedIncidents()

        if (linkedIncidents && linkedIncidents.length > 0) {
          navigate("/home")
        } else {
          navigate("/findOrCreate")
        }

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false)
        setIsPolling(false)
      }
    }

    if (isPolling) {
      void startPolling()
    }
  }, [isPolling, oauth2Context, navigate])

  const onSignIn = useCallback(() => {
    setIsLoading(true);
    setIsPolling(true);
    window.open(authUrl ?? "", '_blank');
  }, [setIsLoading, authUrl]);

  return { authUrl, onSignIn, error, isLoading };
};

export { useLogin };
