TICMAS MOVIES

1. Previous steps to start up

a. Create a mysql database
Run: docker-compose up
b. Install dependencies
Run: npm install
c. Initialize database and create its schema
Run: npx sequelize-cli db:migrate

2. Start project
node app.js

3. Tests the app
Use the Postman collection "Movies.app.postman_collection.json"

Notes:
The backend service will run at localhost:3000
