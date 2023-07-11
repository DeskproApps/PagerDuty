import { AnyIcon, Button, LoadingSpinner, Stack } from "@deskpro/app-sdk";
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
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [linkedIncidents, setLinkedIncidents] = useState<string[]>([]);
  const { debouncedValue: debouncedText } = useDebounce(inputText, 300);
  const { getLinkedIncidents, linkIncidents } = useLinkIncidents();

  const incidentsQuery = useQueryWithClient(
    "getIncidents",
    (client) => getIncidents(client),
    {
      onSuccess: async (data) => {
        const linkedIncidentsFunc = await getLinkedIncidents();

        if (!linkedIncidentsFunc) return;

        const linkedIncidents = data?.incidents?.filter((item) =>
          linkedIncidentsFunc.includes(item.id)
        );

        setLinkedIncidents(linkedIncidents.map((e) => e.id));
      },
    }
  );

  if (!incidentsQuery.isSuccess) return <LoadingSpinner />;

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
      {incidentsData?.incidents.length !== 0 && (
        <Stack vertical gap={6} style={{ width: "100%" }}>
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
          {incidentsData?.incidents
            ?.filter(
              (e) =>
                !linkedIncidents.includes(e.id) &&
                (debouncedText ? e.title.includes(debouncedText) : true)
            )
            .map((item, i) => {
              return (
                <Stack style={{ width: "100%" }} key={i} gap={6}>
                  <Stack style={{ marginTop: "2px" }}>
                    <Checkbox
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
                  </Stack>
                  <Stack style={{ width: "90%" }}>
                    <FieldMapping
                      fields={[item]}
                      metadata={IncidentJson.link}
                      idKey={IncidentJson.idKey}
                      internalChildUrl={`/view/incident/`}
                      externalChildUrl={IncidentJson.externalUrl}
                      childTitleAccessor={(e) => e.title}
                    />
                  </Stack>
                </Stack>
              );
            })}
        </Stack>
      )}
    </Stack>
  );
};
