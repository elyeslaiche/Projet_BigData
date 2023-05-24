# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:20.2 AS build

# Set the working directory
WORKDIR /app

# Add the 'QuizWebsite' directory files
COPY package*.json ./

# Install all the dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:1.17.1-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/quiz-website /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
