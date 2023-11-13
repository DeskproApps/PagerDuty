import { ReactElement } from "react";
import { IJson } from "../types/json";
import { getObjectValue, makeFirstLetterUppercase } from "./utils";
import { Incident } from "../types/Incident";
import { formatDate } from "./dateUtils";
import { Stack } from "@deskpro/deskpro-ui";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIconHover } from "../styles";
import { LatestDeskproAppContext } from "@deskpro/app-sdk";

export const mapFieldValues = (
  metadataFields: IJson["list"][0] | IJson["view"][0],
  field: Incident,
  context: LatestDeskproAppContext["context"] | null
) => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date":
        value = formatDate(
          new Date(field[metadataField.name as keyof Incident] as string)
        );

        if (value.includes("1970")) value = "-";
        break;

      case "key":
        value = getObjectValue(field, metadataField.name);

        break;

      case "service":
        value = (() => {
          const service = field[metadataField.name as keyof Incident] as {
            summary: string;
            id: string;
          };
          return (
            <Stack gap={5}>
              <div>{service.summary}</div>
              <a
                target="_blank"
                href={
                  context?.settings.instance_url +
                  `/service-directory/` +
                  service.id
                }
                style={{ all: "unset" }}
              >
                <FontAwesomeIconHover
                  style={{ marginTop: "3px" }}
                  size="xs"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  icon={faExternalLink as any}
                />
              </a>
            </Stack>
          );
        })();

        break;

      case "assignees":
        value = field.assignments.reduce(
          (acc, assignment, i) =>
            acc +
            `${assignment.assignee.summary}${
              i === field.assignments.length - 1 ? "" : ", "
            } `,
          ""
        );

        break;

      case "summary":
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

      case "incidentNumber":
        value = `#${field[metadataField.name as keyof Incident]}`;

        break;

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
