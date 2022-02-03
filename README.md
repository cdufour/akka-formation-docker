# Formation Docker

_Liste et utilisation des dossiers:_

## apache-docs
Dossier contenant quelques fichiers html. Utilisé en tant que volume à rattacher à un conteneur de serveur web
### Utilisation
```
docker run --rm --name a1 -d -p 8001:80 -v $PWD/apache-docs:/usr/local/apache2/htdocs httpd:latest
curl localhost:8001/demo.html # affiche "bravo"
docker stop a1 # arrête le conteneur, Docker le supprime ensuite automatiquement (option --rm)
```

## exo-cube
Correction de l'exercice 2. Contient l'exécutable **cube** et le Dockerfile permettant de conteneuriser cet exécutable déjà compilé.

### Utilisation
```
cd exo-cube
docker build . -t mycube:0.1
docker run --name c1 mycube:0.1 cube 4 # affiche "64"
docker start -a c1 # affiche "64"
docker rm c1 # supprime le conteneur
```

## first-image
Contient le Dockerfile de notre première image personnalisée.
L'image construite contient l'utilitaire **ping**.
### Utilisation
```
cd first-image
docker build . -t firstimage:0.1
docker run --name f1 -d firstimage:0.1 ping example.com # crée et démarre un conteneur exécutant ping en tâche fond
docker logs f1 # affiche les logs de la commande ping exécutée en boucle infinie
docker stop f1 && docker rm f1 # arrête et supprime le conteneur
```

## myredis
Contient un Dockerfile construisant une image personnalisée d'un serveur redis.
### Utilisation
```
cd myredis
docker build . -t myredis:0.1
docker run --name r1 myredis:0.1
docker exec -it r1 sh # exécute un shell interatif sur le conteneur r1
redis-cli # client redis exécuté dans le contexte du conteneur
exit # sortie du redis-cli
exit # sortie du shell et retour au contexte hôte
docker stop r1 && docker rm r1 # arrête et supprime le conteneur
```

## simpleweb
Application multi-services (multi-conteneurs).
Un serveur http codé en **nodejs** (javascript) communique avec un serveur **redis** afin d'y stoquer un compteur de visites. Chaque requête reçue par le serveur web sur sa route **/visit** provoque l'incrémentation du nombre de visites enregistrées par le serveur redis.
Le dossier contient:
- server.js: fichier source du serveur web nodejs
- package.json: fichier listant les dépendances du serveur web (express, redis)
- Dockerfile: fichier permettant de conteneuriser le serveur web et ses dépendances
- docker-compose.yml: fichier configurant l'application multi-services

### Utilisation
```
cd simpleweb
docker build .t simpleweb:0.1
docker-compose up -d # crée et démarre les deux services en mode détaché ainsi que leur réseau privé
docker-compose ps # affiche l'état des deux services
docker-compose stop web # arrête uniquement le service web
docker-compose start web # démarre uniquement le service web
docker-compose logs # affiche les logs des deux services
docker-compose down # détruit les deux services ainsi que leur réseau privé
```

## simpleweb2
Dans cette version de l'application multi-services **simpleweb**, nous allons associer un volume au service web afin de créer un environnement plus proprice au développement et s'éviter la peine de devoir rebuilder une image à chaque modification apportée au fichier **server.js**.  
Nous commencerons par récupérer les dépendances de l'application (dossier **node_modules**) afin qu'elles ne soient pas perdues lors du montage d'un volume ne contenant pas ces dépendances.  
Ensuite, nous recréerons l'application en associant un volume au service web. Ce volume contiendra les dépendances requises par le fichier **server.js**.
### Utilisation
_Etape 1_
Démarrage des services et copie dans le contexte hôte des dépendances contenues dans le conteneur.
```
cd simpleweb2
docker-compose up -d
docker cp simpleweb2_web_1:/app/node_modules . # copie le dossier node_modules du conteneur dans le dossier courant du contexte hôte
ls # le dossier "node_modules" apparaît dans le dossier courant du contexte hôte
docker-compose down # détruit les services
```

_Etape 2_
Décommenter les lignes commentées du fichier docker-compose.yml afin d'associer un volume au service web, enregistrer le fichier, puis recréer l'application:
```
docker-compose up -d
```
Pour s'entraîner, modifier le fichier server.js, par exemple, en ajoutant ou en modifiant une route. Nul besoin de builder une nouvelle image pour tester les modifications. Redémarrer simplement le service web:
```
docker-compose restart web
```
Tester enfin la route de votre choix en lui adressant une requête http, par exemple:
```
curl localhost:3001/new-route
```

## env-demo
Contient un docker-compose.yml illustrant le principe de transmission de variables d'environnement au conteneur.
Le conteneur mysql dispose de deux variables d'env.
La variable MYSQL_ROOT_PASSWORD, indispensable ici, permet au serveur  mysql de démarrer.

### Utilisation
```
cd env-demo
docker-compose up -d
docker-compose exec db bash
env # affiche les variables d'env présentes dans le conteneur (on retrouve celles définies dans le docker-compose.yml)
mysql -p # exécute un client mysql dans le conteneur - saisir le mot de passe (azerty)
quit # sort du client mysql
exit # sort du bash
docker-compose down
```

### Equivalent en pure ligne de commande Docker
```
docker run --name m1 -d -e MYSQL_ROOT_PASSWORD=azerty mysql:5.7
docker exec -it m1 bash # exécution de bash dans le conteneur
env # affiche les vars d'env présentes dans le conteneur
mysql -p # exécute un client mysql dans le conteneur - saisir le mot de passe (azerty)
quit # sort du client mysql
exit # sort du bash
docker stop m1 && docker rm m1 # arrête et supprime le conteneur
```

## Redémarrage d'un conteneur (restart policy)
Par défaut, un conteneur qui s'arrếte (fin d'exécution, commande stop, problème applicatif, arrêt du démon Docker) ne redémarre pas.  
Il existe [4 politiques de redémarrage](https://docs.docker.com/engine/reference/run/#restart-policies---restart).  
La commande inspect sur un conteneur permet de connaître cette politique. 

## Exemple
```
docker run --name r1 --restart=always -d redis:5-alpine
docker exec -it r1 sh # exécute sh sur le conteneur
kill 1 # tue le pid 1 (redis-server) => le conteneur s'arrête immédiatement
docker ps -a # on constate que r1 a redémarré
```
De la même manière, si l'on arrête la machine hôte du démon Docker et qu'on la redémarre, r1 redémarre automatiquement.

