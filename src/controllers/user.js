import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../models/usuarioModels.js";
import { Op } from "sequelize";

async function verifyJWT(req, res, next) {
    const token = req.headers['x-acess-token'];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
}

function findUsers(req, res) {
    userRepository.findAll()
        .then((result) => res.json(result))
        .catch(error => res.status(500).json({ error: 'Erro ao buscar usuarios', details: error.message }));
}

function findUser(req, res) {
    userRepository.findByPk(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json(result);
        })
        .catch(error => res.status(500).json({ error: 'Erro ao buscar usuário', details: error.message }));
}

async function registerUser(req, res) {

    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    const existeUsuario = await userRepository.findOne({ where: { email } });
    if (existeUsuario) {
        return res.status(409).json({ error: "Email já está em uso" });
    }

    const senhaCripto = await bcrypt.hash(senha, 5);

    const novoUsuario = await userRepository.create({
        nome,
        email,
        senha: senhaCripto,
    });

    res.status(201).json(novoUsuario);
}

async function loginUser(req, res) {

    const email = req.body.email;
    const senha = req.body.senha;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios"})
    }
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
        return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: 300,
    });

    res.json({ message: "Login bem-sucedido", token });
}

function logout(req, res) {
    res.end();
}

async function updateUser(req, res) {
    const email = req.body.email;
    const senha = req.body.senha;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios'})
    }
    const senhaCripto = await bcrypt.hash(senha, 5);

    await userRepository.update(
        { email, senha: senhaCripto }, {
        where: {
            id: req.params.id,
        }
    })

    const usuarioAtualizado = await userRepository.findByPk(req.params.id);
    res.json(usuarioAtualizado);
}

async function deleteUsers(req, res) {
    try {
        await userRepository.destroy({ where: {} });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar os usuarios', details: error.message });
    }
}

async function findByNome(req, res) {
    try {
        const { nome } = req.params; // Obtém o nome de req.params

        if (!nome) {
            return res.status(400).json({ error: "O nome é obrigatório." });
        }

        const usuarios = await userRepository.findAll({
            where: {
                nome: {
                    [Op.like]: `%${nome}%`, // Busca com LIKE
                    // Encontra registros que contêm, começam ou terminam com um certo padrão
                },
            },
        });

        if (usuarios.length === 0) { // === verifica se são iguais e se são do mesmo tipo
            return res.status(404).json({ message: "Nenhum usuário encontrado com o nome fornecido." });
        }

        res.json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error); // Exibe detalhes do erro no console
        res.status(500).json({ error: "Erro ao buscar usuários pelo nome.", details: error.message });
    }
}

async function findByEmail(req, res) {
    try {
        const { email } = req.params;  // Pegando o email dos parâmetros da rota

        if (!email) {
            return res.status(400).json({ error: "O email é obrigatório." });
        }

        const usuario = await userRepository.findOne({
            where: { email }, // Busca apenas um email
        });

        if (!usuario) {
            return res.status(404).json({ message: "Nenhum usuário encontrado com o email fornecido." });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário pelo email.", details: error.message });
    }
}

export default { findUsers, findUser, registerUser, loginUser, logout, findUser, updateUser, deleteUsers, verifyJWT, findByEmail, findByNome };
