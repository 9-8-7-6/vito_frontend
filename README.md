# Vito Frontend - Bookkeeping UI (Vue 3 + Vite)

**Vito Frontend** is the **user interface** for the **Vito bookkeeping system**, built using **Vue 3** and **Vite**.

It connects to the [Rust-based backend](https://github.com/9-8-7-6/vito.git) and provides a responsive, modern UI for managing accounts, transactions, and balances.

---

## Features

- **Vue 3 Composition API**: Clean and modern frontend architecture  
- **Vite Dev Server**: Fast development and hot module replacement  
- **Docker support**: Run in seconds with `docker-compose`  
- **Environment variables**: Easily configurable via `.env`  

---

## Getting Started

```sh
git clone https://github.com/9-8-7-6/vito_frontend.git
cd vito_frontend
chmod +x ./generate_env.sh
./generate_env.sh
docker compose up -d
