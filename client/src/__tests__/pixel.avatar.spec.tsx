import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PixelAvatar } from "../pixel/PixelAvatar";
describe("PixelAvatar", () => {
  it("renders a canvas", async () => {
    const { findByLabelText } = render(<PixelAvatar size={64} />);
    const canvas = await findByLabelText("Pixel Avatar");
    expect(canvas).toBeTruthy();
  });
});
