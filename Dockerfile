# 后端服务
FROM node:18-alpine AS backend-builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# 前端构建
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client

COPY client/package.json client/package-lock.json* ./
RUN npm install

COPY client/ ./
RUN npm run build

# 最终镜像
FROM node:18-alpine
WORKDIR /app

# 复制后端依赖
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package.json ./package.json
COPY --from=backend-builder /app/server.js ./server.js
COPY --from=backend-builder /app/src ./src

# 复制前端构建结果
COPY --from=frontend-builder /app/client/build ./client/build

EXPOSE 3000

CMD ["node", "server.js"]
