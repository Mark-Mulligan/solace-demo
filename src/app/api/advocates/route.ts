// Third Party
import { asc, desc, sql } from "drizzle-orm";

// DB
import { db } from "../../../db";
import { advocates, Advocate } from "../../../db/schema";

export type AdvocateDataResponse = {
  data: Advocate[];
  start: number;
  end: number;
  currentPage: number;
  totalResults: number;
};

const validSortColumns = [
  "firstName",
  "lastName",
  "city",
  "yearsOfExperience",
] as const;
export type SortableColumns = (typeof validSortColumns)[number];

const createSorting = (sort: string, order: string) => {
  let sorting = asc(advocates.id);

  if (validSortColumns.includes(sort as SortableColumns)) {
    const column = advocates[sort as SortableColumns];

    if (order === "asc") {
      sorting = asc(column);
    } else if (order === "desc") {
      sorting = desc(column);
    }
  }

  return sorting;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const term = `%${search.toLowerCase()}%`;
  const page = Number(searchParams.get("page") ?? "1");
  const sort = searchParams.get("sort") ?? "";
  const order = searchParams.get("order") ?? "";

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

  const sorting = createSorting(sort, order);

  const [data, totalResults] = await Promise.all([
    db
      .select()
      .from(advocates)
      .where(whereClause)
      .orderBy(sorting)
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
