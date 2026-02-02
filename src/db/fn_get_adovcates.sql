CREATE OR REPLACE FUNCTION fn_get_advocates(
    p_specialty_ids INTEGER[] DEFAULT NULL,
    p_term TEXT DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 10,
    p_sort TEXT DEFAULT 'id',
    p_order TEXT DEFAULT 'asc'
)
RETURNS TABLE (
    id INTEGER,
    "firstName" TEXT,
    "lastName" TEXT,
    city TEXT,
    degree TEXT,
    "yearsOfExperience" INTEGER,
    "phoneNumber" BIGINT,
    specialties TEXT[],
    "totalCount" BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_offset INTEGER;
    v_order_by TEXT;
BEGIN
    v_offset := (p_page - 1) * p_page_size;

    v_order_by := CASE p_sort
        WHEN 'firstName' THEN 'fa."firstName"'
        WHEN 'lastName' THEN 'fa."lastName"'
        WHEN 'city' THEN 'fa.city'
        WHEN 'degree' THEN 'fa.degree'
        WHEN 'yearsOfExperience' THEN 'fa."yearsOfExperience"'
        WHEN 'phoneNumber' THEN 'fa."phoneNumber"'
        ELSE 'fa.id'
    END;

    IF LOWER(p_order) = 'desc' THEN
        v_order_by := v_order_by || ' DESC';
    ELSE
        v_order_by := v_order_by || ' ASC';
    END IF;

    RETURN QUERY EXECUTE format('
        WITH filtered_advocates AS (
            SELECT
                a.id,
                a.first_name AS "firstName",
                a.last_name AS "lastName",
                a.city,
                a.degree,
                a.years_of_experience AS "yearsOfExperience",
                a.phone_number AS "phoneNumber"
            FROM advocates a
            WHERE
                (
                    $1 IS NULL 
                    OR EXISTS (
                        SELECT 1 
                        FROM advocate_specialties adv_spe 
                        WHERE adv_spe.advocate_id = a.id 
                        AND adv_spe.specialty_id = ANY($1)
                    )
                )
                AND (
                    $2 IS NULL
                    OR CONCAT(a.first_name, '' '', a.last_name) ILIKE ''%%'' || $2 || ''%%''
                    OR a.city ILIKE ''%%'' || $2 || ''%%''
                    OR a.degree ILIKE ''%%'' || $2 || ''%%''
                    OR a.years_of_experience::text ILIKE ''%%'' || $2 || ''%%''
                    OR a.phone_number::text ILIKE ''%%'' || $2 || ''%%''
                )
        ),
        advocates_with_specialties AS (
            SELECT
                fa.id,
                fa."firstName",
                fa."lastName",
                fa.city,
                fa.degree,
                fa."yearsOfExperience",
                fa."phoneNumber",
                array_agg(s.name) AS specialties
            FROM filtered_advocates fa
            LEFT JOIN advocate_specialties adv_spe
                ON fa.id = adv_spe.advocate_id
            LEFT JOIN specialties s
                ON adv_spe.specialty_id = s.id
            GROUP BY fa.id, fa."firstName", fa."lastName", fa.city, fa.degree, fa."yearsOfExperience", fa."phoneNumber"
        )
        SELECT
            fa.id,
            fa."firstName",
            fa."lastName",
            fa.city,
            fa.degree,
            fa."yearsOfExperience",
            fa."phoneNumber",
            fa.specialties,
            COUNT(*) OVER() AS "totalCount"
        FROM advocates_with_specialties fa
        ORDER BY %s
        LIMIT $3 OFFSET $4
    ', v_order_by)
    USING p_specialty_ids, p_term, p_page_size, v_offset;
END;
$$;