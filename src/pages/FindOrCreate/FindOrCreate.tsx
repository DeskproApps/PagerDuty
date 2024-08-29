import { TwoButtonGroup } from "@deskpro/app-sdk";
import { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { LinkIncident } from "../../components/LinkIncident/Link";
import { CreateIncident } from "../../components/MutateIncident/MutateIncident";
import { Container } from "../../components/common";

export const FindOrCreate = ({ pageParam }: { pageParam?: 0 | 1 }) => {
  const [page, setPage] = useState<0 | 1>(pageParam || 0);

  return (
    <Container>
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
      />

      {
        {
          0: <LinkIncident />,
          1: <CreateIncident />,
        }[page]
      }
    </Container>
  );
};
