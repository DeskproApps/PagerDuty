import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { ViewIncident } from "../../../src/pages/View/Incident";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <ViewIncident />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  return {
    getIncidentById: () => ({
      incident: {
        id: 1,
        priority: {
          summary: "P0",
          id: "0",
        },
        urgency: "high",
        status: "resolved",
        assignments: [
          {
            assignee: {
              summary: "John Doe",
              id: "1",
            },
          },
        ],
        incident_key: "123456789",
        service: {
          summary: "Default Service",
        },
        description: "This is a description",
        created_at: "2021-01-01T00:00:00Z",
        resolved_at: "2021-01-01T00:00:00Z",
        title: "This is a title",
      },
    }),
    getIncidentNotes: () => ({
      notes: [],
    }),
  };
});

describe("View", () => {
  test("View page should show an incident correctly", async () => {
    const { getByText } = renderPage();

    const incidentKey = await waitFor(() => getByText(/123456789/i));

    const service = await waitFor(() => getByText(/Default Service/i));

    const assignee = await waitFor(() => getByText(/John Doe/i));

    const priority = await waitFor(() => getByText(/P0/i));

    await waitFor(() => {
      [incidentKey, service, assignee, priority].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
