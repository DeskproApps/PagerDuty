import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNote, getCurrentUser } from "../../api/api";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { LoadingSpinnerCenter } from "../../components/LoadingSpinnerCenter/LoadingSpinnerCenter";
import { Button, P8, Stack } from "@deskpro/deskpro-ui";
import { Container } from "../../components/common";

export const CreateNote = () => {
  const { client } = useDeskproAppClient();
  const navigate = useNavigate();
  const { incidentId } = useParams();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Comment");

    client.deregisterElement("editButton");
  });

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");
      }
    },
  });

  const currentUserQuery = useQueryWithClient(["currentUser"], async (client) =>
    getCurrentUser(client)
  );

  if (currentUserQuery.isFetching) return <LoadingSpinnerCenter />;

  const currentUser = currentUserQuery.data?.user;

  return (
    <Container>
      <Stack style={{ width: "100%" }} vertical gap={8}>
        <InputWithTitle
          title="New note"
          setValue={(e) => setNote(e.target.value)}
          data-testid="note-input"
          value={note}
          required={true}
        />
        <Stack justify="space-between" style={{ width: "100%" }}>
          <Button
            data-testid="button-submit"
            onClick={async () => {
              if (!client) return;

              setSubmitting(true);

              if (note.length === 0) {
                setError("Note cannot be empty");

                return;
              }

              await createNote(
                client,
                incidentId as string,
                note,
                currentUser?.email
              );

              navigate(-1);
            }}
            text={submitting ? "Creating..." : "Create"}
            disabled={submitting}
          />
          <Button onClick={() => navigate(-1)} text="Cancel" intent="secondary" />
        </Stack>
        {error && <P8 color="red">{error}</P8>}
      </Stack>
    </Container>
  );
};
