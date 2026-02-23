SET search_path TO fire_ems, public;

DELETE FROM scottsdale_units;

INSERT INTO scottsdale_units (unit_id)
SELECT DISTINCT apparatus_resource_id
FROM fire_ems.unit_response
WHERE apparatus_resource_id IS NOT NULL
  AND apparatus_resource_id ~ '^(LT|BC|BR|BE|HM|E|L|R|S|U|T)6[0-9]{3}$'
  AND apparatus_resource_id NOT LIKE 'NEDC%'
  AND apparatus_resource_id NOT LIKE 'BT%'
  AND apparatus_resource_id NOT LIKE 'WT%'
  AND apparatus_resource_id NOT LIKE 'MC%';
