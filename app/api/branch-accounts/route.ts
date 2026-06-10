import { db } from "@/lib/db";

export async function GET() {
  const [rows]: any = await db.query(`
    SELECT *
    FROM branch_accounts
    ORDER BY id DESC
  `);

  return Response.json({
    ok: true,
    items: rows,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.query(
    `
    INSERT INTO branch_accounts
    (
      branch_name,
      service_name,
      account_id,
      account_password,
      login_url,
      memo
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      body.branch_name,
      body.service_name,
      body.account_id,
      body.account_password,
      body.login_url,
      body.memo,
    ]
  );

  return Response.json({ ok: true });
}

export async function PUT(req: Request) {
  const body = await req.json();

  await db.query(
    `
    UPDATE branch_accounts
    SET
      branch_name = ?,
      service_name = ?,
      account_id = ?,
      account_password = ?,
      login_url = ?,
      memo = ?
    WHERE id = ?
    `,
    [
      body.branch_name,
      body.service_name,
      body.account_id,
      body.account_password,
      body.login_url,
      body.memo,
      body.id,
    ]
  );

  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await db.query(
    `
    DELETE FROM branch_accounts
    WHERE id = ?
    `,
    [id]
  );

  return Response.json({ ok: true });
}