# VXB Neptune Explorer

## Introduction

## Getting Started

### RPC Node
```bash
# install neptune-core
git clone -b explorer https://github.com/VxBlocks/neptune-wallet-core.git
cargo install --path .

# start neptune-core
neptune-core --peer 139.162.193.206:9798 --rest-port 9800
```

### Frontend
```bash
cd frontend
yarn install

copy .env.example to .env.local
# update .env.local

yarn dev

```

### Backend

```bash
cd backend

# build
task build-fetcher
task build-api

# configure .env
copy .env.example to .env

# run docker
docker compose up -d
```

