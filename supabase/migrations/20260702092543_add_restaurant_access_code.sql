BEGIN;

ALTER TABLE public.restaurants 
  ADD COLUMN access_code TEXT;

UPDATE public.restaurants 
  SET access_code = 'DEMO123' 
  WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE public.restaurants 
  SET access_code = substring(id::text, 1, 8) 
  WHERE access_code IS NULL;

ALTER TABLE public.restaurants 
  ALTER COLUMN access_code SET NOT NULL,
  ADD CONSTRAINT unique_restaurant_access_code UNIQUE (access_code);

COMMIT;
