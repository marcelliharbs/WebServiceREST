import filmRepository from "../models/filmesModels.js";

function findAll(req, res) {
    filmRepository.findAll().then((result) => res.json(result));
}

function findFilme(req, res) {
    filmRepository.findByPk(req.params.id).then((result) => res.json(result));
}

function addFilme(req, res) {
    filmRepository.create({
        nome: req.body.nome,
        distribuidora: req.body.distribuidora,
        diretor: req.body.diretor,
        elenco: req.body.elenco,
        genero: req.body.genero,
        ano_lancamento: req.body.ano_lancamento,
    }).then((result) => res.json(result));
}

async function updateFilme(req, res) {
    await filmRepository.update(
        {
            nome: req.body.nome,
            distribuidora: req.body.distribuidora,
            diretor: req.body.diretor,
            elenco: req.body.elenco,
            genero: req.body.genero,
            ano_lancamento: req.body.ano_lancamento,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    );

    filmRepository.findByPk(req.params.id).then((result) => res.json(result));
}

async function deleteFilmes(req, res) {
    try {
        await filmRepository.destroy({ where: {} });

        const filmesAtualizados = await filmRepository.findAll();
        res.json(filmesAtualizados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar os filmes' });
    }
}

async function deleteFilme(req, res) {
    try {
        await filmRepository.destroy({
                where:
                {
                    id: req.params.id,
                },
            });

        const filmesAtualizados = await filmRepository.findAll();
        res.json(filmesAtualizados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar os filmes' });
    }
}

async function findByGenero(req, res) {
    try {
      const { genero } = req.params; // Pega o valor de genero
  
      if (!genero) {
        return res.status(400).json({ error: "O gênero é obrigatório." });
      }
  
      const filmes = await filmRepository.findAll({
        where: {
          genero: genero // Use o nome correto da FK no banco
        }
      });
  
      if (filmes.length === 0) { // === verifica se são iguais e se são do mesmo tipo
        return res.status(404).json({ message: "Nenhum filme encontrado para o gênero fornecido." });
      }
  
      res.json(filmes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar filmes por gênero.' });
    }
  }
 
  async function findByDistribuidora(req, res) {
    try {
      const { distribuidora } = req.params; // Pega o valor de distribuidora
  
      if (!distribuidora) {
        return res.status(400).json({ error: "A distribuidora é obrigatória." });
      }
  
      const filmes = await filmRepository.findAll({
        where: {
          distribuidora: distribuidora // Use o nome correto da FK no banco
        }
      });
  
      if (filmes.length === 0) { // === verifica se são iguais e se são do mesmo tipo
        return res.status(404).json({ message: "Nenhum filme encontrado para a distribuidora fornecida." });
      }
  
      res.json(filmes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar filmes por distribuidora.' });
    }
  }

export default { findAll, addFilme, findFilme, updateFilme, deleteFilmes, deleteFilme, findByGenero, findByDistribuidora };
