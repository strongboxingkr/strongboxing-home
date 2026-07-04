#!/usr/bin/env node
// 서버에서 실행: node scripts/seed-marketing-june2026.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// .env.local 파싱
const envPath = path.join(__dirname, '../.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const eq = line.indexOf('=');
  if (eq > 0) {
    const val = line.slice(eq + 1).trim();
    env[line.slice(0, eq).trim()] = val.replace(/^["']|["']$/g, '');
  }
});

// ── 데이터 ──────────────────────────────────────────────────────────────────

// [stat_date, impressions, clicks, ad_cost]
const NAVER_MOKDONG = [
  ['2026-06-01',660,12,660],['2026-06-02',569,13,715],['2026-06-03',886,9,495],
  ['2026-06-04',1071,8,440],['2026-06-05',860,9,495],['2026-06-06',920,5,275],
  ['2026-06-07',934,16,880],['2026-06-08',794,14,770],['2026-06-09',646,15,825],
  ['2026-06-10',664,9,495],['2026-06-11',664,9,495],['2026-06-12',687,9,495],
  ['2026-06-13',626,17,935],['2026-06-14',680,13,715],['2026-06-15',668,13,715],
  ['2026-06-16',604,9,495],['2026-06-17',607,19,1045],['2026-06-18',556,12,660],
  ['2026-06-19',697,16,880],['2026-06-20',653,9,495],['2026-06-21',718,20,1100],
  ['2026-06-22',608,12,660],['2026-06-23',625,14,770],['2026-06-24',663,14,770],
  ['2026-06-25',736,9,495],['2026-06-26',680,10,550],['2026-06-27',799,10,550],
  ['2026-06-28',849,11,605],['2026-06-29',685,19,1045],['2026-06-30',682,8,440],
];

const NAVER_GAEBONG = [
  ['2026-06-19',488,6,462],['2026-06-20',747,11,869],['2026-06-21',854,18,1404],
  ['2026-06-22',732,12,995],['2026-06-23',817,13,1623],['2026-06-24',845,10,1611],
  ['2026-06-25',701,10,1337],['2026-06-26',456,8,1254],['2026-06-27',340,3,402],
  ['2026-06-29',544,9,1252],['2026-06-30',809,13,2549],
];

const NAVER_CHEOLSAN = [
  ['2026-06-15',364,21,1751],['2026-06-16',740,30,2797],['2026-06-17',738,19,1497],
  ['2026-06-18',701,23,1914],['2026-06-19',763,16,1306],['2026-06-20',373,6,655],
  ['2026-06-23',552,16,1192],['2026-06-24',884,18,1377],['2026-06-25',834,18,1305],
  ['2026-06-26',784,18,1566],['2026-06-27',819,17,1517],['2026-06-28',952,21,1634],
  ['2026-06-29',783,19,1478],['2026-06-30',856,29,2762],
];

// [stat_date, impressions(조회수), clicks(방문고객), registrations(단골수)]
const DAANGN_MOKDONG = [
  ['2026-06-15',2,2,0],['2026-06-16',42,40,0],['2026-06-17',37,36,0],
  ['2026-06-18',35,35,0],['2026-06-19',32,31,0],['2026-06-20',32,32,0],
  ['2026-06-21',44,41,0],['2026-06-22',39,28,1],['2026-06-23',22,21,1],
  ['2026-06-24',28,25,1],['2026-06-25',24,23,1],['2026-06-26',25,20,1],
  ['2026-06-27',3,2,1],['2026-06-28',2,1,1],['2026-06-29',39,28,1],
  ['2026-06-30',72,60,2],
];

const DAANGN_GAEBONG = [
  ['2026-06-18',20,20,0],['2026-06-19',47,46,0],['2026-06-20',52,50,1],
  ['2026-06-21',65,57,2],['2026-06-22',84,69,3],['2026-06-23',93,81,3],
  ['2026-06-24',63,53,3],['2026-06-25',65,56,3],['2026-06-26',62,53,3],
  ['2026-06-27',40,34,3],['2026-06-28',4,4,3],['2026-06-29',73,58,3],
  ['2026-06-30',104,84,4],
];

const DAANGN_CHEOLSAN = [
  ['2026-06-16',39,39,1],['2026-06-17',33,33,1],['2026-06-18',36,36,1],
  ['2026-06-19',31,31,1],['2026-06-20',37,37,1],['2026-06-21',43,42,1],
  ['2026-06-22',36,34,1],['2026-06-23',32,31,2],['2026-06-24',32,30,2],
  ['2026-06-25',36,32,2],['2026-06-26',39,34,2],['2026-06-27',48,39,2],
  ['2026-06-28',41,37,2],['2026-06-29',47,40,2],['2026-06-30',92,78,2],
];

// ── 메인 ────────────────────────────────────────────────────────────────────

async function main() {
  const conn = await mysql.createConnection({
    host: env.DB_HOST || 'localhost',
    port: Number(env.DB_PORT) || 3306,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    charset: 'utf8mb4',
  });

  const [branches] = await conn.query('SELECT id, name FROM branches');
  const bid = {};
  branches.forEach(b => { bid[b.name] = b.id; });
  console.log('지점 ID:', bid);

  const SQL = `INSERT INTO hq_marketing_stats
    (branch_id, stat_date, channel, impressions, clicks, inquiries, registrations, ad_cost, memo)
    VALUES (?,?,?,?,?,0,?,?,?)`;

  let inserted = 0;

  async function insertRows(data, branchName, channel, isNaver) {
    const bId = bid[branchName];
    if (!bId) { console.warn(`⚠ 지점 없음: ${branchName}`); return; }
    for (const row of data) {
      if (isNaver) {
        const [date, impr, clicks, cost] = row;
        await conn.query(SQL, [bId, date, channel, impr, clicks, 0, cost, null]);
      } else {
        const [date, impr, clicks, regs] = row;
        await conn.query(SQL, [bId, date, channel, impr, clicks, regs, 0, null]);
      }
      inserted++;
    }
    console.log(`✓ ${branchName} ${channel}: ${data.length}행`);
  }

  await insertRows(NAVER_MOKDONG,  '목동점', '네이버광고', true);
  await insertRows(NAVER_GAEBONG,  '개봉점', '네이버광고', true);
  await insertRows(NAVER_CHEOLSAN, '철산점', '네이버광고', true);
  await insertRows(DAANGN_MOKDONG,  '목동점', '당근비즈니스', false);
  await insertRows(DAANGN_GAEBONG,  '개봉점', '당근비즈니스', false);
  await insertRows(DAANGN_CHEOLSAN, '철산점', '당근비즈니스', false);

  await conn.end();
  console.log(`\n완료: 총 ${inserted}행 삽입`);
}

main().catch(e => { console.error(e); process.exit(1); });
