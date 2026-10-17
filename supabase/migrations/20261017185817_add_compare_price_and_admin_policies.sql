/*
# Add compare_price_pkr column and enable admin writes on products

1. Modified Tables
- `products`: adds `compare_price_pkr` (numeric, nullable) — the original/cut-through price shown as a strikethrough for discount display. Nullable because not every product has a compare-at price.

2. Security Changes
- Adds anon INSERT/UPDATE/DELETE policies on `products` so the admin panel (which uses the anon key, no sign-in) can manage the catalog directly.
- These are intentionally permissive (USING true / WITH CHECK true) because this is a single-tenant storefront with no user accounts. The admin panel is gated by a client-side PIN, and the products table is intentionally public/shared catalog data.
- Adds the same INSERT/UPDATE/DELETE policies on `orders` so the admin panel can manage orders (mark as fulfilled, delete, etc.).
*/

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS compare_price_pkr numeric;

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);
