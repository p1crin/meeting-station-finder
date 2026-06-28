import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiResponse } from "./client";
import { apiGet } from "./client";
import { planDuration } from "./plan";
import type { SearchConditions } from "../domain/types";

vi.mock("./client", () => ({ apiGet: vi.fn() }));

const mockGet = vi.mocked(apiGet);
const conditions: SearchConditions = {
  date: "20260628",
  time: "14:00",
  type: "arrival",
};
const req = { from: "feed:A", to: "geo:35.6,139.7", conditions };

function reply<T>(
  status: number,
  data: T | null,
  errorCode: string | null = null,
): ApiResponse<T> {
  return { status, ok: status >= 200 && status < 300, data, errorCode };
}

beforeEach(() => mockGet.mockReset());

describe("planDuration", () => {
  it("selects the journey with the smallest durationSecs", async () => {
    mockGet.mockResolvedValue(
      reply(200, {
        journeys: [
          { durationSecs: 1800, transferCount: 2, fare: { currency: "JPY", ticket: 320, ic: 314 } },
          { durationSecs: 1500, transferCount: 1, fare: { currency: "JPY", ticket: 280, ic: 273 } },
        ],
      }),
    );
    const r = await planDuration(req);
    expect(r).toEqual({ durationSecs: 1500, transferCount: 1, fareIc: 273 });
  });

  it("falls back to the ticket fare when ic is absent", async () => {
    mockGet.mockResolvedValue(
      reply(200, {
        journeys: [{ durationSecs: 900, transferCount: 0, fare: { currency: "JPY", ticket: 200 } }],
      }),
    );
    const r = await planDuration(req);
    expect(r.fareIc).toBe(200);
  });

  it("treats a 422 `samePlace` response as 0 seconds", async () => {
    mockGet.mockResolvedValue(reply(422, null, "samePlace"));
    const r = await planDuration(req);
    expect(r).toEqual({ durationSecs: 0, transferCount: 0, fareIc: 0 });
  });

  it("treats a non-samePlace 422 (e.g. searchWindowTooDense) as no route", async () => {
    mockGet.mockResolvedValue(reply(422, null, "searchWindowTooDense"));
    const r = await planDuration(req);
    expect(r.durationSecs).toBeNull();
  });

  it("returns null on an empty journeys array (no route)", async () => {
    mockGet.mockResolvedValue(reply(200, { journeys: [] }));
    const r = await planDuration(req);
    expect(r.durationSecs).toBeNull();
  });

  it("returns null on a 404", async () => {
    mockGet.mockResolvedValue(reply(404, null));
    const r = await planDuration(req);
    expect(r.durationSecs).toBeNull();
  });
});
