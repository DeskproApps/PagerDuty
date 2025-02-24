import { AUTH_ERROR } from "../../constants";
import { checkAuthService } from "../../api/api";
import { Settings } from "../../types/deskpro";
import { useDeskproLatestAppContext, useInitialisedDeskproAppClient, } from "@deskpro/app-sdk";
import { useLinkIncidents } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type UseLoadingApp = () => {
  error: null | string;
};

const useLoadingApp: UseLoadingApp = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const { getLinkedIncidents } = useLinkIncidents();
  const [error, setError] = useState<null | string>(null);
  const instance_url = context?.settings.instance_url;

  useInitialisedDeskproAppClient((client) => {

    if (context?.settings.use_deskpro_saas === undefined) {
      return;
    }

    const clientId = context?.settings.client_id;
    const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';
    if (mode === 'local' && typeof clientId !== 'string') {
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
  }, [instance_url]);

  return { error };
};

export { useLoadingApp };
