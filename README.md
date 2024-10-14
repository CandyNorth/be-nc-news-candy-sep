Create two new .env files with environment variables:
.env.development
.env.test

Into the first file add:
PGDATABASE=nc_news

Into the second file add:
PGDATABASE=nc_news_test

Then create a .gitignore with .env.* inside so as to ignore these two new .env files.