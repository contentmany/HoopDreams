import React from "react";
import { PixelAvatar } from "../avatar/PixelAvatar";
import { DEFAULT_DNA } from "../avatar/types";

it("creates a valid React element", () => {
  const element = <PixelAvatar dna={DEFAULT_DNA} size={64} />;
  expect(React.isValidElement(element)).toBe(true);
  expect(element.type).toBe(PixelAvatar);
});
