# nidemall-server

Application created by [ThinkJS](http://www.thinkjs.org)

## Prepare database

### SQLite

```bash
mkdir -p runtime/sqlite
sqlite3 runtime/sqlite/nidemall.sqlite '.read db/nidemall_table.sqlite.sql'
sqlite3 runtime/sqlite/nidemall.sqlite '.read db/nidemall_data.sqlite.sql'
```

## Install dependencies

```bash
yarn install
```

## Start server

```bash
yarn start
```

## Deploy with pm2

Use pm2 to deploy app on production enviroment.

```bash
pm2 startOrReload pm2.json
```
