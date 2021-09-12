# crud-express-mongodb
    This is an example API CRUD made by expressJS and using MongoDB. 

# install without docker or kubernetes
    1. clone this repository
    2. npm install
    3. npm run migrate:up
    4. npm start

# run in docker
    1. docker build -t zikazama/api-express-mongo:1.0 .
    2. get into terminal container
    3. npm run migrate:up

# run in kubernetes
    1. execute mongo.yaml
    2. excecute express.yaml
    3. get into terminal pod express
    4. npm run migrate:up

# API Documentation (postman)
    https://documenter.getpostman.com/view/13782369/U16kr58N

# User Credential 
    email       : ayiputrink@gmail.com
    password    : 123456

# Admin Credential
    email       : fauzi@gmail.com
    password    : 123456