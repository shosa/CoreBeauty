sed -i "s/, 1, NULL)/, true, NULL)/g" C:/xampp/htdocs/mica/corebeauty/supabase/migrations/003_import_mysql_data.sql
sed -i "s/, 0, NULL)/, false, NULL)/g" C:/xampp/htdocs/mica/corebeauty/supabase/migrations/003_import_mysql_data.sql
sed -i "s/, 1, '')/, true, '')/g" C:/xampp/htdocs/mica/corebeauty/supabase/migrations/003_import_mysql_data.sql
sed -i "s/, 0, '')/, false, '')/g" C:/xampp/htdocs/mica/corebeauty/supabase/migrations/003_import_mysql_data.sql
sed -i "s/, 1, '/ , true, '/g" C:/xampp/htdocs/mica/corebeauty/supabase/migrations/003_import_mysql_data.sql
sed -i "s/, 0, '/ , false, '/g" C:/xampp/htdocs/mica/corebeauty/supabase/migrations/003_import_mysql_data.sql
