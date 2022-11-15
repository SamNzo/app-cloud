# Starting image
FROM alpine:3.15

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

# Execution
CMD ["npm", "run", "watch"]