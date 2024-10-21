
# Northcoders News API

### Hello!
Happy to have you here at the Northcoders News API! This project is a RESTful API service that provides data for a news application. It handles articles, comments, topics, and user information. My project is built with Node.js and Express, using PostgreSQL as the database.

If you want to use this project just copy the url from the github page (where you found this README) and clone it into a folder using git clone!

Here is the live version: [Northcoders News API](https://be-nc-news-candy-sep.onrender.com/)

## Lets Start

Make sure you have Node.js (v14.0.0 or later) and PostgreSQL (v12.0 or later) installed, but earlier versions might still work.

## For installation...

1. Clone the repo:
   ```
   git clone https://github.com/your-username/be-nc-news.git
   cd be-nc-news
   ```

2. And Install the dependencies:
   ```
   npm install --save-dev
   ```
  Make sure you're audit-fixing those vulnerabilities, as you don't want any hackers muscling in.

  ``
  npm audit fix
  ``

  If that doesn't work, then a nice little force on the end will work:

  ``
  npm audit fix --force
  ``


### Then lets set up the environment

Create two files:

1. `.env.development`
2. `.env.test`

Add the following to each file:

For `.env.development`:
```
PGDATABASE=nc_news
```

For `.env.test`:
```
PGDATABASE=nc_news_test
```
When using newer versions of Ubuntu you might need to include the database URL, for example:

For `.env.test`:
```
PGDATABASE=nc_news_test
DATABASE_URL=postgres://postgres:DATABASE_PASSWORD_HERE@localhost:5432/nc_news_test
```
Replace 'DATABASE_PASSWORD_HERE' with the password for the database, which you set up in PSQL.

Please take note: Add `.env.*` to your `.gitignore` to keep these files private.

### And set up our database

We need to seed  and make sure its all set up for your local database:

```
npm run setup-dbs
npm run seed
```

### To run the tests...
```
npm test
```
## Happy coding you legend :)
