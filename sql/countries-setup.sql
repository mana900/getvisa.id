-- Countries management table
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(50) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    region VARCHAR(50) NOT NULL,
    processing_info TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_countries_country_code ON countries(country_code);
CREATE INDEX idx_countries_region ON countries(region);
CREATE INDEX idx_countries_is_active ON countries(is_active);
CREATE INDEX idx_countries_display_order ON countries(display_order);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Countries are viewable by everyone" ON countries
    FOR SELECT USING (true);

-- Policy for admin write access
CREATE POLICY "Only admins can manage countries" ON countries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Insert initial countries based on current visa types
INSERT INTO countries (country_code, country_name, description, image_url, region, processing_info, display_order) VALUES 
('australia', 'Australia', 'Experience the diverse landscapes of Australia, from the Great Barrier Reef to the Outback. A visa allows travelers to explore vibrant cities like Sydney and Melbourne while enjoying world-class beaches and unique wildlife.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=entropy&auto=format', 'Oceania', 'Processing times vary by visa type. Tourist visas typically processed within 15-25 working days.', 1),
('canada', 'Canada', 'Discover Canada''s stunning natural beauty, from the Rocky Mountains to Niagara Falls. The Canada Tourist Visa allows travelers to explore multicultural cities, pristine wilderness, and experience the warmth of Canadian hospitality.', 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=300&fit=crop&crop=entropy&auto=format', 'North America', 'Tourist visas processed within 15-20 working days. Ensure all documentation is complete for faster processing.', 2),
('china', 'China', 'Explore China''s rich history and modern marvels, from the Great Wall to Shanghai''s skyline. A Chinese visa opens doors to ancient temples, bustling markets, and incredible cuisine across this vast and diverse nation.', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&h=300&fit=crop&crop=entropy&auto=format', 'Asia', 'Single-entry tourist visas typically processed within 4 working days with all required documents.', 3),
('singapore', 'Singapore', 'Experience the perfect blend of tradition and innovation in Singapore. This city-state offers world-class shopping, dining, and attractions, from Marina Bay Sands to the vibrant hawker centers and lush Gardens by the Bay.', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop&crop=entropy&auto=format', 'Asia', 'Tourist visas processed quickly, typically within 1-3 working days for most applicants.', 4),
('uae', 'United Arab Emirates', 'Discover the UAE''s blend of traditional culture and futuristic cities. From Dubai''s towering skyscrapers and luxury shopping to Abu Dhabi''s cultural attractions, the UAE offers unforgettable experiences in the heart of the Middle East.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop&crop=entropy&auto=format', 'Middle East', 'Tourist visas available with quick processing, often approved within 1-2 working days.', 5);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_countries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_countries_updated_at
    BEFORE UPDATE ON countries
    FOR EACH ROW
    EXECUTE FUNCTION update_countries_updated_at();