BEGIN;

CREATE TABLE public.menu_item_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(menu_item_id, name)
);

CREATE TABLE public.menu_item_allergens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(menu_item_id, name)
);

CREATE TABLE public.menu_item_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(menu_item_id, name)
);

-- Apply existing project privilege conventions for menu tables
REVOKE ALL PRIVILEGES ON TABLE 
  public.menu_item_ingredients, 
  public.menu_item_allergens, 
  public.menu_item_tags 
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE 
  public.menu_item_ingredients, 
  public.menu_item_allergens, 
  public.menu_item_tags 
TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE 
  public.menu_item_ingredients, 
  public.menu_item_allergens, 
  public.menu_item_tags 
TO authenticated;

COMMIT;
