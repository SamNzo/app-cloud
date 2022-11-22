# 1. Builder container

# Starting image
FROM alpine:3.15 as builder

# Workdir in container
WORKDIR /app

# Copy project into container
COPY . ./

# Install node
RUN apk add --update nodejs
RUN apk add --update npm

# Install production dependencies
# ci (continuous integration) is install but with exact same versions from package.json
RUN npm install --only=production

# Copy production dependencies into another file
RUN cp -r /app/node_modules /app/node_modules_production

# Install dependencies
RUN npm install

# Build npm
RUN npm run build

# 2. Runner container

# Starting image
FROM alpine:3.15

# Workdir in container
WORKDIR /app

# Install node
RUN apk add --update nodejs

# Copy files from builder container
COPY --from=builder /app/node_modules_production/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/package*.json ./

# Execution
CMD ["node", "dist/index.js"]