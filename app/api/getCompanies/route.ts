import { getCompanyList } from "@/lib/getCompanyList";

export async function GET() {
  const companies = await getCompanyList();
  return new Response(JSON.stringify(companies), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
