-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "testimonials_select_policy" ON testimonials;
CREATE POLICY "testimonials_select_policy" ON testimonials
FOR SELECT USING (true);

-- Create policy for admin access
DROP POLICY IF EXISTS "testimonials_admin_policy" ON testimonials;
CREATE POLICY "testimonials_admin_policy" ON testimonials
FOR ALL USING (true);

-- Create updated_at trigger (if update_updated_at_column function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
        CREATE TRIGGER update_testimonials_updated_at
            BEFORE UPDATE ON testimonials
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert sample testimonials data
INSERT INTO testimonials (name, date, rating, review, is_featured) VALUES
('Jeannie Grant', '2023-06-01', 5, 'A thorough report was done on our financial situation of what insurance covers etc existing. Better deals were found. These were processed on our behalf, which took a lot of stress away. Updates were given as required and outstanding responses chased after.', true),
('Derval Russell', '2023-11-09', 5, 'I have been a client of GetVisa.ID for 8 years now and have always found the advice provided by our consultant excellent. They always take the time to explain things really clearly to me and ensures I understand and am well informed and therefore able to make appropriate decisions.', true),
('Claire Watson', '2023-10-12', 5, 'Claire consistently demonstrates thorough knowledge and understanding of visa requirements and provides excellent customer service. She takes time to explain complex visa processes clearly and makes the entire application stress-free.', true),
('Michael Chen', '2023-09-15', 5, 'Outstanding service from start to finish. GetVisa.ID made my visa application process seamless and stress-free. The team was professional, responsive, and kept me informed throughout the entire process.', true),
('Sarah Johnson', '2023-08-22', 5, 'I was impressed by the efficiency and professionalism of GetVisa.ID. They handled all the paperwork and made sure everything was submitted correctly and on time. Highly recommended for anyone needing visa services.', true),
('Ahmad Rahman', '2023-07-18', 5, 'Exceptional service! The team at GetVisa.ID went above and beyond to ensure my visa application was successful. Their attention to detail and customer service is unmatched.', true),
('Lisa Thompson', '2023-06-25', 5, 'GetVisa.ID saved me so much time and stress. Their expertise in visa requirements is evident, and they made the whole process straightforward. I couldn''t be happier with the service.', true)
ON CONFLICT (id) DO NOTHING;