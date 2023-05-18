# Installation

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
docker cp db/nidemall_schema.mysql.sql mysql80:/nidemall_schema.mysql.sql
docker cp db/nidemall_table.mysql.sql mysql80:/nidemall_table.mysql.sql
docker cp db/nidemall_data.mysql.sql mysql80:/nidemall_data.mysql.sql
```

Run `mysql` from the container:

```bash
docker exec -it mysql80 mysql -u root -p
```

Execute the SQL files and quit:

```sql
source /nidemall_schema.mysql.sql
source /nidemall_table.mysql.sql
source /nidemall_data.mysql.sql
\quit
```

### SQLite

```bash
mkdir -p runtime/sqlite
sqlite3 runtime/sqlite/nidemall.sqlite '.read db/nidemall_table.sqlite.sql'
sqlite3 runtime/sqlite/nidemall.sqlite '.read db/nidemall_data.sqlite.sql'
```

## Configuration

In `src/common/config/adapter.js`:

```js
exports.model = {
  type: 'mysql', // Change this to switch to SQLite
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
    dateStrings: true
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
