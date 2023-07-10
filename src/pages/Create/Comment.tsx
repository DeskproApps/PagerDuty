import {
  Button,
  P8,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { useState } from "react";
import { createComment } from "../../api/api";

export const CreateComment = () => {
  const { client } = useDeskproAppClient();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [comment, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useInitialisedDeskproAppClient((client) => {
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

  return (
    <Stack style={{ width: "100%" }} vertical gap={8}>
      <InputWithTitle
        title="New note"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore wrong type
        setValue={(e) => setNote(e.target.value)}
        data-testid="note-input"
        value={comment}
        required={true}
      />
      <Stack justify="space-between" style={{ width: "100%" }}>
        <Button
          data-testid="button-submit"
          onClick={async () => {
            if (!client) return;

            setSubmitting(true);

            if (comment.length === 0) {
              setError("Note cannot be empty");

              return;
            }

            await createComment(client, orderId as string, comment);

            navigate(-1);
          }}
          text={submitting ? "Creating..." : "Create"}
        />
        <Button onClick={() => navigate(-1)} text="Cancel" intent="secondary" />
      </Stack>
      {error && <P8 color="red">{error}</P8>}
    </Stack>
  );
};
