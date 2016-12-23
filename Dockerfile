FROM node

# Build app
RUN mkdir -p /usr/src/app  
WORKDIR /usr/src/app  
COPY . /usr/src/app

RUN npm install 
# ENV NODE_ENV production

EXPOSE 2016

CMD [ "node","server.js"]  