import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { FindOrCreate } from "../../../src/pages/FindOrCreate/FindOrCreate";

const renderPage = (page: 0 | 1) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <FindOrCreate pageParam={page} />
    </ThemeProvider>
  );
};

jest.mock("../../../src/hooks/hooks", () => ({
  ...jest.requireActual("../../../src/hooks/hooks"),
  useLinkIncidents: () => ({
    getLinkedIncidents: () => [1, 2, 3],
  }),
}));

jest.mock("../../../src/api/api", () => {
  return {
    getIncidents: () => ({
      incidents: [
        {
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
      ],
    }),
  };
});

describe("Find Create Incident", () => {
  test("Finding Incidents should work", async () => {
    const { getByText } = renderPage(0);
    const service = await waitFor(() => getByText(/Default Service/i));

    const assignee = await waitFor(() => getByText(/John Doe/i));

    const priority = await waitFor(() => getByText(/P0/i));

    await waitFor(() => {
      [service, assignee, priority].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
