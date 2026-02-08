import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import useQueuedGeneration from "../useQueuedGeneration";
import type { EditableProjectProps, GridCell } from "../../types";
import type { QueryClient } from "@tanstack/react-query";

type HarnessDeps = {
  setGrid: (updater: (prev: GridCell[]) => GridCell[]) => GridCell[];
  mutateGenerator: (...args: unknown[]) => void;
  mutateEditor: (...args: unknown[]) => void;
  queryClient: QueryClient;
  notifications: { show: (s: string, opts?: Record<string, unknown>) => void };
  project: EditableProjectProps;
};

function Harness({ deps }: { deps: HarnessDeps }) {
  const { handleQueuedGeneration } = useQueuedGeneration(deps);
  return <button onClick={() => handleQueuedGeneration(deps.project)}>Run</button>;
}

describe("useQueuedGeneration", () => {
  const mockProject: EditableProjectProps = {
    category: "DESIGN_GENERATOR",
    prompt: "a prompt",
    n: 1,
    outputFormat: "PNG",
    size: "SIZE_1024x1024",
    quality: "HIGH",
    spaceType: "LIVING_ROOM",
    designTheme: "MODERN",
    images: [],
  };

  it("sets loading then calls mutateGenerator and invalidates queries on success", async () => {
    const setGrid = vi.fn((updater: (prev: GridCell[]) => GridCell[]) => {
      const prev = [null, null];
      // execute updater to simulate React setState functional updater
      const next = updater(prev);
      return next;
    });
    const mutateGenerator = vi.fn((_p, { onSuccess }) => {
      onSuccess?.({ project: { id: "p1", prompt: "a prompt" } as unknown, images: [{ url: "https://example.com/1.png" }] } as unknown);
    });
    const mutateEditor = vi.fn();
    const queryClient = { invalidateQueries: vi.fn() } as unknown as QueryClient;
    const notifications = { show: vi.fn() };

    render(
      <Harness
        deps={{ setGrid, mutateGenerator, mutateEditor, queryClient, notifications, project: mockProject }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /run/i }));

    expect(setGrid).toHaveBeenCalled();
    await waitFor(() => {
      expect(mutateGenerator).toHaveBeenCalled();
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ["projects"] });
    });
    expect(setGrid.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("shows notification and returns immediately when prompt is empty", async () => {
    const setGrid = vi.fn();
    const mutateGenerator = vi.fn();
    const mutateEditor = vi.fn();
    const queryClient = { invalidateQueries: vi.fn() } as unknown as QueryClient;
    const notifications = { show: vi.fn() };
    const projectEmptyPrompt = { ...mockProject, prompt: "" };

    render(
      <Harness
        deps={{ setGrid, mutateGenerator, mutateEditor, queryClient, notifications, project: projectEmptyPrompt }}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /run/i }));

    expect(notifications.show).toHaveBeenCalledWith(
      "Add more details to the prompt for better results.",
      expect.any(Object)
    );
    expect(mutateGenerator).not.toHaveBeenCalled();
    expect(setGrid).not.toHaveBeenCalled();
  });
});
