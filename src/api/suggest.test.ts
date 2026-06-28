import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiResponse } from "./client";
import { apiGet } from "./client";
import { isRailStation, suggestStations } from "./suggest";
import type { SuggestStation } from "./transitProvider";

vi.mock("./client", () => ({ apiGet: vi.fn() }));
const mockGet = vi.mocked(apiGet);

function station(p: Partial<SuggestStation> & { id: string }): SuggestStation {
  return {
    name: "x",
    feedId: "f",
    feedName: "rail",
    score: 1,
    weight: 1,
    ...p,
  };
}

const rail = station({ id: "tokyo-keikyu-rail:Keikyu.Airport.HanedaAirportTerminal1and2", feedName: "京浜急行電鉄" });
const odptRail = station({ id: "scrape-jreast-yamanote:odpt.Station:JR-East.Yamanote.Shinjuku", feedName: "山手線" });
const airline = station({ id: "odpt-ana:odpt.Airport:HND", feedName: "odpt.Operator:ANA" });
const busStop = station({ id: "odpt-tokyu-bus-part-07:odpt.BusstopPole:TokyuBus.x", feedName: "odpt.Operator:TokyuBus", kind: "stop" });
const villageBus = station({ id: "jp-nagano-x-kawakamibus:38_01", feedName: "川上村営バス", kind: "stop" });

describe("isRailStation", () => {
  it("keeps rail and ODPT station nodes", () => {
    expect(isRailStation(rail)).toBe(true);
    expect(isRailStation(odptRail)).toBe(true);
  });

  it("drops airline airport nodes and buses", () => {
    expect(isRailStation(airline)).toBe(false);
    expect(isRailStation(busStop)).toBe(false);
    expect(isRailStation(villageBus)).toBe(false);
  });
});

describe("suggestStations", () => {
  beforeEach(() => mockGet.mockReset());

  function reply(stations: SuggestStation[]): ApiResponse<{ stations: SuggestStation[] }> {
    return { status: 200, ok: true, data: { stations }, errorCode: null };
  }

  it("filters out air/bus and returns only rail", async () => {
    mockGet.mockResolvedValue(reply([airline, busStop, rail, odptRail]));
    const result = await suggestStations("羽田空港");
    expect(result.map((s) => s.id)).toEqual([rail.id, odptRail.id]);
  });

  it("returns an empty list for blank input without calling the API", async () => {
    expect(await suggestStations("  ")).toEqual([]);
    expect(mockGet).not.toHaveBeenCalled();
  });
});
