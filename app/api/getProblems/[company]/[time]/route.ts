import { NextRequest } from "next/server";
import { parse } from 'csv-parse/sync';
import { getCompanyList } from "@/lib/getCompanyList";

const ALLOWED_TIMES = [
  "Thirty Days",
  "Three Months",
  "Six Months",
  "More Than Six Months",
  "All"
];
const TIME_TO_FILENAME: Record<string, string> = {
  "Thirty Days": "1. Thirty Days.csv",
  "Three Months": "2. Three Months.csv",
  "Six Months": "3. Six Months.csv",
  "More Than Six Months": "4. More Than Six Months.csv",
  "All": "5. All.csv"
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ company: string; time: string }> }
) {
  const { company, time } = await params;
  const allowedCompanies = await getCompanyList();
  if (!allowedCompanies.includes(company)) {
    return new Response('Invalid company', { status: 400 });
  }
  if (!ALLOWED_TIMES.includes(time)) {
    return new Response('Invalid time', { status: 400 });
  }
  const timeCsv = TIME_TO_FILENAME[time];
  const rawUrl = `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${encodeURIComponent(company)}/${encodeURIComponent(timeCsv)}`;
  const response = await fetch(rawUrl);
  if (!response.ok) {
    return new Response('Failed to fetch data from upstream', { status: 502 });
  }
  const csv = await response.text();
  let records;
  try {
    records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];
  } catch {
    return new Response('Failed to parse CSV', { status: 500 });
  }
  const result = records.map(r => ({
    ...r,
    Topics: (r["Topics"] || "").split(/;|,/).map(s => s.trim()).filter(Boolean)
  }));
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}