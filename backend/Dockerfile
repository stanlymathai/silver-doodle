FROM node:16

#Environment
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

#app
ARG PORT
ENV PORT ${PORT}

ARG ENDPOINT_API
ENV ENDPOINT_API ${ENDPOINT_API}

#DB config
ARG DB_name
ENV DB_name ${DB_name}

ARG DB_username
ENV DB_username ${DB_username}

ARG DB_password
ENV DB_password ${DB_password}

ARG DB_hostname
ENV DB_hostname ${DB_hostname}

#Passport config - 256-bit key
ARG REFRESH_TOKEN_KEY
ENV REFRESH_TOKEN_KEY ${REFRESH_TOKEN_KEY}

ARG AUTHENTICATION_KEY
ENV AUTHENTICATION_KEY ${AUTHENTICATION_KEY}

#cms strapi endpoint
ARG CMS_ARTICLE_API
ENV CMS_ARTICLE_API ${CMS_ARTICLE_API}


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ["package.json", "package-lock.json", "./"]

RUN npm install --verbose
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "node", "bin/www" ]