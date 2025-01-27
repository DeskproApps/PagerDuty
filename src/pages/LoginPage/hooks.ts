import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  useDeskproAppClient,
  OAuth2StaticCallbackUrl,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getAccessTokenService, checkAuthService } from "../../api/api";
import { useAsyncError } from "../../hooks/useAsyncError";
import { useLinkIncidents } from "../../hooks/hooks";
import { AUTH_URL, ACCESS_TOKEN_PATH } from "../../constants";

export type Result = {
  poll: () => void,
  authUrl: string | null,
  error: null | string,
  isLoading: boolean,
};

const useLogin = (): Result => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<unknown, { client_id: string, instance_url: string }>();
  const [callback, setCallback] = useState<OAuth2StaticCallbackUrl | undefined>();
  const { asyncErrorHandler } = useAsyncError();
  const { getLinkedIncidents } = useLinkIncidents();
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<null | string>(null);
  const clientId = useMemo(() => context?.settings?.client_id, [context]);
  const key = useMemo(() => uuidv4(), []);

  const poll = useCallback(() => {
    if (!client || !callback?.poll || !callback?.callbackUrl) {
      return;
    }

    setError(null);
    setTimeout(() => setIsLoading(true), 500);

    callback.poll()
      .then(({ token }) => getAccessTokenService(client, {
        code: token,
        redirectUri: callback.callbackUrl,
      }))
      .then(({ access_token }) => {
        return client.setUserState(ACCESS_TOKEN_PATH, access_token, { backend: true });
      })
      .then(() => checkAuthService(client))
      .then(() => getLinkedIncidents())
      .then((entityIds) => {
        if (Array.isArray(entityIds) && entityIds.length > 0) {
          navigate("/home")
        } else {
          navigate("/findOrCreate")
        }
      })
      .catch(asyncErrorHandler);
  }, [client, callback, asyncErrorHandler, getLinkedIncidents, navigate]);

  useInitialisedDeskproAppClient((client) => {
    client.oauth2()
      .getGenericCallbackUrl(key, /code=(?<token>[^&]+)/, /state=(?<key>[^&]+)/)
      .then(setCallback);
  }, [setCallback]);

  useEffect(() => {
    if (callback?.callbackUrl && clientId) {
      setAuthUrl(`${AUTH_URL}/authorize?${new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: callback.callbackUrl,
        state: key,
      }).toString()}`);
    }
  }, [key, callback, clientId]);

  return { authUrl, poll, error, isLoading };
};

export { useLogin };
