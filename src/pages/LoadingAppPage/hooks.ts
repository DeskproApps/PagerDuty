import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { checkAuthService } from "../../api/api";
import { useLinkIncidents } from "../../hooks/hooks";
import { AUTH_ERROR } from "../../constants";

type UseLoadingApp = () => {
  error: null | string;
};

const useLoadingApp: UseLoadingApp = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext<unknown, { client_id: string, instance_url: string }>();
  const { getLinkedIncidents } = useLinkIncidents();
  const [error, setError] = useState<null | string>(null);
  const clientId = useMemo(() => context?.settings?.client_id, [context]);

  useInitialisedDeskproAppClient((client) => {
    if (!clientId) {
      setError(AUTH_ERROR);
      return;
    }

    setError(null);

    checkAuthService(client)
      .then(() => getLinkedIncidents())
      .then((entityIds) => {
        if (Array.isArray(entityIds) && entityIds.length > 0) {
          navigate("/home")
        } else {
          navigate("/findOrCreate")
        }
      })
      .catch(() => navigate("/login"));
  }, [clientId]);

  return { error };
};

export { useLoadingApp };
