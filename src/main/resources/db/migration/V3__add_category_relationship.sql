-- V3: Migrate transactions.category string to category_id foreign key (idempotent)

BEGIN;

-- Create default global category 'Uncategorized' if not exists
INSERT INTO categories (name, user_id)
SELECT 'Uncategorized', NULL
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Uncategorized' AND user_id IS NULL);

-- Drop existing constraint if it exists
ALTER TABLE categories DROP CONSTRAINT IF EXISTS uq_category_user;

-- Add unique constraint on categories (name, user_id) to prevent duplicates
ALTER TABLE categories ADD CONSTRAINT uq_category_user UNIQUE (name, user_id);

-- Add category_id column to transactions if not exists
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category_id BIGINT;

-- Set default category_id for existing transactions to 'Uncategorized' (only for those without category_id set)
UPDATE transactions
SET category_id = (SELECT id FROM categories WHERE name = 'Uncategorized' AND user_id IS NULL LIMIT 1)
WHERE category_id IS NULL;

-- Insert user-specific categories from existing transaction category strings (only if category string exists and no category)
INSERT INTO categories (name, user_id)
SELECT DISTINCT t.category, t.user_id
FROM transactions t
WHERE t.category IS NOT NULL AND t.category <> '' AND t.category_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM categories c WHERE c.name = t.category AND c.user_id = t.user_id);

-- Update transactions to link to the newly created or existing category (only where string category still exists)
UPDATE transactions t
SET category_id = c.id
FROM categories c
WHERE c.name = t.category AND c.user_id = t.user_id AND t.category_id IS NULL;

-- Drop the old category string column (check if it exists to avoid error)
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'category') THEN
      ALTER TABLE transactions DROP COLUMN category;
   END IF;
END $$;

-- Drop existing foreign key if it exists
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS fk_transactions_category;

-- Add foreign key constraint (optional: ON DELETE SET NULL to allow category deletion without losing transactions)
ALTER TABLE transactions
ADD CONSTRAINT fk_transactions_category
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Add index on category_id for performance
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);

COMMIT;
