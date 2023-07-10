import { Stack, TwoButtonGroup } from "@deskpro/app-sdk";
import { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { LinkIncident } from "../../components/IncidentLinkPage/Link";
import { CreateIncident } from "../../components/IncidentLinkPage/Create";

export const FindOrCreate = () => {
  const [page, setPage] = useState<0 | 1>(0);

  return (
    <Stack vertical>
      <Stack style={{ alignSelf: "center" }}>
        <TwoButtonGroup
          selected={
            {
              0: "one",
              1: "two",
            }[page] as "one" | "two"
          }
          oneIcon={faMagnifyingGlass}
          twoIcon={faPlus}
          oneLabel="Find Item⠀⠀"
          twoLabel="Create Item⠀⠀"
          oneOnClick={() => setPage(0)}
          twoOnClick={() => setPage(1)}
        ></TwoButtonGroup>
      </Stack>

      {
        {
          0: <LinkIncident />,
          1: <CreateIncident />,
        }[page]
      }
    </Stack>
  );
};
