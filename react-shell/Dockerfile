# Use full Node 18 (non-alpine)
FROM node:18

WORKDIR /app

COPY package*.json ./

# Clean install deps
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
