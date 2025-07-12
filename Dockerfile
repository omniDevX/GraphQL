# Step 1: Use an official Node.js image
FROM node:20

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of the source code
COPY . .

# Step 5: Build the TypeScript code
RUN npm run compile

# Step 6: Expose the port your app runs on
EXPOSE 4000

# Step 7: Command to run the app
CMD ["node", "dist/index.js"]
