import {
  ExternalIconLink,
  Property,
  PropertyRow,
  useDeskproAppTheme,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { ReactElement, ReactNode } from "react";
import { StyledLink } from "../../styles";
import { IJson } from "../../types/json";
import { mapFieldValues } from "../../utils/mapFieldValues";
import { AppLogo } from "../AppLogo/AppLogo";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { H1, H2, H3, P11, P5, Stack } from "@deskpro/deskpro-ui";

const SpaceBetweenFields = ({
  field: field,
}: {
  field: {
    key: string | number;
    value: string | number | ReactElement | undefined;
  };
}) => {
  return (
    <Stack
      style={{
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <H1>{field.key}:</H1>
      <H1>{field.value}</H1>
    </Stack>
  );
};

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
  internalUrl?: string;
  externalUrl?: string;
  metadata: IJson["view"];
  idKey?: string;
  internalChildUrl?: string;
  externalChildUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childTitleAccessor?: (field: any) => ReactNode;
  title?: string;
};

export const FieldMapping = ({
  fields,
  externalUrl,
  internalUrl,
  metadata,
  idKey = "",
  internalChildUrl,
  externalChildUrl,
  childTitleAccessor,
  title,
}: Props) => {
  const { theme } = useDeskproAppTheme();
  const { context } = useDeskproLatestAppContext<unknown, { client_id: string, instance_url: string }>();

  return (
    <Stack vertical gap={5} style={{ width: "100%" }}>
      {title ||
        internalUrl ||
        (externalUrl && (
          <Stack
            style={{
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            {title && internalUrl ? (
              <StyledLink title="title" to={internalUrl + fields[0][idKey]}>
                {title}
              </StyledLink>
            ) : (
              title && <H1>{title}</H1>
            )}
            {externalUrl && (
              <ExternalIconLink
                href={context?.settings.instance_url + "/" + externalUrl}
                icon={<AppLogo />}
              ></ExternalIconLink>
            )}
          </Stack>
        ))}
      {fields.map((field, i) => (
        <Stack vertical style={{ width: "100%" }} gap={10} key={i}>
          {(internalChildUrl || childTitleAccessor || externalChildUrl) && (
            <Stack
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              {internalChildUrl && childTitleAccessor && (
                <StyledLink to={internalChildUrl + field[idKey]}>
                  {childTitleAccessor(field)}
                </StyledLink>
              )}
              {!internalChildUrl && childTitleAccessor && (
                <H3 style={{ fontSize: "12px" }}>
                  {childTitleAccessor(field)}
                </H3>
              )}
              {externalChildUrl && (
                <ExternalIconLink
                  href={
                    context?.settings.instance_url +
                    "/" +
                    externalChildUrl +
                    field[idKey]
                  }
                  icon={<AppLogo />}
                ></ExternalIconLink>
              )}
            </Stack>
          )}
          {metadata?.map((metadataFields, i) => {
            const usableFields = mapFieldValues(metadataFields, field, context);

            switch (usableFields.length) {
              case 1:
                if (!usableFields[0].value) return;

                return (
                  <Stack vertical gap={4} key={i} style={{ width: "100%" }}>
                    <H2 style={{ color: theme?.colors.grey80 }}>
                      {usableFields[0].key}
                    </H2>
                    <P5 style={{ whiteSpace: "pre-line", width: "100%" }}>
                      {usableFields[0].value}
                    </P5>
                  </Stack>
                );

              case 3:
                return (
                  <Stack
                    style={{ justifyContent: "space-between", width: "100%" }}
                    key={i}
                  >
                    <Stack vertical gap={4}>
                      <P5 theme={theme}>{usableFields[0].value}</P5>
                      <P11 style={{ whiteSpace: "pre-line" }}>
                        {usableFields[1].value}
                      </P11>
                    </Stack>
                    <H3>{usableFields[2].value}</H3>
                  </Stack>
                );
              case 4:
              case 2:
                return (
                  <Stack style={{ width: "100%" }} vertical gap={5} key={i}>
                    <PropertyRow key={i}>
                      {usableFields
                        .filter((_, i) => i !== 2)
                        .map((e, ii) => (
                          <Property
                            label={e.key as string}
                            key={ii}
                            text={<P5>{e.value != null ? e.value : "-"}</P5>}
                          ></Property>
                        ))}
                    </PropertyRow>
                  </Stack>
                );

              default:
                return (
                  <Stack gap={20} vertical style={{ width: "100%" }} key={i}>
                    {usableFields
                      .filter((e) => e.key)
                      .map((usableField, usableFieldI) => {
                        if (!usableField.value) return;

                        return (
                          <Stack
                            vertical
                            style={{ width: "100%" }}
                            key={usableFieldI}
                          >
                            <SpaceBetweenFields
                              field={usableField}
                            ></SpaceBetweenFields>
                          </Stack>
                        );
                      })}
                  </Stack>
                );
            }
          })}
          <HorizontalDivider />
        </Stack>
      ))}
    </Stack>
  );
};
