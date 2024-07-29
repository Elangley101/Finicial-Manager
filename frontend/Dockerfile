# Use the official Node.js image from the Docker Hub
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json file
COPY package.json /app/

# Install the dependencies
RUN npm install

# Copy the project files
COPY . /app/

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
