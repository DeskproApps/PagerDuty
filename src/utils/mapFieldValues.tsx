import { ReactElement } from "react";
import { IJson } from "../types/json";
import { getObjectValue, makeFirstLetterUppercase } from "./utils";
import { Incident } from "../types/Incident";

export const mapFieldValues = (
  metadataFields: IJson["list"][0] | IJson["view"][0],
  field: Incident
) => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date":
        value = new Date(
          field[metadataField.name as keyof Incident] as string
        ).toLocaleDateString("en-GB");
        break;

      case "key": {
        value = getObjectValue(field, metadataField.name);

        break;
      }

      case "assignees": {
        value = field.assignments.reduce(
          (acc, assignment, i) =>
            acc +
            `${assignment.assignee.summary}${
              i === field.assignments.length - 1 ? "" : ", "
            } `,
          ""
        );

        break;
      }

      case "summary": {
        (() => {
          if (Array.isArray(field[metadataField.name as keyof Incident])) {
            value = (
              field[metadataField.name as keyof Incident] as {
                summary: string;
              }[]
            )?.reduce((acc, summary) => acc + `${summary.summary}`, "");
          } else {
            value = (
              field[metadataField.name as keyof Incident] as { summary: string }
            )?.summary;
          }
        })();
        break;
      }

      case "incidentKey": {
        if (
          (field[metadataField.name as keyof Incident] as string).includes(
            "REDACTED"
          )
        )
          break;

        value = field[metadataField.name as keyof Incident];

        break;
      }

      case "text":
      default:
        value = makeFirstLetterUppercase(
          field[metadataField.name as keyof Incident]?.toString() as string
        );
    }

    return {
      key: metadataField.label,
      value: value as string | number | ReactElement | undefined,
    };
  });
};
