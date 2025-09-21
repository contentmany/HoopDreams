import { describe, it, expect } from "vitest";
import type { HairId } from "../pixel/hairSet";
describe("hair list", ()=>{
  const expected: HairId[] = ["none","dreads_medium","waves_short","buzz"];
  it("has curated styles", ()=>{
    expect(expected).toEqual(["none","dreads_medium","waves_short","buzz"]);
  });
});