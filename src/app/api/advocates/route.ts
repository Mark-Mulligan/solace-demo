// Third Party
import { asc, desc, sql } from "drizzle-orm";

// DB
import { db } from "../../../db";
import {
  advocates,
  Advocate,
  specialties,
  advocateSpecialties,
} from "../../../db/schema";

type AdvocateWithSpecialties = Advocate & {
  specialties: string[];
};

export type AdvocateDataResponse = {
  data: AdvocateWithSpecialties[];
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
  const specialty = searchParams.get("specialty") ?? "";

  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const baseSearch = sql`
  CONCAT(${advocates.firstName}, ' ', ${advocates.lastName}) ILIKE ${
    "%" + term + "%"
  } OR
  ${advocates.city} ILIKE ${"%" + term + "%"} OR
  ${advocates.degree} ILIKE ${"%" + term + "%"} OR
  ${advocates.yearsOfExperience}::text ILIKE ${"%" + term + "%"} OR
  ${advocates.phoneNumber}::text ILIKE ${"%" + term + "%"}
`;

  const whereClause = specialty
    ? sql`(${baseSearch}) AND (${advocateSpecialties.specialtyId} = ${Number(
        specialty
      )})`
    : sql`(${baseSearch})`;

  const sorting = createSorting(sort, order);

  const query1 = db
    .select({
      id: advocates.id,
      firstName: advocates.firstName,
      lastName: advocates.lastName,
      city: advocates.city,
      degree: advocates.degree,
      yearsOfExperience: advocates.yearsOfExperience,
      phoneNumber: advocates.phoneNumber,
      specialties: sql<string>`array_agg(${specialties.name})`,
    })
    .from(advocates)
    .leftJoin(
      advocateSpecialties,
      () => sql`${advocateSpecialties.advocateId} = ${advocates.id}`
    )
    .leftJoin(
      specialties,
      () => sql`${specialties.id} = ${advocateSpecialties.specialtyId}`
    )
    .where(whereClause)
    .groupBy(
      advocates.id,
      advocates.firstName,
      advocates.lastName,
      advocates.city,
      advocates.degree,
      advocates.yearsOfExperience,
      advocates.phoneNumber
    )
    .orderBy(sorting)
    .limit(pageSize)
    .offset(offset);

  const query2 = db
    .select({ count: sql<number>`COUNT(DISTINCT ${advocates.id})` })
    .from(advocates)
    .leftJoin(
      advocateSpecialties,
      () => sql`${advocateSpecialties.advocateId} = ${advocates.id}`
    )
    .leftJoin(
      specialties,
      () => sql`${specialties.id} = ${advocateSpecialties.specialtyId}`
    )
    .where(whereClause)
    .then((r) => Number(r[0].count));

  const [data, totalResults] = await Promise.all([query1, query2]);
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
