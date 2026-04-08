# Use latest Node.js LTS version
FROM node:lts-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

# Install both production & development dependencies
RUN npm install

# Install nodemon globally to ensure it's available
RUN npm install -g @nestjs/cli

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app files
COPY . .

# Expose the port NestJS will run on
EXPOSE 3000

# Start the app with Nodemon in development mode
CMD ["nodemon", "-L", "--exec", "node", "--require", "ts-node/register", "src/main.ts"]

