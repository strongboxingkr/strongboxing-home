import type { Metadata } from "next";
import BranchPage, { generateMetadata as branchMetadata } from "@/app/branches/[slug]/page";

export const dynamic = "force-dynamic";
export default BranchPage;

export async function generateMetadata(props: Parameters<typeof branchMetadata>[0]): Promise<Metadata> {
  return { ...await branchMetadata(props), robots: { index: false, follow: false } };
}
