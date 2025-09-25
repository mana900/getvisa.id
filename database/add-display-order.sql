-- Add display_order column to visa_types table
ALTER TABLE visa_types
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Create index for better performance when ordering
CREATE INDEX IF NOT EXISTS visa_types_display_order_idx ON visa_types(display_order);
CREATE INDEX IF NOT EXISTS visa_types_country_display_order_idx ON visa_types(country_code, display_order);

-- Update existing records to have display_order based on creation date
WITH ordered_visas AS (
  SELECT id,
         row_number() OVER (PARTITION BY country_code ORDER BY created_at) as new_order
  FROM visa_types
  WHERE display_order = 0 OR display_order IS NULL
)
UPDATE visa_types
SET display_order = ordered_visas.new_order
FROM ordered_visas
WHERE visa_types.id = ordered_visas.id;