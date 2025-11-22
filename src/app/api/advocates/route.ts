import { db } from "../../../db";
import { advocates } from "../../../db/schema";
import { asc, sql } from "drizzle-orm";
import { Advocate } from "../../../db/schema";

export type AdvocateDataResponse = {
  data: Advocate[];
  start: number;
  end: number;
  currentPage: number;
  totalResults: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const term = `%${search.toLowerCase()}%`;
  const page = Number(searchParams.get("page") ?? "1");

  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const whereClause = sql`
    CONCAT(${advocates.firstName}, ' ',${advocates.lastName}) ILIKE ${
    "%" + term + "%"
  } OR
    ${advocates.city} ILIKE ${"%" + term + "%"} OR
    ${advocates.degree} ILIKE ${"%" + term + "%"} OR
    ${advocates.specialties}::text ILIKE ${"%" + term + "%"} OR
    ${advocates.yearsOfExperience}::text ILIKE ${"%" + term + "%"} OR
    ${advocates.phoneNumber}::text ILIKE ${"%" + term + "%"}
  `;

  const [data, totalResults] = await Promise.all([
    db
      .select()
      .from(advocates)
      .where(whereClause)
      .orderBy(asc(advocates.id))
      .limit(pageSize)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .where(whereClause)
      .then((r) => Number(r[0].count)),
  ]);

  const start = offset + 1;
  const end =
    totalResults <= offset + pageSize ? totalResults : offset + pageSize;

  return Response.json({
    data,
    start,
    end,
    currentPage: page,
    totalResults,
  });
}
