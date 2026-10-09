export type Task = { id: number; title: string };

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (!response.ok) {
    throw new Error(`Nie udało się wykonać operacji (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  list: () => request<Task[]>("/api/tasks"),
  create: (title: string) =>
    request<Task>("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }),
};
