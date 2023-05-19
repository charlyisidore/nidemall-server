# Installation

## Requirements

- [Node.js](https://nodejs.org/) >= 8.0
- [Yarn](https://yarnpkg.com/)
- One of:
  - [MySQL](https://www.mysql.com/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [SQLite](https://sqlite.org/)

## Database

### MySQL with Docker

Pull [Docker image](https://hub.docker.com/r/mysql/mysql-server/):

```bash
docker pull mysql/mysql-server:8.0
```

Start container `mysql80`:

```bash
docker run --name=mysql80 -p 3306:3306 -e MYSQL_ROOT_PASSWORD='88888888' -e MYSQL_USER='nidemall' -e MYSQL_PASSWORD='88888888' -d mysql/mysql-server:8.0
```

Copy SQL files to the container:

```bash
docker cp db/mysql/nidemall_schema.sql mysql80:/nidemall_schema.sql
docker cp db/mysql/nidemall_table.sql mysql80:/nidemall_table.sql
docker cp db/mysql/nidemall_data.sql mysql80:/nidemall_data.sql
```

Run `mysql` from the container:

```bash
docker exec -it mysql80 mysql -u root -p
```

Execute the SQL files and quit:

```sql
source /nidemall_schema.sql
source /nidemall_table.sql
source /nidemall_data.sql
\quit
```

### PostgresSQL with Docker

Pull [Docker image](https://hub.docker.com/_/postgres):

```bash
docker pull postgres:14
```

Start container `postgres14`:

```bash
docker run --name=postgres14 -p 5432:5432 -e POSTGRES_PASSWORD='88888888' -d postgres:14
```

Copy SQL files to the container:

```bash
docker cp db/postgresql/nidemall_schema.sql postgres14:/nidemall_schema.sql
docker cp db/postgresql/nidemall_table.sql postgres14:/nidemall_table.sql
docker cp db/postgresql/nidemall_data.sql postgres14:/nidemall_data.sql
```

Execute the SQL files:

```bash
docker exec -it postgres14 psql -U postgres -f /nidemall_schema.sql
docker exec -it postgres14 psql -U nidemall -d nidemall -f /nidemall_table.sql
docker exec -it postgres14 psql -U nidemall -d nidemall -f /nidemall_data.sql
```

### SQLite

```bash
mkdir -p runtime/sqlite
sqlite3 runtime/sqlite/nidemall.sqlite '.read db/sqlite/nidemall_table.sql'
sqlite3 runtime/sqlite/nidemall.sqlite '.read db/sqlite/nidemall_data.sql'
```

## Configuration

In `src/common/config/adapter.js`:

```js
exports.model = {
  type: 'mysql', // Change this to switch to PostgreSQL or SQLite
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'nidemall',
    prefix: 'nidemall_',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: 3306,
    user: 'nidemall',
    password: '88888888',
    dateStrings: true,
  },
  postgresql: {
    handle: postgresql,
    database: 'nidemall',
    prefix: 'nidemall_',
    host: '127.0.0.1',
    port: 5432,
    user: 'nidemall',
    password: '88888888',
  },
  sqlite: {
    handle: sqlite,
    path: path.join(think.ROOT_PATH, 'runtime/sqlite'),
    database: 'nidemall',
    prefix: 'nidemall_',
  },
};
```

## Server

Install packages:

```bash
yarn install
```

Start server:

```bash
yarn start
```

## Deploy with pm2

Use pm2 to deploy app on production enviroment.

```bash
pm2 startOrReload pm2.json
```
