import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ZodTypeAny, z } from "zod";
import {
  editIncident,
  getCreateIncidentMeta,
  getCurrentUser,
  getIncidentById,
} from "../../api/api";
import { FieldMappingInput } from "../../components/FieldMappingInput/FieldMappingInput";
import { LoadingSpinnerCenter } from "../../components/LoadingSpinnerCenter/LoadingSpinnerCenter";
import { useQueryMutationWithClient } from "../../hooks/useQueryWithClient";
import incidentJson from "../../mapping/incident.json";
import { getIncidentSchema } from "../../schemas";
import { Incident } from "../../types/Incident";
import { Button, Stack } from "@deskpro/deskpro-ui";
import { Container } from "../../components/common";

const inputs = incidentJson.edit;

export const EditIncident = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const [schema, setSchema] = useState<ZodTypeAny | null>(null);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Edit Incident");

    client.deregisterElement("editButton");

    client.deregisterElement("menuButton");
  }, []);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/home");
      }
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema as ZodTypeAny),
  });

  const currentUserQuery = useQueryWithClient(["currentUser"], async (client) =>
    getCurrentUser(client)
  );

  const submitMutation = useQueryMutationWithClient<Incident>((client, data) =>
    editIncident(
      client,
      incidentId as string,
      data,
      currentUserQuery.data?.user?.email as string
    )
  );

  const incidentMeta = useQueryWithClient(["incidentMeta"], (client) =>
    getCreateIncidentMeta(client)
  );

  const incidentByIdQuery = useQueryWithClient(
    ["getIncidentById"],
    (client) => getIncidentById(client, incidentId as string),
    {
      enabled: !!incidentId,
    }
  );

  useEffect(() => {
    if (!submitMutation.isSuccess) return;

    navigate("/view/incident/" + incidentId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitMutation.isSuccess]);

  useEffect(() => {
    if (inputs.length === 0 || !incidentMeta.isSuccess) return;

    const newObj: { [key: string]: ZodTypeAny } = {};

    inputs.forEach((field) => {
      if (field.required) {
        newObj[field.name] = z.string().nonempty();
      } else if (field.name === "assignments") {
        newObj[field.name] = z.array(z.string()).optional();
      } else {
        newObj[field.name] = z.string().optional();
      }
    });
    setSchema(getIncidentSchema(inputs, newObj, incidentMeta.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentMeta.isSuccess]);

  useEffect(() => {
    if (!incidentByIdQuery.data) return;

    const incident = incidentByIdQuery.data.incident;
    const data = {
      ...incident,
      assignments: incident.assignments?.map((a) => a.assignee.id),
      services: incident.service.id,
      priority: incident.priority?.id,
    };

    reset(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentByIdQuery.isSuccess]);
  if (!incidentMeta.isSuccess || !incidentByIdQuery.isSuccess)
    return <LoadingSpinnerCenter />;

  return (
    <Container>
      <form
        onSubmit={handleSubmit((data) => {
          data.incident.type = "incident_reference";
          submitMutation.mutate(data);
        })}
        style={{ width: "100%" }}
      >
        <Stack vertical style={{ width: "100%" }} gap={6}>
          {inputs.map((field, i) => (
            <FieldMappingInput
              key={i}
              dropdownData={incidentMeta.data}
              errors={errors}
              field={field}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          ))}
          <Stack justify="space-between" style={{ width: "100%" }}>
            <Button
              type="submit"
              loading={!submitMutation.isIdle}
              disabled={!submitMutation.isIdle}
              text="Edit"
              intent="primary"
              data-testid="button-submit"
            ></Button>
            <Button
              onClick={() => navigate(-1)}
              text={"Cancel"}
              disabled={!submitMutation.isIdle}
              intent="secondary"
            ></Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};
