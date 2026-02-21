import { buildQueuePositions } from "./orders.utils";

describe("orders.utils", () => {
  it("maps ids to 1-based queue positions", () => {
    const result = buildQueuePositions(["a", "b", "c"]);
    expect(result).toEqual([
      { id: "a", queuePosition: 1 },
      { id: "b", queuePosition: 2 },
      { id: "c", queuePosition: 3 },
    ]);
  });
});
