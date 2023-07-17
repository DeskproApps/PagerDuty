import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor, screen } from "@testing-library/react/";
import * as Api from "../../../src/api/api";
import React from "react";
import { EditIncident } from "../../../src/pages/Edit/Indicent";
import userEvent from "@testing-library/user-event";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <EditIncident />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    getCurrentUser: () => ({}),
    editIncident: jest.fn(),
    getIncidentById: () => ({
      incident: {
        id: 1,
        priority: {
          summary: "P0",
          id: "0",
        },
        urgency: "high",
        status: "resolved",
        incident_key: "123456789",
        service: {
          id: "1",
          summary: "Default Service",
        },
        description: "This is a description",
        created_at: "2021-01-01T00:00:00Z",
        resolved_at: "2021-01-01T00:00:00Z",
        title: "This is a title",
      },
    }),
    getCreateIncidentMeta: () => ({
      priority: [],
      services: [],
      urgency: [],
      status: [],
    }),
  };
});

jest.mock("../../../src/hooks/useQueryWithClient", () => ({
  useQueryWithClient: (
    queryKey: string,
    queryFn: () => () => void,
    options: Record<string, string | boolean>
  ) => {
    queryKey;
    options;
    if (!options || options?.enabled == null || options?.enabled == true) {
      return {
        isSuccess: true,
        data: queryFn(),
        isLoading: false,
      };
    }
    return {
      isSuccess: false,
      data: null,
      isLoading: false,
    };
  },
  useQueryMutationWithClient: () => ({
    mutate: () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment
      //@ts-ignore
      Api.editIncident();
    },
    isSuccess: true,
    isLoading: false,
    isIdle: true,
  }),
}));

describe("Edit Page", () => {
  test("Editing an Incident should work correctly", async () => {
    renderPage();

    const inputElement = screen.getByTestId("input-title");
    const submitButton = screen.getByTestId("button-submit");

    userEvent.type(inputElement, "This is a title");

    expect(inputElement).toHaveValue("This is a title");

    userEvent.click(submitButton);
    await waitFor(() => expect(Api.editIncident).toHaveBeenCalledTimes(1));
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
