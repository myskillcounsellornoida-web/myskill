"use client";

import { Fragment, type ReactNode } from "react";
import { layoutKey, resolveLayout, type PreviewPage } from "@/lib/siteContent";
import { useCms } from "./CmsProvider";

/** Renders a page's sections in the order (and visibility) chosen in the admin editor. */
export default function Arranged({ page, sections }: { page: PreviewPage; sections: Record<string, ReactNode> }) {
  const { content } = useCms();
  const layout = resolveLayout(content[layoutKey(page)], page);
  return (
    <>
      {layout
        .filter((s) => !s.hidden && sections[s.id])
        .map((s) => (
          <Fragment key={s.id}>
            <span data-section={s.id} className="section-anchor" aria-hidden="true" />
            {sections[s.id]}
          </Fragment>
        ))}
    </>
  );
}
