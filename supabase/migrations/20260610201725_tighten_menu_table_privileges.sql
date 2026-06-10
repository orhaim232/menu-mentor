BEGIN;

-- Remove broad/default privileges from public API roles.
REVOKE ALL PRIVILEGES
ON TABLE
public.restaurants,
public.menu_categories,
public.menu_items,
public.restaurant_members
FROM PUBLIC, anon, authenticated;

-- Waiters / anonymous users: read-only menu access.
GRANT SELECT
ON TABLE
public.restaurants,
public.menu_categories,
public.menu_items
TO anon;

-- Authenticated managers: only the operations required by the existing RLS policies.
GRANT SELECT, UPDATE
ON TABLE public.restaurants
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE
public.menu_categories,
public.menu_items
TO authenticated;

-- Managers may only read their own membership rows through RLS.
GRANT SELECT
ON TABLE public.restaurant_members
TO authenticated;

COMMIT;
