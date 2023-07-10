import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLinkIncidents = () => {
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();

  const deskproUser = context?.data.user;

  const linkIncidents = useCallback(
    async (incidentsId: string[]) => {
      if (!context || !incidentsId.length || !client || !deskproUser) return;

      setIsLinking(true);

      await Promise.all(
        (incidentsId || []).map((id) =>
          client
            ?.getEntityAssociation("linkedXeroContacts", deskproUser?.id)
            .set(id)
        )
      );

      navigate("/");

      setIsLinking(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, client, deskproUser]
  );

  const getLinkedIncidents = useCallback(async () => {
    if (!client || !deskproUser) return;

    return await client
      .getEntityAssociation("linkedXeroContacts", deskproUser.id)
      .list();
  }, [client, deskproUser]);

  const unlinkContact = useCallback(
    async (incidentId: string) => {
      if (!client || !deskproUser) return;

      await client
        .getEntityAssociation("linkedXeroContacts", deskproUser.id)
        .delete(incidentId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [client, deskproUser]
  );
  return {
    linkIncidents,
    isLinking,
    getLinkedIncidents,
    unlinkContact,
  };
};
