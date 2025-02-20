# 使用輕量化的 Node.js 來建置 Vue
FROM node:18-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝 npm 套件
RUN npm install

# 複製專案檔案
COPY . .

# 編譯 Vue 應用
RUN npm run build

# 使用 Nginx 作為 Web 伺服器來提供靜態檔案
FROM nginx:alpine

# 複製 Vue 編譯後的檔案到 Nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 Nginx 的 Port 80
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
