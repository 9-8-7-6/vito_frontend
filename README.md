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

```

## 📌 資料來源與免責聲明

本專案透過前端程式碼擷取以下網站的幣別與參考匯率資料：

> [國泰世華商業銀行 - 外幣匯率看板](https://www.cathaybk.com.tw/cathaybk/personal/product/deposit/currency-billboard/)

- 本資料非官方 API，僅供技術學習與展示用途。
- 所有資料版權與解釋權歸國泰世華商業銀行所有。
- 若您為資料來源擁有者並希望我們停止擷取，請透過 GitHub 聯繫我們，我們會立即配合下架。

## 📌 Data Source & Disclaimer

This project fetches currency reference rates from:

> [Cathay United Bank – Currency Billboard](https://www.cathaybk.com.tw/cathaybk/personal/product/deposit/currency-billboard/)

Currency data (such as USD buy rate) is scraped from publicly visible HTML using frontend logic.

- This is **not** an official API or data feed.
- All rights and copyright of the data belong to **Cathay United Bank Co., Ltd.**
- This project is for **educational and non-commercial purposes** only.
- If you are a representative of the original data provider and wish us to remove or stop referencing your content, please contact us via GitHub and we will comply immediately.
