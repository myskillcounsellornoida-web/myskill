import { fetchSiteContent } from "@/app/admin/actions";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  const siteContentRes = await fetchSiteContent();
  let cmsData: Record<string, string> = {};

  if (siteContentRes.success && siteContentRes.data) {
    siteContentRes.data.forEach((item: any) => {
      cmsData[item.key] = item.value;
    });
  }

  return <HomePageClient initialCmsData={cmsData} />;
}
