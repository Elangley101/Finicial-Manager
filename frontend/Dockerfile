# Use an official Node.js image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present) to the working directory
COPY package.json /app/
COPY package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . /app/

# Expose the development server port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
