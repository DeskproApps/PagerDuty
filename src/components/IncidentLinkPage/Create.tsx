import { Button, Stack } from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { getMetadataBasedSchema } from "../../schemas/default";
import { ZodTypeAny, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import incidentJson from "../../mapping/incident.json";
import { FieldMappingInput } from "../FieldMappingInput/FieldMappingInput";

const inputs = incidentJson.create;

export const CreateIncident = () => {
  const [schema, setSchema] = useState<ZodTypeAny | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema as ZodTypeAny),
  });

  useEffect(() => {
    if (inputs.length === 0) return;

    const newObj: { [key: string]: ZodTypeAny } = {};

    inputs.forEach((field) => {
      if (field.type === "text") {
        if (field.required) {
          newObj[field.name] = z.string().nonempty();
        } else {
          newObj[field.name] = z.string().optional();
        }
      }
    });

    setSchema(getMetadataBasedSchema(inputs, newObj));
  }, []);

  const submit = () => {};

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack vertical>
        {inputs.map((field, i) => (
          <FieldMappingInput
            key={i}
            dropdownData={{}}
            errors={errors}
            field={field}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        ))}
        <Stack>
          <Button type="submit" text="Submit" intent="primary"></Button>
        </Stack>
      </Stack>
    </form>
  );
};
