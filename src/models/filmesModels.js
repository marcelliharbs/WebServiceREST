import {INTEGER, Sequelize } from "sequelize";
import db from "../db.js";

// Tabela Filme
export default db.define("filmes", {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  distribuidora: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  diretor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  elenco: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  genero: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ano_lancamento: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});
