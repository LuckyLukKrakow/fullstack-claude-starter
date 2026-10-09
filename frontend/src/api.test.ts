import { afterEach, expect, it, vi } from "vitest";
import { api } from "./api";

afterEach(() => vi.unstubAllGlobals());

it("posts the title as JSON and returns the created task", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(JSON.stringify({ id: 1, title: "Test" }), { status: 201 }),
    );
  vi.stubGlobal("fetch", fetchMock);
  await expect(api.create("Test")).resolves.toEqual({ id: 1, title: "Test" });
  expect(fetchMock).toHaveBeenCalledWith("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test" }),
  });
});

it("reports API errors instead of treating them as success", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
  );
  await expect(api.list()).rejects.toThrow("500");
});
