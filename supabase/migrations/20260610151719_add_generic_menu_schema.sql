
BEGIN;

-- 1. Create menu categories table
CREATE TABLE public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL
    REFERENCES public.restaurants(id)
    ON DELETE CASCADE,

  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE
    NOT NULL DEFAULT timezone('utc'::text, now()),

  updated_at TIMESTAMP WITH TIME ZONE
    NOT NULL DEFAULT timezone('utc'::text, now()),

  CONSTRAINT unique_category_name_per_restaurant
    UNIQUE (restaurant_id, name),

  CONSTRAINT unique_category_restaurant_pair
    UNIQUE (id, restaurant_id)
);

CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id
  ON public.menu_categories(restaurant_id);


-- 2. Update restaurants table
ALTER TABLE public.restaurants
  ADD COLUMN menu_version INTEGER
    NOT NULL DEFAULT 1
    CHECK (menu_version >= 1),

  ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE
    NOT NULL DEFAULT timezone('utc'::text, now());


-- 3. Update menu_items table
-- updated_at already exists, so it is not added again.
ALTER TABLE public.menu_items
  ADD COLUMN category_id UUID,

  ADD COLUMN service_notes TEXT[]
    NOT NULL DEFAULT '{}',

  ADD COLUMN modification_rules TEXT[]
    NOT NULL DEFAULT '{}',

  ADD COLUMN custom_attributes JSONB
    NOT NULL DEFAULT '{}'::jsonb,

  ADD COLUMN image_url TEXT,

  ADD COLUMN image_source TEXT,

  ADD COLUMN is_active BOOLEAN
    NOT NULL DEFAULT true,

  ADD COLUMN include_in_memory_game BOOLEAN
    NOT NULL DEFAULT true;


CREATE INDEX IF NOT EXISTS idx_menu_items_category_id
  ON public.menu_items(category_id);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id
  ON public.menu_items(restaurant_id);


-- 4. Add menu_items constraints
ALTER TABLE public.menu_items
  ADD CONSTRAINT check_custom_attributes_is_object
    CHECK (
      jsonb_typeof(custom_attributes) = 'object'
    ),

  ADD CONSTRAINT check_image_source_and_url
    CHECK (
      (
        image_url IS NULL
        AND image_source IS NULL
      )
      OR
      (
        image_url IS NOT NULL
        AND image_source IS NOT NULL
        AND image_source IN (
          'uploaded',
          'ai-illustration'
        )
      )
    ),

  ADD CONSTRAINT fk_menu_items_category_restaurant
    FOREIGN KEY (
      category_id,
      restaurant_id
    )
    REFERENCES public.menu_categories (
      id,
      restaurant_id
    )
    ON DELETE RESTRICT;


-- 5. Shared updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;


-- restaurants updated_at trigger
DROP TRIGGER IF EXISTS update_restaurants_updated_at
  ON public.restaurants;

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();


-- menu_categories updated_at trigger
DROP TRIGGER IF EXISTS update_menu_categories_updated_at
  ON public.menu_categories;

CREATE TRIGGER update_menu_categories_updated_at
  BEFORE UPDATE ON public.menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();


-- menu_items updated_at trigger
-- The column already exists, but the trigger is created here.
DROP TRIGGER IF EXISTS update_menu_items_updated_at
  ON public.menu_items;

CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();


-- 6. RLS and read permissions for menu_categories
ALTER TABLE public.menu_categories
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read menu_categories"
  ON public.menu_categories
  FOR SELECT
  USING (true);

GRANT SELECT
  ON public.menu_categories
  TO anon, authenticated;

REVOKE INSERT, UPDATE, DELETE
  ON public.menu_categories
  FROM anon, authenticated;

COMMIT;

