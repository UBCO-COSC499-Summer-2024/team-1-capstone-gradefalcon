FROM node:lts

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Bundle app sourcecd
COPY . .

# Command to run the worker
CMD [ "node", "worker.js" ]
