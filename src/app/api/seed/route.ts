import { db } from "../../../db";
import {
  advocates,
  specialties,
  advocateSpecialties,
} from "../../../db/schema";
import { advocateData, specialtiesData } from "../../../db/seed/advocates";

const randomSpecialty = (specialtyCount: number) => {
  const random1 = Math.floor(Math.random() * specialtyCount);
  const random2 =
    Math.floor(Math.random() * (specialtyCount - random1)) + random1 + 1;

  return [random1, random2];
};

export async function POST() {
  const specialtiesRecords = await db
    .insert(specialties)
    .values(specialtiesData.map((name) => ({ name })));
  const advocateRecords = await db
    .insert(advocates)
    .values(advocateData)
    .returning();

  const allAdvocates = await db.select({ id: advocates.id }).from(advocates);
  const allSpecialties = await db
    .select({ id: specialties.id })
    .from(specialties);

  const specialtiesCount = allSpecialties.length;

  for (const advocate of allAdvocates) {
    // Use randomSpecialty to pick start/end indices
    const [start, end] = randomSpecialty(specialtiesCount);
    const selectedSpecialties = allSpecialties.slice(start, end);

    // Insert into advocate_specialties
    await db.insert(advocateSpecialties).values(
      selectedSpecialties.map((spec) => ({
        advocateId: advocate.id,
        specialtyId: spec.id,
      }))
    );
  }

  return Response.json({ advocateRecords, specialtiesRecords });
}
