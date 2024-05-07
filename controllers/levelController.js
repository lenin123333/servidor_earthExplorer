import { Levels, User } from "../models/index.js";
import { Sequelize } from "sequelize";



const getLevels = async (req, res) => {

  const { id: userId } = req.user
  const levels = await Levels.findAll({
    attributes: [
      'numLevel',
      [Sequelize.fn('MAX', Sequelize.col('numStarts')), 'maxNumStarts'],
    ],
    where: { userId },
    order: [['numLevel', 'ASC']],
    group: ['numLevel']
  });

  if (!levels) {
    return res.json({})
  } else {
    return res.json(levels)
  }


}

const addLevel = async (req, res) => {
  const { numLevel, numStarts, nameTema, noIntentos, timeLevel } = req.body

  const { id: userId } = req.user


  const existNivel = await Levels.findOne({ where: { userId, numLevel }, order: [['timeLevel', 'ASC']], });

  if (!existNivel) {
    const dataLevel = {
      numLevel,
      numStarts,
      timeLevel,
      userId,
      nameTema,
      noIntentos,
    }
    const level = new Levels(dataLevel)
    level.save()

    return res.json(level)
  }

  if (existNivel.userId !== req.user.id) {
    const error = new Error('Accion no valida')
    return res.status(400).json({ msg: error.message })
  }

  const dataLevel = {
    numLevel,
    numStarts,
    timeLevel,
    userId,
    nameTema,
    noIntentos,
  }
  const level = new Levels(dataLevel)
  level.save()
  if (existNivel.timeLevel < timeLevel) {

    res.json(existNivel)
  } else {
    res.json(level)
  }



}

const getStatistics = async (req, res) => {
  const userId = req.params.id;
  const existUser = await User.scope('deletePassword').findByPk(userId);
  
  if (!existUser) {
    return res.status(404).json({ message: 'El Usuario No Existe' });
  }
  
  try {
    const conteoNoIntentos = await Levels.findAll({
      attributes: [
        'nameTema',
        'noIntentos',
        [Sequelize.fn('COUNT', Sequelize.col('noIntentos')), 'total']
      ],
      group: ['nameTema', 'noIntentos'],
      where: {
        noIntentos: {
          [Sequelize.Op.in]: [0, 1, 2, 3] // Filtrar noIntentos igual a 0, 1, 2 y 3
        }
      }
    });

    const count = await Levels.aggregate('numLevel', 'DISTINCT', { plain: false });
    const conteoPorTema = {};

    // Iterar sobre los niveles pasados
    conteoNoIntentos.forEach(nivel => {
      // Obtener el tema del nivel
      const tema = nivel.nameTema;

      // Verificar si ya existe el tema en el objeto de conteoPorTema
      if (!conteoPorTema[tema]) {
        // Si no existe, inicializar el conteo para el tema
        conteoPorTema[tema] = {
          correctas: 0,
          incorrectas: 0
        };
      }

      // Incrementar el conteo correspondiente según el número de intentos
      const total = nivel.dataValues.total;
      switch (nivel.noIntentos) {
        case 0:
          conteoPorTema[tema].correctas += total;
          break;
        case 1:
          conteoPorTema[tema].correctas += total;
          conteoPorTema[tema].incorrectas += total;
          break;
        case 2:
          conteoPorTema[tema].correctas += total;
          conteoPorTema[tema].incorrectas += total * 2;
          break;
        case 3:
          conteoPorTema[tema].incorrectas += total * 3;
          break;
      }
    });

    // Obtener el tema que más se repite
    const temas = Object.keys(conteoPorTema);
    let temaMasRepetido = temas[0];
    let maxRepeticiones = conteoPorTema[temas[0]].correctas + conteoPorTema[temas[0]].incorrectas;
    for (let i = 1; i < temas.length; i++) {
      const tema = temas[i];
      const repeticiones = conteoPorTema[tema].correctas + conteoPorTema[tema].incorrectas;
      if (repeticiones > maxRepeticiones) {
        temaMasRepetido = tema;
        maxRepeticiones = repeticiones;
      }
    }

    // Obtener los usuarios con los mejores tiempos por nivel
    const bestTimes = {};
    for (const level of count) {
      const bestTime = await Levels.findOne({
        where: {
          numLevel: level.DISTINCT
        },
        include: [
          { model: User, as: 'User',attributes: [ 'name'] },
        ],
        order: [['timeLevel', 'ASC']],
        attributes: ['timeLevel']
      });
      
      bestTimes[level.DISTINCT] = {
        bestTime: bestTime
      };
    }

    // Mostrar el resultado del conteo por tema, el tema que más se repite y los mejores tiempos por nivel
    return res.json({
      conteoPorTema,
      temaMasRepetido,
      bestTimes,
      total: count.length
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export {
  addLevel,
  getLevels,
  getStatistics
}