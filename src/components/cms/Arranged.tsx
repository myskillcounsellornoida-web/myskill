"use client";

import { Fragment, type ReactNode } from "react";
import { layoutKey, resolveLayout, type PreviewPage } from "@/lib/siteContent";
import { CUSTOM_SECTIONS_KEY, parseCustomSections, sectionKey, sectionsForPage } from "@/lib/customSections";
import { useCms } from "./CmsProvider";
import CustomSectionView from "./CustomSectionView";

/** Renders a page's sections in the order (and visibility) chosen in the admin editor. */
export default function Arranged({ page, sections }: { page: PreviewPage; sections: Record<string, ReactNode> }) {
  const { content } = useCms();
  const custom = sectionsForPage(parseCustomSections(content[CUSTOM_SECTIONS_KEY]), page);
  const all: Record<string, ReactNode> = { ...sections };
  for (const cs of custom) all[sectionKey(cs.id)] = <CustomSectionView section={cs} />;
  const layout = resolveLayout(content[layoutKey(page)], page, custom.map((cs) => sectionKey(cs.id)));
  return (
    <>
      {layout
        .filter((s) => !s.hidden && all[s.id])
        .map((s) => (
          <Fragment key={s.id}>
            <span data-section={s.id} className="section-anchor" aria-hidden="true" />
            {all[s.id]}
          </Fragment>
        ))}
    </>
  );
}
