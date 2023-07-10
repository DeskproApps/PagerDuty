import { AnyIcon, Button, Stack } from "@deskpro/app-sdk";
import { useQueryWithClient } from "../../hooks/useQueryWithClient";
import { getIncidents } from "../../api/api";
import { useState } from "react";
import useDebounce from "../../hooks/debounce";
import { Checkbox, Input } from "@deskpro/deskpro-ui";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import IncidentJson from "../../mapping/incident.json";
import { FieldMapping } from "../FieldMapping/FieldMapping";
import { useLinkIncidents } from "../../hooks/hooks";

export const LinkIncident = () => {
  const [inputText, setInputText] = useState<string>("");
  const [selectedIncidents, setSelectedIncidents] = useState<any[]>([]);
  const [linkedIncidents, setLinkedIncidents] = useState<any[]>([]);
  const { debouncedValue: debouncedText } = useDebounce(inputText, 300);
  const { getLinkedIncidents, linkIncidents } = useLinkIncidents();

  const incidentsQuery = useQueryWithClient(
    "getIncidents",
    (client) => getIncidents(client),
    {
      onSuccess: async (data) => {
        const linkedContacts = await getLinkedIncidents();

        if (!linkedContacts) return;

        if (!Array.isArray(linkedContacts)) {
          return;
        }

        const linkedIncidents = data?.incident?.filter((item) =>
          linkedContacts.includes(item.id)
        );

        setLinkedIncidents(linkedIncidents.map((e) => e.id));
      },
    }
  );

  const incidentsData = incidentsQuery.data;

  return (
    <Stack gap={10} style={{ width: "100%" }} vertical>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter item details"
        type="text"
        leftIcon={faMagnifyingGlass as AnyIcon}
      />
      {incidentsData?.incident && incidentsData?.incident.length !== 0 && (
        <Stack vertical gap={6}>
          <Stack vertical style={{ width: "100%" }} gap={5}>
            <Stack
              style={{ width: "100%", justifyContent: "space-between" }}
              gap={5}
            >
              <Button
                onClick={() => linkIncidents(selectedIncidents)}
                disabled={selectedIncidents.length === 0}
                text="Link Issue"
              ></Button>
              <Button
                disabled={selectedIncidents.length === 0}
                text="Cancel"
                intent="secondary"
                onClick={() => setSelectedIncidents([])}
              ></Button>
            </Stack>
            <HorizontalDivider />
          </Stack>
          {incidentsData?.incident
            ?.filter(
              (e) =>
                !linkedIncidents.includes(e.id) &&
                (debouncedText ? e.title.includes(debouncedText) : true)
            )
            .map((item, i) => {
              return (
                <Stack style={{ width: "100%" }} key={i}>
                  <Checkbox
                    style={{ margin: "10px" }}
                    checked={selectedIncidents.includes(item.id)}
                    onChange={() => {
                      if (selectedIncidents.includes(item.id)) {
                        setSelectedIncidents(
                          selectedIncidents.filter((e) => e !== item.id)
                        );
                      } else {
                        setSelectedIncidents([...selectedIncidents, item.id]);
                      }
                    }}
                  ></Checkbox>
                  <FieldMapping
                    fields={[item]}
                    metadata={IncidentJson.link}
                    idKey={IncidentJson.idKey}
                    internalUrl={`/view/contact/`}
                    externalUrl={IncidentJson.externalUrl}
                    childTitleAccessor={(e) => e.title}
                  />
                </Stack>
              );
            })}
        </Stack>
      )}
    </Stack>
  );
};
