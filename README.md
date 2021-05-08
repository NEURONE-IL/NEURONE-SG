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

- **NOTE:** A Linux OS machine is recommended for developing and deploying NEURONE-SG.

## Development

- **NOTE:** Running instances of the NEURONE core and NEURONE-GM modules are needed for NEURONE-SG search and gamification features to work correctly. For instructions on how to deploy each one of these projects head to their respective repositories:

    - **NEURONE:** https://github.com/NEURONE-IL/neurone
    - **NEURONE-GM:** pending... (waiting for the project to be available on the NEURONE-IL organization).

- On the development machine, install Node, npm, MongoDB and Angular 10+.
- Clone this repository.
- Go into the Server directory and run the following command:

        $ npm install
    
- On the Server directory run the following command to run NEURONE-SG Server:

        $ npm run dev
    
- Go into the Client directory and run the following command:

        $ npm install

- On the Client directory run the following command to serve the application in development mode:

**NOTE:** The "-c local" parameter is optional, but it will help if you're working on a fully local environment, you can edit this configuration in the environments/environment.local.ts file.

        $ ng serve -c local
    
- NEURONE-SG will be running on http://localhost:4200 and any changes you make on the Client code will be instantly reloaded on your browser.

## Production

- **NOTE:** Running instances of the NEURONE core and NEURONE-GM modules are needed for NEURONE-SG search and gamification features to work correctly. For instructions on how to deploy each one of these projects head to their respective repositories:
    - **NEURONE:** https://github.com/NEURONE-IL/neurone
    - **NEURONE-GM:** pending... (waiting for the project to be available on the NEURONE-IL organization).

- A docker-compose file is provided to easily deploy NEURONE-SG in production mode.
- On the development machine, install Docker and Docker-compose.
- Clone this repository.
- Go into the project directory and create and complete your .env file accordingly.

  **NOTE:** An env-example file is provided in this repository to help you complete your own. This file provides the necessary data for NEURONE-SG to work correctly, this includes external modules endpoints (NEURONE and NEURONE-GM), email service credentials and database information. A description for each of the environment variables of this file are shown below:
  
    | Variable                | Description                                                              |
    |-------------------------|--------------------------------------------------------------------------|
    | `SERVER_ROOT  `         | The complete endpoint in which the Server app will be deployed           |
    | `APP_PORT`              | The port in which the app will be deployed inside the docker container   |
    | `HOST_PORT`             | The port in which the app will be exposed outside the docker container   |
    | `MONGO_USERNAME`        | MongoDB username                                                         |
    | `MONGO_PASSWORD`        | MongoDB password                                                         |
    | `MONGO_PORT`            | MongoDB port                                                             |
    | `MONGO_DB`              | MongoDB database name                                                    |
    | `MONGO_HOSTNAME`        | MongoDB container host name                                              |
    | `NEURONE_URL`           | NEURONE core module endpoint                                             |
    | `NEURONE_DOCS_PATH`     | NEURONE core module downloaded documents path                            |
    | `GM_URL`                | NEURONE-GM Server endpoint                                               |
    | `SENDEMAIL_USER`        | Email address for NEURONE-SG email sending service                       |
    | `SENDEMAIL_PASSWORD`    | Email password for NEURONE-SG email sending service                      |
  
  - On the project directory run the following command:
  
        $ docker-compose up --build -d
        
   **NOTE:** This command will also deploy a MongoDB container so it's not necessary to deploy a database on your own. This container will be exposed in the 27018 port if you need access to it through the Mongo shell or a database Client.
    
  - When the project is done building and deploying it will be live on the machine host and the port specified in the .env file.

## Credits

- Daniel Gacitúa for his original work on the NEURONE core module.
- José Mellado for his work on NEURONE-GM.
- The TUTELAGE project development team (Camila Marquez, José Mellado, Fernando Villarreal) for their work during the development of NEURONE-GAME, the first game-based platform on the NEURONE ecosystem which was a huge inspiration for the NEURONE-SG project.
- The following publications that were crucial during the analysis phase of this project:

    - González‐Ibáñez, R., Gacitúa, D., Sormunen, E., & Kiili, C. (2017). NEURONE: oNlinE inqUiRy experimentatiON systEm. Proceedings of the Association for Information Science and Technology, 54(1), 687-689.
    - Sormunen, E., González-Ibáñez, R., Kiili, C., Leppänen, P. H., Mikkilä-Erdmann, M., Erdmann, N., & Escobar-Macaya, M. (2017, September). A Performance-based Test for Assessing Students’ Online Inquiry Competences in Schools. In European Conference on Information Literacy (pp. 673-682). Springer, Cham.

## License

NEURONE-SG is released under the GNU Affero General Public License Version 3.
