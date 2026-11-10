# ---------- build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# ---------- runtime ----------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# gambar/video/PDF bawaan website untuk seed (node dist/database/seeds/run-seed.js)
COPY --from=build /app/seeds ./seeds
COPY package.json ./
RUN mkdir -p uploads
EXPOSE 4000
# jalankan migrasi database lalu start server
CMD ["sh", "-c", "npm run migration:run:prod && node dist/main"]
