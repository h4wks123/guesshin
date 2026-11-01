import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Loader from "./Loader";

describe("loading feedback", () => {
  it("exposes a labelled status with a circular indicator", () => {
    const markup = renderToStaticMarkup(
      <Loader label="The character is thinking…" />,
    );

    expect(markup).toContain('role="status"');
    expect(markup).toContain("The character is thinking…");
    expect(markup).toContain('aria-hidden="true"');
  });
});
