import {
  Button,
  Stack,
  useDeskproAppEvents,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { getIncidentSchema } from "../../schemas";
import { ZodTypeAny, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import incidentJson from "../../mapping/incident.json";
import { FieldMappingInput } from "../FieldMappingInput/FieldMappingInput";
import {
  createIncident,
  getCreateIncidentMeta,
  getCurrentUser,
} from "../../api/api";
import { useQueryMutationWithClient } from "../../hooks/useQueryWithClient";
import { Incident } from "../../types/Incident";
import { useNavigate } from "react-router-dom";
import { LoadingSpinnerCenter } from "../LoadingSpinnerCenter/LoadingSpinnerCenter";
import { useLinkIncidents } from "../../hooks/hooks";

const inputs = incidentJson.create;

export const CreateIncident = () => {
  const navigate = useNavigate();
  const [schema, setSchema] = useState<ZodTypeAny | null>(null);
  const { linkIncidents } = useLinkIncidents();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema as ZodTypeAny),
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

  const submitMutation = useQueryMutationWithClient<
    Incident,
    { incident: Incident }
  >((client, data) =>
    createIncident(client, data, currentUserQuery.data?.user?.email as string)
  );

  const incidentMeta = useQueryWithClient(["incidentMeta"], (client) =>
    getCreateIncidentMeta(client)
  );

  useEffect(() => {
    if (!submitMutation.isSuccess) return;

    (async () => {
      await linkIncidents([submitMutation.data?.incident?.id as string]);

      navigate("/redirect");
    })();
  }, [submitMutation.isSuccess, navigate, linkIncidents, submitMutation.data]);

  useEffect(() => {
    if (inputs.length === 0 || !incidentMeta.data) return;

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
  }, [incidentMeta.data]);

  if (!incidentMeta.isSuccess) return <LoadingSpinnerCenter />;

  return (
    <form
      onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
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
        <Stack>
          <Button
            type="submit"
            text="Create"
            loading={!submitMutation.isIdle}
            disabled={!submitMutation.isIdle}
            intent="primary"
          ></Button>
        </Stack>
      </Stack>
    </form>
  );
};
