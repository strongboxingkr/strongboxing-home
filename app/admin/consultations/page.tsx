export const dynamic = "force-dynamic";

import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import ConsultationsClient from "./ConsultationsClient";

export default async function ConsultationsPage() {
  noStore();

  let rows: any[] = [];

  try {
    const [result]: any = await db.query(`
      SELECT *
      FROM consultations
      ORDER BY created_at DESC
    `);

    rows = result;
  } catch {
    rows = [];
  }

  return <ConsultationsClient rows={rows} />;
}