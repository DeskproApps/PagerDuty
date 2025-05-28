import {
  Link,
  useDeskproAppEvents,
  useDeskproElements,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { getIncidents } from "../../api/api";
import { ChangeEvent, useState } from "react";
import useDebounce from "../../hooks/debounce";
import { AnyIcon, Button, Checkbox, Input, Stack } from "@deskpro/deskpro-ui";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import IncidentJson from "../../mapping/incident.json";
import { FieldMapping } from "../FieldMapping/FieldMapping";
import { useLinkIncidents, useTicketCount } from "../../hooks/hooks";
import { LoadingSpinnerCenter } from "../LoadingSpinnerCenter/LoadingSpinnerCenter";
import { Title } from "../../styles";
import { useNavigate } from "react-router-dom";

export const LinkIncident = () => {
  const [inputText, setInputText] = useState<string>("");
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const [linkedIncidents, setLinkedIncidents] = useState<string[]>([]);
  const [incidentLinketCount, setIncidentLinkedCount] = useState<
    Record<string, number>
  >({});
  const [page, setPage] = useState<number>(0);
  const { debouncedValue: debouncedText } = useDebounce(inputText, 300);
  const { getLinkedIncidents, linkIncidents } = useLinkIncidents();
  const { getMultipleIncidentTicketCount } = useTicketCount();
  const navigate = useNavigate();

  useDeskproElements(({ registerElement, clearElements }) => {
      clearElements()
      registerElement("homeButton", {
        type: "home_button",
      });
      registerElement("refreshButton", { type: "refresh_button" });
  })
  
  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Link Incident");
  }, []);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/home");
      }
    },
  });

  const incidentsQuery = useQueryWithClient(
    ["getIncidents", page.toString(), debouncedText],
    (client) => getIncidents(client, page, debouncedText),
    {
      onSuccess: async (data) => {
        const linkedIncidentsFunc = await getLinkedIncidents();

        if (!linkedIncidentsFunc) return;

        const linkedIncidentsIds = data?.incidents
          ?.filter((item) => linkedIncidentsFunc.includes(item.id))
          .map((e) => e.id);

        const linkedIncidentTickets = await getMultipleIncidentTicketCount(
          linkedIncidentsIds
        );

        setLinkedIncidents([...linkedIncidents, ...linkedIncidentsIds]);

        setIncidentLinkedCount({
          ...incidentLinketCount,
          ...linkedIncidentTickets,
        });
      },
    }
  );

  const incidentsData = incidentsQuery.data;

  return (
    <Stack gap={10} style={{ width: "100%" }} vertical>
      <Input
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter Incident Key"
        type="text"
        leftIcon={faMagnifyingGlass as AnyIcon}
      />
      {!incidentsQuery.isSuccess ? (
        <LoadingSpinnerCenter />
      ) : (
        <Stack vertical gap={6} style={{ width: "100%" }}>
          <Stack vertical style={{ width: "100%" }} gap={5}>
            <Stack
              style={{ width: "100%", justifyContent: "space-between" }}
              gap={5}
            >
              <Button
                onClick={() => linkIncidents(selectedIncidents)}
                disabled={selectedIncidents.length === 0}
                text="Link Incident"
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
          {incidentsData?.incidents.length !== 0 ? (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              {incidentsData?.incidents.map((item, i) => {
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
                            setSelectedIncidents([
                              ...selectedIncidents,
                              item.id,
                            ]);
                          }
                        }}
                      ></Checkbox>
                    </Stack>
                    <Stack style={{ width: "95%" }}>
                      <FieldMapping
                        fields={[
                          {
                            ...item,
                            linked_tickets: incidentLinketCount[item.id] || 0,
                          },
                        ]}
                        metadata={IncidentJson.link}
                        idKey={IncidentJson.idKey}
                        externalChildUrl={IncidentJson.externalUrl}
                        childTitleAccessor={(e) => (
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (selectedIncidents.includes(item.id)) {
                                setSelectedIncidents(selectedIncidents.filter((e) => e !== item.id));
                              } else {
                                setSelectedIncidents([...selectedIncidents, item.id]);
                              }
                            }}
                          >{e.title}</Link>
                        )}
                      />
                    </Stack>
                  </Stack>
                );
              })}
              {incidentsData?.more && (
                <Button
                  style={{
                    width: "97%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  text="Load more"
                  intent="secondary"
                  onClick={() => setPage(page + 1)}
                ></Button>
              )}
            </Stack>
          ) : (
            <Title>No Incidents Found.</Title>
          )}
        </Stack>
      )}
    </Stack>
  );
};
