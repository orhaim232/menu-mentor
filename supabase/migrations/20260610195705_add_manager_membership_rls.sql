BEGIN;

-- 1. Create restaurant_members table
CREATE TABLE public.restaurant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'manager' CHECK (role = 'manager'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, restaurant_id)
);

CREATE INDEX IF NOT EXISTS idx_restaurant_members_restaurant_id ON public.restaurant_members(restaurant_id);

-- 2. RLS and Permissions on restaurant_members
ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.restaurant_members FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.restaurant_members TO authenticated;

CREATE POLICY "Allow members to read their own memberships"
  ON public.restaurant_members
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Note: No SELECT policies are created for restaurants, menu_categories, and menu_items
-- to preserve existing read policies for waiters.

-- 3. restaurants
GRANT UPDATE ON public.restaurants TO authenticated;

CREATE POLICY "Allow managers to update their restaurants"
  ON public.restaurants
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = restaurants.id
      AND rm.role = 'manager'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = restaurants.id
      AND rm.role = 'manager'
    )
  );

-- 4. menu_categories
GRANT INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;

CREATE POLICY "Allow managers to insert menu_categories"
  ON public.menu_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = menu_categories.restaurant_id
      AND rm.role = 'manager'
    )
  );

CREATE POLICY "Allow managers to update menu_categories"
  ON public.menu_categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = menu_categories.restaurant_id
      AND rm.role = 'manager'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = menu_categories.restaurant_id
      AND rm.role = 'manager'
    )
  );

CREATE POLICY "Allow managers to delete menu_categories"
  ON public.menu_categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = menu_categories.restaurant_id
      AND rm.role = 'manager'
    )
  );

-- 5. menu_items
GRANT INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;

CREATE POLICY "Allow managers to insert menu_items"
  ON public.menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = menu_items.restaurant_id
      AND rm.role = 'manager'
    )
  );

CREATE POLICY "Allow managers to update menu_items"
  ON public.menu_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = menu_items.restaurant_id
      AND rm.role = 'manager'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = menu_items.restaurant_id
      AND rm.role = 'manager'
    )
  );

CREATE POLICY "Allow managers to delete menu_items"
  ON public.menu_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.restaurant_members rm
      WHERE rm.user_id = (SELECT auth.uid())
      AND rm.restaurant_id = menu_items.restaurant_id
      AND rm.role = 'manager'
    )
  );

COMMIT;
