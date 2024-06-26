# Installation

## Requirements

- [Node.js](https://nodejs.org/) >= 16.0
- [Yarn](https://yarnpkg.com/)
- One of:
  - [MySQL](https://www.mysql.com/)
  - [PostgreSQL](https://www.postgresql.org/)
  - [SQLite](https://sqlite.org/)

## Preparation

### Ubuntu

Install [NodeJS](https://github.com/nodesource/distributions):

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt install -y nodejs
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

### MariaDB with Docker

Pull [Docker image](https://hub.docker.com/_/mariadb):

```bash
docker pull mariadb:10.11
```

Start container `mariadb10`:

```bash
docker run --name=mariadb10 -p 3306:3306 -e MYSQL_ROOT_PASSWORD='88888888' -e MYSQL_USER='nidemall' -e MYSQL_PASSWORD='88888888' -d docker.io/library/mariadb:10.11
```

Copy SQL files to the container:

```bash
docker cp db/mariadb/nidemall_schema.sql mariadb10:/nidemall_schema.sql
docker cp db/mysql/nidemall_table.sql mariadb10:/nidemall_table.sql
docker cp db/mysql/nidemall_data.sql mariadb10:/nidemall_data.sql
```

Run `mariadb` from the container:

```bash
docker exec -it mariadb10 mariadb -u root -p
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
sudo apt install -y sqlite3
```

Execute the SQL files:

```bash
mkdir -p runtime
rm -f runtime/nidemall.sqlite
sqlite3 runtime/nidemall.sqlite '.read db/sqlite/nidemall_table.sql'
sqlite3 runtime/nidemall.sqlite '.read db/sqlite/nidemall_data.sql'
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
    path: path.join(think.ROOT_PATH, 'runtime'),
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

Install [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/):

```bash
sudo npm install -g pm2
```

Install [NGINX](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/):

```bash
sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" | sudo tee /etc/apt/preferences.d/99nginx
sudo apt update
sudo apt install -y nginx
```

Install Let's Encrypt client:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Edit `nginx.conf`:

```
server {
    listen 80;
    server_name example.com;
    root /home/ubuntu/nidemall-server;
    set $node_port 8360;

    # ...
}
```

Edit `/etc/nginx/nginx.conf`:

```
user ubuntu
# ...
```

Copy NGINX configuration:

```bash
sudo cp nginx.conf /etc/nginx/conf.d/nidemall-server.conf
```

Get Let's Encrypt certificate:

```bash
sudo certbot --nginx -d example.com
```

New NGINX configuration in `/etc/nginx/conf.d/nidemall-server.conf` should look like this:

```
server {
    # ...

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

Optional: Add the following to `/etc/nginx/conf.d/nidemall-server.conf` to redirect HTTP to HTTPS:

```
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

Open `crontab` to automatically renew Let's Encrypt certificates:

```bash
crontab -e
```

Add and save:

```
0 12 * * * /usr/bin/certbot renew --quiet
```

Optional: Configure CORS in `/etc/nginx/conf.d/nidemall-server.conf`:

```
server {
    # ...

    location / {
        add_header 'Access-Control-Allow-Origin' 'https://admin.example.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,X-Litemall-Admin-Token' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;

        if ($request_method = 'OPTIONS') {
            return 204;
        }

        # ...
    }
}
```

Start NGINX:

```bash
sudo nginx
```

Reload NGINX configuration:

```bash
sudo nginx -t && sudo nginx -s reload
```

Start PM2:

```bash
pm2 start pm2.json
```

Restart PM2 with interruption:

```bash
pm2 restart pm2.json
```

Restart PM2 without interruption:

```bash
pm2 sendSignal SIGUSR2 pm2.json
```

Optional: Configure the firewall.

Setup UFW rules:

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 9527
sudo ufw deny 8360
```

Check UFW status:

```bash
sudo ufw status
```

If inactive, run:

```bash
sudo ufw enable
```

Documentation:

- [ThinkJS - Production Deployment](https://thinkjs.org/en/doc/3.0/deploy.html)
- [PM2 - Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [NGINX - Documentation](https://docs.nginx.com/)
