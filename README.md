# NEURONE-SG
<!-- ## Módulo de NEURONE para creación y despliegue de experiencias ludificadas -->
## NEURONE module dedicated to the creation and deployment of gamified experiences

<!-- NEURONE-SG es una plataforma *web* perteneciente al ecosistema NEURONE que permite crear y desplegar experiencias ludificadas. -->
NEURONE-SG is a web platform that provides a gamified experiences creation and deployment environment.

NEURONE-SG is powered by:
- Angular 10
- Node.js
- MongoDB
- NEURONE
- NEURONE-GM

# Instructions
## Development
**NOTE:** It's recommended to use a machine with Linux OS for development.
- In the development machine, install Node, npm, MongoDB and Angular 10+.
- Clone this repository.
- Go into the Server directory and run the following command:

    $ npm install
    
- In the Server directory run the following command to run NEURONE-SG Server:

    $ npm run dev
    
- Go into the Client directory and run the following command:

    $ npm install
    
- In the Client directory run the following command to serve the application in development mode:
**NOTE:** The "-c local" parameter is optional but it will help if you're working on a fully local environment, you can edit this configuration in the environments/environment.local.ts file.

    $ ng serve -c local
    
- NEURONE-SG will be running on http://localhost:4200 and any changes you make on the Client code will be instantly reloaded on your browser.

## Production
- A docker-compose file is provided to easily deploy NEURONE-SG on production mode.
- In the development machine, install Docker and Docker-compose.
- Clone this repository.
- Go into the project directory and create and complete your .env file accordingly.
  **NOTE:** An env-example file is provided in this repository to help you complete your own. This file provides the necessary data for the NEURONE-SG to work correctly, this includes external modules endpoints (NEURONE and NEURONE-GM), email service credentials and database information.
  - In the project directory run the following command:
    $ docker-compose up --build -d
  - When the project is done building and deploying it will be live on the machine host and the port specified in the .env file.

## Credits
- In construction...
