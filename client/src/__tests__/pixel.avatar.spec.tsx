import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PixelAvatar } from "../pixel/PixelAvatar";

describe("PixelAvatar", () => {
  it("renders an accessible fallback SVG", () => {
    const { container } = render(<PixelAvatar size={64} />);
    expect(container.innerHTML).toContain('aria-label="Pixel Avatar"');
  });
});
