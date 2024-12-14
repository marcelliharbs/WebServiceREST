import express from "express";
import filmes from "./src/controllers/filmes.js";
import user from "./src/controllers/user.js";
import avaliacao from "./src/controllers/avaliacao.js";

const routes = express.Router();

//Chama os métodos do CRUD de filmes 
routes.get("/filmes", filmes.findAll);
routes.get("/filmes/:id", filmes.findFilme);
//selects extra
routes.get("/filmes/genero/:genero", filmes.findByGenero);
routes.get("/filmes/distribuidora/:distribuidora", filmes.findByDistribuidora);
//
routes.post("/filmes", user.verifyJWT, filmes.addFilme);
routes.put("/filmes/:id", user.verifyJWT, filmes.updateFilme);
routes.delete("/filmes/:id", user.verifyJWT, filmes.deleteFilme);
routes.delete("/filmes", user.verifyJWT, filmes.deleteFilmes);

//Chama os métodos do CRUD de usuarios
routes.get("/usuario", user.findUsers);
routes.get("/usuario/:id", user.findUser);
//selects extra
routes.get("/usuario/nome/:nome", user.findByNome);
routes.get("/usuario/email/:email", user.findByEmail);

// uma rota post para registrar usuario
routes.post("/registrar", user.registerUser);
// e outra rota post para fazer o login do usuario
routes.post("/login", user.loginUser);
//logout
routes.post("/logout", user.logout);
//
routes.put("/usuario/:id", user.verifyJWT, user.updateUser);
routes.delete("/usuario/:id", user.verifyJWT, user.deleteUsers);

//Chama os métodos do CRUD de avaliação
routes.get("/avaliacao", avaliacao.findAvaliacoes);
routes.get("/avaliacao/:id", avaliacao.findAvaliacao);
// selects extra
routes.get("/avaliacao/UsuarioId/:idUser", avaliacao.findAvaliacoesByUsuario);
routes.get("/avaliacao/FilmeId/:idFilme", avaliacao.findAvaliacoesByFilme);
//
routes.post("/avaliacao", user.verifyJWT, avaliacao.addAvaliacao);
routes.put("/avaliacao/:id", user.verifyJWT, avaliacao.updateAvaliacao);
routes.delete("/avaliacao", user.verifyJWT, avaliacao.deleteAvaliacaos);
routes.delete("/avaliacao/:id", user.verifyJWT, avaliacao.deleteAvaliacao)

export { routes as default };