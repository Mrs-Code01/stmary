-- Run this in Supabase SQL Editor to clear corrupted teacher records
-- After running this, all class teachers can re-register fresh with correct class assignments

-- First, view what's currently stored so you can verify the bad data:
SELECT id, class_id, email FROM teachers ORDER BY class_id;

-- Then delete all class teacher records (they will re-register with the fixed form):
-- DELETE FROM teachers;

-- OR if you only want to delete specific bad records, use:
-- DELETE FROM teachers WHERE id = 'SMCSTUTOR03';
-- DELETE FROM teachers WHERE class_id = '' OR class_id IS NULL;
