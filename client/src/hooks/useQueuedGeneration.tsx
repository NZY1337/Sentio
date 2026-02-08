import type { GridCell, EditableProjectProps, ProjectResponseProps } from "../types";
import { mapResponseData } from "../components/utils/utilities";
import type { QueryClient } from "@tanstack/react-query";

type MutateFn = (
  p: EditableProjectProps,
  opts: { onSuccess?: (data: ProjectResponseProps) => void; onError?: () => void }
) => void;

// Mock data generator function
const generateMockResponse = (project: EditableProjectProps): ProjectResponseProps => {
  const mockImageUrls = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800", 
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
  ];

  const randomImages = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
    id: `mock-img-${Date.now()}-${i}`,
    url: mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)],
    createdAt: new Date().toISOString(),
    projectId: `mock-project-${Date.now()}`,
  }));

  return {
    project: {
      id: `mock-project-${Date.now()}`,
      userId: "mock-user-id",
      category: project.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      prompt: project.prompt,
      background: project.background || "auto",
      images: project.images || [],
      outputFormat: project.outputFormat,
      quality: project.quality,
      size: project.size,
      designTheme: project.designTheme,
      spaceType: project.spaceType,
      n: project.n,
    },
    images: randomImages,
    imageGenerationResponse: {
      id: `mock-gen-${Date.now()}`,
      projectId: `mock-project-${Date.now()}`,
      inputTokens: Math.floor(Math.random() * 1000) + 100,
      imageTokens: Math.floor(Math.random() * 2000) + 500,
      textTokens: Math.floor(Math.random() * 500) + 50,
      outputTokens: Math.floor(Math.random() * 1500) + 200,
      totalTokens: Math.floor(Math.random() * 5000) + 1000,
      imageCost: Math.random() * 2 + 0.5,
      tokenCost: Math.random() * 1 + 0.2,
      totalCost: Math.random() * 3 + 0.7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  };
};

/**
 * Custom React hook to handle queued generation or editing of design projects,
 * supporting both real API calls and mock data simulation for development/testing.
 *
 * This hook manages the process of updating a grid of cells with loading states,
 * invoking the appropriate mutation (generator or editor) based on the project category,
 * and handling notifications and cache invalidation. When `useMockData` is enabled,
 * it simulates the API response with a delay and mock data.
 *
 * @param setGrid - Function to update the grid state, typically representing UI cells.
 * @param mutateGenerator - Mutation function for design generation API calls.
 * @param mutateEditor - Mutation function for design editing API calls.
 * @param queryClient - React Query client instance for cache management.
 * @param notifications - Object with a `show` method to display user notifications.
 * @param useMockData - Optional flag to enable mock data simulation (default: true).
 *
 * @returns An object with the `handleQueuedGeneration` function, which processes a project
 *          and updates the grid accordingly, handling both mock and real API flows.
 */
export default function useQueuedGeneration({
  setGrid,
  mutateGenerator,
  mutateEditor,
  queryClient,
  notifications,
  useMockData = true, // Add this flag to enable/disable mocking
}: {
  setGrid: (updater: (prev: GridCell[]) => GridCell[]) => void;
  mutateGenerator: MutateFn;
  mutateEditor: MutateFn;
  queryClient: QueryClient;
  notifications: { show: (s: string, opts?: Record<string, unknown> | undefined) => void };
  useMockData?: boolean; // Make it optional with default true
}) {
  const handleQueuedGeneration = async (project: EditableProjectProps) => {
    const { category } = project;
    const generationId = `gen-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    if (project.prompt === "") {
        notifications.show("Add more details to the prompt for better results.", {
            severity: "error",
            autoHideDuration: 3000,
        });
        return;
    }

    setGrid((prevGrid: GridCell[]) => {
        const newGrid = [...prevGrid];
        const firstEmptyIndex = newGrid.findIndex((cell) => cell == null);
        if (firstEmptyIndex !== -1) {
            newGrid[firstEmptyIndex] = { loading: true, generationId } as GridCell;
        }

        return newGrid;
    });

    // If using mock data, simulate API call with mock response
    if (useMockData) {
      // Simulate API delay
      setTimeout(() => {
        const mockData = generateMockResponse(project);
        
        setGrid((prevGrid: GridCell[]) => {
          const newGrid = [...prevGrid];
          // Find the loading cell with matching generationId
          const targetIndex = newGrid.findIndex((cell) => 
            cell && 'loading' in cell && cell.generationId === generationId
          );
          
          if (targetIndex !== -1) {
            newGrid[targetIndex] = mapResponseData(mockData);
          }
          return newGrid;
        });

        queryClient.invalidateQueries({ queryKey: ["projects"] });
        
        notifications.show(`Mock ${category === "DESIGN_EDITOR" ? "editing" : "generation"} completed!`, {
          severity: "success",
          autoHideDuration: 3000,
        });
      }, 20000 + Math.random() * 3000); // Random delay between 20-23 seconds to simulate real API

      return;
    }

    // Original API calls (only used when useMockData is false)

    if (category === "DESIGN_EDITOR") {
      mutateEditor(project, {
        onSuccess: (data: ProjectResponseProps) => {
          setGrid((prevGrid: GridCell[]) => {
            const newGrid = [...prevGrid];
            // Find the loading cell with matching generationId
            const targetIndex = newGrid.findIndex((cell) => 
              cell && 'loading' in cell && cell.generationId === generationId
            );
            
            if (targetIndex !== -1) {
              newGrid[targetIndex] = mapResponseData(data);
            }
            return newGrid;
          });

          queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: () => {
          setGrid((prevGrid: GridCell[]) => {
            const newGrid = [...prevGrid];
            // Find the loading cell with matching generationId and remove it
            const targetIndex = newGrid.findIndex((cell) => 
              cell && 'loading' in cell && cell.generationId === generationId
            );
            
            if (targetIndex !== -1) {
              newGrid[targetIndex] = null;
            }
            return newGrid;
          });
        },
      });
    }

    if (category === "DESIGN_GENERATOR") {
      mutateGenerator(project, {
        onSuccess: (data: ProjectResponseProps) => {
          setGrid((prevGrid: GridCell[]) => {
            const newGrid = [...prevGrid];
            // Find the loading cell with matching generationId
            const targetIndex = newGrid.findIndex((cell) => 
              cell && 'loading' in cell && cell.generationId === generationId
            );
            
            if (targetIndex !== -1) {
              newGrid[targetIndex] = mapResponseData(data);
            }
            return newGrid;
          });

          queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: () => {
          setGrid((prevGrid: GridCell[]) => {
            const newGrid = [...prevGrid];
            // Find the loading cell with matching generationId and remove it
            const targetIndex = newGrid.findIndex((cell) => 
              cell && 'loading' in cell && cell.generationId === generationId
            );
            
            if (targetIndex !== -1) {
              newGrid[targetIndex] = null;
            }
            return newGrid;
          });
        },
      });
    }
  };

  return { handleQueuedGeneration };
}
