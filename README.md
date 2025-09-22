# School Administration System (Backend)
A backend service for managing teachers, students, classes and subjects.
<br>
<br>
### Features
- RESTful API with Node.js & Express
- MySQL database with Sequelize ORM
- Dockerized for easy setup
- PhpMyAdmin GUI for managing the database
<br>

### Node.js Version
This project requires **Node.js v12.x.x**<br>
Check your local version with:<br>
<pre>node -v</pre>
<br>

### Setup & Installation
Install dependencies
<pre>npm install</pre>
<br>

### Environment variables
Create a ```.env``` file in the root directory and configure the required variables as listed in ```.env.sample```.
<br>
<br>

### Running the Application Locally
Start the application with all required services (database + external system) via Docker:
<pre>npm start</pre>
Run in watch mode (for development):
<pre>npm run start:dev</pre>
<br>

### Health Check
Verify the application is running:
<pre>GET http://localhost:3000/api/healthcheck</pre>
<br>

### External System Check
Verify the provided external system is running:
<pre>POST http://localhost:5000/students?class=2&offset=1&limit=2</pre>
<br>

### Database
The application uses MySQL 8.0, which runs in a Docker container.<br>
A phpMyAdmin web GUI is also available at:
<pre>http://localhost:8080</pre>
Login using the same database credentials defined in ```.env``` or ```docker-compose.yml```.
<br>
<br>

### Exposed Ports
|Service	| Port |
|---------|------|
|Application |	3000 |
|External System |	5000 |
|MySQL Database |	33306 |
|phpMyAdmin |	8080 |
<br>

### Testing the API
You can test API endpoints using Postman.<br>
A Postman collection is included in the root directory:
<pre>school-administration-system.postman_collection.json</pre>
<br>Import into Postman:<br>
1. Open Postman.<br>
2. Click Import → Upload Files.<br>
3. Select school-administration-system.postman_collection.json.<br>
4. Run the requests against the locally running API ```http://localhost:3000```.<br>
