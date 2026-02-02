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
  const sort = searchParams.get("sort") ?? null;
  const order = searchParams.get("order") ?? null;
  const specialtyId = searchParams.get("specialty") ?? null;

  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const data = await db.execute<{
    id: number;
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    yearsOfExperience: number;
    phoneNumber: string;
    specialties: string[];
    totalCount: number;
  }>(sql`
  SELECT * FROM fn_get_advocates(
    p_specialty_id := ${specialtyId},
    p_term := ${term},
    p_page := ${page},
    p_page_size := ${pageSize},
    p_sort := ${sort},
    p_order := ${order}
  )
`);

  const totalResults = data.length > 0 ? data[0].totalCount : 0;
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
