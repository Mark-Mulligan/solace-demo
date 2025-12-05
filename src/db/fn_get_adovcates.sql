CREATE OR REPLACE FUNCTION fn_get_advocates(
    p_specialty_id integer DEFAULT NULL,
    p_term text DEFAULT NULL
)
RETURNS TABLE (
    id integer,
    first_name text,
    last_name text,
    city text,
    degree text,
    years_of_experience integer,
    phone_number text,
    specialties text[]
)
LANGUAGE sql
AS $$
SELECT
    a.id,
    a.first_name,
    a.last_name,
    a.city,
    a.degree,
    a.years_of_experience,
    a.phone_number,
    array_agg(s.name) AS specialties
FROM advocates a
LEFT JOIN advocate_specialties adv_spe
    ON a.id = adv_spe.advocate_id
LEFT JOIN specialties s
    ON adv_spe.specialty_id = s.id
WHERE
    (p_specialty_id IS NULL OR adv_spe.specialty_id = p_specialty_id)
    AND
    (
        p_term IS NULL
        OR CONCAT(a.first_name, ' ', a.last_name) ILIKE '%' || p_term || '%'
        OR a.city ILIKE '%' || p_term || '%'
        OR a.degree ILIKE '%' || p_term || '%'
        OR a.years_of_experience::text ILIKE '%' || p_term || '%'
        OR a.phone_number::text ILIKE '%' || p_term || '%'
    )
GROUP BY a.id, a.first_name, a.last_name, a.city, a.degree, a.years_of_experience, a.phone_number
ORDER BY a.id;
$$;