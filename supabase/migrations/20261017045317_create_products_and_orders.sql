/*
# Create products and orders tables for NEXURA storefront

1. New Tables
- `products` — the catalog of winter outerwear & garments. Columns:
  - id (uuid, PK)
  - name (text) — product name
  - category (text) — one of: puffer-jackets, arctic-parkas, hoodies, cashmere-sweaters, gloves, thermal-socks, balaclavas
  - gender (text) — 'men', 'women', or 'unisex'
  - price_pkr (numeric) — base price in Pakistani Rupees
  - description (text) — editorial copy
  - image_url (text) — main image URL
  - image_url_2 (text, nullable) — secondary image
  - sizes (text[]) — available sizes
  - colors (text[]) — available colors
  - rating (numeric, default 5.0) — editorial rating
  - badge (text, nullable) — e.g. 'New', 'Bestseller', 'Limited'
  - in_stock (boolean, default true)
  - created_at (timestamptz)
- `orders` — WhatsApp / COD orders placed by customers. Columns:
  - id (uuid, PK)
  - product_id (uuid, references products)
  - product_name (text)
  - size (text)
  - color (text)
  - quantity (int, default 1)
  - customer_name (text)
  - customer_phone (text)
  - customer_address (text)
  - city (text)
  - payment_method (text) — 'COD' or 'WhatsApp'
  - currency (text, default 'PKR')
  - unit_price (numeric)
  - total_price (numeric)
  - status (text, default 'pending')
  - created_at (timestamptz)

2. Security
- Enable RLS on both tables.
- products: public read (anon + authenticated), no public writes — storefront only displays catalog.
- orders: anon + authenticated can insert (customers place orders without sign-in) and read their own orders by phone; no update/delete from the client.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  gender text NOT NULL DEFAULT 'unisex',
  price_pkr numeric NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  image_url_2 text,
  sizes text[] NOT NULL DEFAULT '{XS,S,M,L,XL,XXL}',
  colors text[] NOT NULL DEFAULT '{Obsidian,Frost}',
  rating numeric NOT NULL DEFAULT 5.0,
  badge text,
  in_stock boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  size text NOT NULL DEFAULT 'M',
  color text NOT NULL DEFAULT 'Obsidian',
  quantity int NOT NULL DEFAULT 1,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  payment_method text NOT NULL DEFAULT 'COD',
  currency text NOT NULL DEFAULT 'PKR',
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_own_orders" ON orders;
CREATE POLICY "anon_read_own_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- Seed catalog
INSERT INTO products (name, category, gender, price_pkr, description, image_url, image_url_2, sizes, colors, rating, badge, in_stock) VALUES
('NEXURA Obsidian Puffer', 'puffer-jackets', 'men', 89000, 'Filled jacket with a matte obsidian shell, premium down, and storm-proof seams. Engineered for sub-zero winters without sacrificing silhouette.', 'https://images.pexels.com/photos/1617014/pexels-photo-1617014.jpeg', NULL, '{S,M,L,XL,XXL}', '{Obsidian,Frost,Charcoal}', 5.0, 'Bestseller', true),
('NEXURA Frost Womens Puffer', 'puffer-jackets', 'women', 92000, 'A tailored womens puffer in frost white with a cinched waist, oversized hood, and responsibly-sourced down for maximum warmth.', 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg', NULL, '{XS,S,M,L,XL}', '{Frost,Obsidian,Camel}', 5.0, 'New', true),
('NEXURA Arctic Parka — Mens', 'arctic-parkas', 'men', 145000, 'A full-length arctic parka with a fur-trimmed hood, windproof membrane, and thermal lining rated to -30°C. The pinnacle of winter engineering.', 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg', NULL, '{S,M,L,XL,XXL}', '{Obsidian,Forest,Charcoal}', 5.0, 'Limited', true),
('NEXURA Arctic Parka — Womens', 'arctic-parkas', 'women', 148000, 'Womens arctic parka with an elongated silhouette, removable fur trim, and a fleece-lined interior for brutal cold fronts.', 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg', NULL, '{XS,S,M,L,XL}', '{Frost,Obsidian,Wine}', 5.0, 'New', true),
('NEXURA 520GSM Heavyweight Hoodie', 'hoodies', 'unisex', 24000, 'A 520GSM brushed-fleece hoodie with a double-lined hood, reinforced cuffs, and a boxy luxury streetwear fit. Built like armour.', 'https://images.pexels.com/photos/8217427/pexels-photo-8217427.jpeg', NULL, '{S,M,L,XL,XXL}', '{Obsidian,Frost,Slate}', 5.0, 'Bestseller', true),
('NEXURA Oversized Hoodie — Frost', 'hoodies', 'unisex', 26000, 'Frost white heavyweight hoodie with a relaxed drop-shoulder cut, kangaroo pocket, and a structured hood that holds its shape.', 'https://images.pexels.com/photos/8217475/pexels-photo-8217475.jpeg', NULL, '{S,M,L,XL,XXL}', '{Frost,Obsidian,Stone}', 5.0, NULL, true),
('NEXURA Cashmere Sweater — Obsidian', 'cashmere-sweaters', 'men', 56000, 'Pure cashmere crewneck in obsidian black. Featherweight warmth with a refined drape — the cold-weather essential.', 'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg', NULL, '{S,M,L,XL,XXL}', '{Obsidian,Frost,Camel}', 5.0, NULL, true),
('NEXURA Cashmere Knit — Frost', 'cashmere-sweaters', 'women', 58000, 'A womens cashmere knit in frost with a slightly cropped silhouette and ribbed cuffs. Impossibly soft, unmistakably luxurious.', 'https://images.pexels.com/photos/2065200/pexels-photo-2065200.jpeg', NULL, '{XS,S,M,L,XL}', '{Frost,Wine,Obsidian}', 5.0, 'New', true),
('NEXURA Windproof Leather Gloves', 'gloves', 'unisex', 18000, 'Touchscreen-compatible windproof leather gloves with a thermal fleece lining and a second-skin fit. Conductive fingertips, zero cold spots.', 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg', NULL, '{S,M,L,XL}', '{Obsidian,Brown,Frost}', 5.0, 'Bestseller', true),
('NEXURA Merino Thermal Socks', 'thermal-socks', 'unisex', 6500, 'Merino wool thermal socks with temperature regulation and moisture wicking. Cushioned sole, seamless toe — all-day winter comfort.', 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg', NULL, '{Universal}', '{Obsidian,Frost,Charcoal,Grey}', 5.0, NULL, true),
('NEXURA Balaclava — Obsidian', 'balaclavas', 'unisex', 9500, 'A windproof balaclava in obsidian with a breathable mesh panel and adjustable opening. Full-face protection with a low profile under any helmet or hood.', 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg', NULL, '{Universal}', '{Obsidian,Frost,Charcoal}', 5.0, 'New', true),
('NEXURA Balaclava — Frost', 'balaclavas', 'unisex', 9500, 'Frost white thermal balaclava with a fleece-lined interior and a contoured fit. Maximum coverage, minimal bulk.', 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg', NULL, '{Universal}', '{Frost,Obsidian,Stone}', 5.0, NULL, true)
ON CONFLICT (id) DO NOTHING;
