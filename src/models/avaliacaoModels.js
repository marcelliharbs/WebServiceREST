import { INTEGER, Sequelize } from "sequelize";
import db from "../db.js";

// Tabela Avaliação
export default db.define("avaliacao", {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
    id_usuario: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'usuarios', // Nome da tabela referenciada
      key: 'id', // Chave primária da tabela referenciada
    },
  },
  id_filme: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'filmes', // Nome da tabela referenciada
      key: 'id', // Chave primária da tabela referenciada
    },
  },
  nota: {
    type: Sequelize.FLOAT(2, 1),
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  ds_comentario: {
    type: Sequelize.STRING(200),
    allowNull: true, // Comentário pode ser opcional
  }
});
