# Use an official Node.js LTS image as the base image
FROM node:14 AS development

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV VITE_APPWRITE_PROJECT_ID='6544d92622a14106af4c'
ENV VITE_APPWRITE_URL='https://cloud.appwrite.io/v1'
ENV VITE_APPWRITE_STORAGE_ID='654e1397653c6c267bcf'
ENV VITE_APPWRITE_DATABASE_ID='654e13bcc8700fb7c217'
ENV VITE_APPWRITE_SAVES_COLLECTION_ID='654e14804ad7735c2e49'
ENV VITE_APPWRITE_USER_COLLECTION_ID='654e143d051b83d03e13'
ENV VITE_APPWRITE_POST_COLLECTION_ID='6560ccdddc1fab93e5a3'

# Set the working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code into the container
COPY . .

# Expose the port on which the app will run
EXPOSE 3000

# Define the command to start the development server
CMD ["npm", "run", "dev"]
