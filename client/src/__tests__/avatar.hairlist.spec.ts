import { describe, it, expect } from "vitest";
import { hairSet, type HairId } from "../pixel/hairSets";
describe("hair list", ()=>{
  const expected: HairId[] = Object.keys(hairSet) as HairId[];
  it("has curated styles", ()=>{
    expect(expected).toEqual(["none","dreads_medium","waves_short","buzz"]);
  });
});