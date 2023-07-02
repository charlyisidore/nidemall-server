# Installation

## Requirements

- [Node.js](https://nodejs.org/) >= 8.0
- [Yarn](https://yarnpkg.com/)
- One of:
  - [MySQL](https://www.mysql.com/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [SQLite](https://sqlite.org/)

## Preparation

### Ubuntu

Install [NodeJS](https://github.com/nodesource/distributions):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

Install [Yarn](https://yarnpkg.com/getting-started/install):

```bash
sudo corepack enable
```

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

Install SQLite:

```bash
sudo apt install sqlite3
```

Execute the SQL files:

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
    logger: msg => think.logger.info(msg),
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

In `src/common/config/config.js`:

```js
module.exports = {
  auth: {
    header: 'X-Litemall-Token',
    secret: '$ecretf0rt3st',
    algorithm: 'HS256',
    expiresIn: '2h',
    audience: 'mp',
    issuer: 'nidemall',
    subject: 'nidemall auth token',
  },
  storage: {
    type: 'local',
    local: {
      path: 'www/static/upload',
      baseUrl: 'http://127.0.0.1:8360/static/upload/',
    },
  },
  system: {
    prefix: 'litemall_',
  },
  weixin: {
    appid: 'wx8888888888888888',
    secret: '$ecretf0rt3st',
    mchId: '1900000109',
    mchKey: '$ecretf0rt3st',
    notifyUrl: 'http://127.0.0.1:8360/wx/order/pay-notify',
  },
  express: {
    enable: true,
    appid: '',
    appkey: '',
    url: 'http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx',
    vendors: [],
  },
  mocks: false,
};
```

In `src/common/config/middleware.js`:

```js
module.exports = [
  // ...
  {
    handle: 'resource',
    enable: isDev, // See https://thinkjs.org/en/doc/3.0/deploy.html
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/,
    },
  },
  // ...
];
```

## Server

Install packages:

```bash
yarn install
```

Start server:

```bash
yarn run start
```

## Deployment

Install `pm2`:

```bash
npm install -g pm2
```

Start:

```bash
pm2 start pm2.json
```

Restart with interruption:

```bash
pm2 restart pm2.json
```

Restart without interruption:

```bash
pm2 sendSignal SIGUSR2 pm2.json
```

Documentation:

- [ThinkJS - Production Deployment](https://thinkjs.org/en/doc/3.0/deploy.html)
- [PM2 - Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/)
