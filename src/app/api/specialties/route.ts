// DB
import { db } from "../../../db";
import { Specialty, specialties } from "../../../db/schema";

export type SpecialtyDataResponse = {
  data: Specialty[];
};

export async function GET(request: Request) {
  const data = await db.select().from(specialties).orderBy(specialties.id);

  return Response.json({
    data,
  });
}
