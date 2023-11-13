import { z } from "zod";
import { getCreateIncidentMeta } from "../api/api";

export const getMetadataBasedSchema = (
  fields: {
    name: string;
  }[],
  customInputs: {
    [key: string]: z.ZodTypeAny;
  }
) => {
  const newObj: {
    [key: string]: z.ZodTypeAny;
  } = {};

  for (const field of fields) {
    newObj[field.name] = z.string().optional();
  }

  const schema = z
    .object({
      ...newObj,
      ...customInputs,
    })
    .transform((obj) => {
      for (const key of Object.keys(obj)) {
        if (obj[key as keyof typeof obj] === "") {
          delete obj[key as keyof typeof obj];
        }
      }
      return obj;
    });

  return schema;
};

export const getIncidentSchema = (
  fields: {
    name: string;
  }[],
  customInputs: {
    [key: string]: z.ZodTypeAny;
  },
  incidentMeta: Awaited<ReturnType<typeof getCreateIncidentMeta>>
) => {
  const schema = getMetadataBasedSchema(fields, customInputs);

  const transformedSchema = schema.transform((obj) => {
    const assignees = obj.assignments?.map((e: string) => {
      const assignee = incidentMeta.assignments?.find(
        (u) => u.id === e
      ) as Awaited<ReturnType<typeof getCreateIncidentMeta>>["assignments"][0];
      return {
        assignee: {
          id: assignee.id,
          type: "user",
        },
      };
    });

    const newObj = {
      incident: {
        title: obj.title,
        urgency: obj.urgency,
        status: obj.status,
        service: {
          id: obj.services,
          type: "service_reference",
        },
        assignments: assignees,
        priority: obj.priority
          ? {
              id: obj.priority,
              type: "priority_reference",
            }
          : undefined,
      },
    };

    return newObj;
  });

  return transformedSchema;
};
