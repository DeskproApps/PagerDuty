import { IncidentNote } from "../../api/types";
import { formatDateSince } from "../../utils/dateUtils";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Avatar, H1, H2, Stack } from "@deskpro/deskpro-ui";

type Props = {
  notes: IncidentNote[];
  id: string;
};

export const Notes = ({ notes, id }: Props) => {
  const navigate = useNavigate();
  return (
    <Stack vertical gap={5} style={{ width: "100%" }}>
      <Stack gap={5}>
        <H1>Notes ({notes.length})</H1>
        <FontAwesomeIcon
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          icon={faPlus as any}
          size="sm"
          style={{
            alignSelf: "center",
            cursor: "pointer",
            marginBottom: "2px",
          }}
          onClick={() => navigate(`/create/note/${id}`)}
        ></FontAwesomeIcon>
      </Stack>
      {notes.map((note, i) => (
        <Stack key={i} vertical gap={5} style={{ width: "100%" }}>
          <Stack style={{ alignItems: "flex-start", marginTop: "5px" }}>
            <Stack
              vertical
              gap={3}
              style={{
                marginLeft: "5px",
                alignItems: "center",
              }}
            >
              <Avatar size={22} name={note.user.summary}></Avatar>
              <H2>{formatDateSince(new Date(note.created_at)).slice(0, 5)}</H2>
            </Stack>
            <div style={{ maxWidth: "20ch", marginLeft: "10px" }}>
              <H2>{note.content}</H2>
            </div>
          </Stack>
          <HorizontalDivider />
        </Stack>
      ))}
    </Stack>
  );
};
