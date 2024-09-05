FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Step 2: Use a lightweight base image for the production environment
FROM node:18-alpine AS production

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json again
COPY package*.json ./

# Install only production dependencies
RUN npm install --production --frozen-lockfile

# Copy the built application from the previous stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./
COPY --from=base /app/node_modules ./node_modules

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the Next.js application
CMD ["npm", "run", "start"]
