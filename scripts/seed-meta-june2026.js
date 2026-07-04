#!/usr/bin/env node
// 서버에서 실행: node scripts/seed-meta-june2026.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const eq = line.indexOf('=');
  if (eq > 0) {
    const val = line.slice(eq + 1).trim();
    env[line.slice(0, eq).trim()] = val.replace(/^["']|["']$/g, '');
  }
});

// 2026년 6월 메타광고 월별 집계 (파일1+2+3 통합)
// [branch_name, stat_date, impressions, clicks, inquiries, ad_cost]
const META_JUNE = [
  ['목동점', '2026-06-01', 25968, 333, 18, 197408],
  ['철산점', '2026-06-01', 70880, 303, 23, 392625],
  ['개봉점', '2026-06-01',  6032,  54,  4,  92945],
];

async function main() {
  const conn = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    port: Number(env.DB_PORT) || 3306,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });

  const [branches] = await conn.query('SELECT id, name FROM branches');
  const bid = {};
  branches.forEach(b => { bid[b.name] = b.id; });
  console.log('지점 ID:', bid);

  const SQL = `INSERT INTO hq_marketing_stats
    (branch_id, stat_date, channel, impressions, clicks, inquiries, registrations, ad_cost, memo)
    VALUES (?,?,?,?,?,?,0,?,?)`;

  let inserted = 0;
  for (const [branchName, date, impr, clicks, inq, cost] of META_JUNE) {
    const bId = bid[branchName];
    if (!bId) { console.warn(`⚠ 지점 없음: ${branchName}`); continue; }
    await conn.query(SQL, [bId, date, '메타광고', impr, clicks, inq, cost, null]);
    console.log(`✓ ${branchName} 메타광고 ${date}: 노출${impr} 클릭${clicks} 문의${inq} 비용${cost.toLocaleString()}원`);
    inserted++;
  }

  await conn.end();
  console.log(`\n완료: 총 ${inserted}행 삽입`);
}

main().catch(e => { console.error(e); process.exit(1); });
