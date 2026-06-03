# Use an official lightweight Node.js runtime as the base image
FROM node:18-alpine

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency files first to optimize Docker layer caching
COPY package*.json ./

# Install only production dependencies to keep the container tiny
RUN npm install --only=production

# Bundle the rest of your application source code inside the container
COPY . .

# Inform Docker that the container listens on port 5000 at runtime
EXPOSE 5000

# The command to boot up our unified Express server
CMD [ "node", "index.js" ]