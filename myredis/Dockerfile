FROM alpine:3.12

# mise à jour des sources d'apk (gestionnaire de packages)
RUN apk update

# installation de redis
RUN apk add redis

# méta-donnée indiquant le port tcp ouvert dans le conteneur
# port redis standard: 6379
EXPOSE 6379

# commande de démarrage
CMD ["redis-server"]
