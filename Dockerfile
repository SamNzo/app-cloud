#  1. Builder container

# Starting image
FROM alpine:3.15 as builder

# Workdir in container
WORKDIR /app

# Copy project into container
COPY . ./

# Install node & curl
RUN apk add --update nodejs
RUN apk add --update npm
RUN apk --no-cache add curl

# Install dependencies
RUN npm install

# Build npm
RUN npm run build

# 2. Runner container

# Starting image
FROM alpine:3.15

# Workdir in container
WORKDIR /app

# Install npm
RUN apk add --update nodejs

# Copy from builder
COPY --from=builder /app/node_modules/ ./node_modules
COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/package*.json/ ./

# Execution
CMD ["node", "dist/index.js"]