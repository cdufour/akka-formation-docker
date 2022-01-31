// import des dépendances
const express = require("express");
const redis = require("redis");

// instanciation d'un objet express
const app = express();

// instanciation d'un client redis
// host:"redis" => l'adresse IP du container
// redisera résolue par DNS interne
// correspond au nom de service utilisé dans docker-compose.yml
const redis_cli = redis.createClient({
  host:"redis",
  port:6379
})

// routes

// correction de l'exercice 1
app.get("/square/:num", (req, res) => {
	let n = parseInt(req.params.num);
	res.send("Le carré de " + n + " vaut " + n*n);
})


app.get("/visit", (req, res) => {
  
  redis_cli.get("visit", (err, num_visit) => {
    
    if (num_visit) {
     // num_visit ne vaut pas nil/null
     // conversion en int et incrémentation
      num_visit = parseInt(num_visit) + 1; 
    } else {
      // num_visit vaut nil/null 
      num_visit = 1;
    }
   
   // mise à jour de la valeur associée à la clé visit chez redis
   redis_cli.set("visit", num_visit);

   // réponse au client (http)
   res.send("Visites: " + num_visit);
  })
  
})

app.get("/", (req, res) => {
  res.send("coucou");
})

app.listen(3000, () => console.log("Server started"));
