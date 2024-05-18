import { User, Levels } from "../models/index.js";
import { Sequelize, Op } from 'sequelize';

const getData = async (req, res) => {
   try {
     // Obtener el total de usuarios
     const users = await User.findAndCountAll();
     const totalUsers = users.count;

     // Obtener todos los timeLevels
     const levels = await Levels.findAll();

     // Sumar todos los timeLevels en segundos
     const totalSeconds = levels.reduce((acc, level) => acc + level.timeLevel, 0);

     // Convertir segundos a horas, minutos y segundos
     const hours = Math.floor(totalSeconds / 3600);
     const minutes = Math.floor((totalSeconds % 3600) / 60);
     const seconds = totalSeconds % 60;

     // Formatear cada parte del tiempo para tener dos dígitos
     const formattedHours = String(hours).padStart(2, '0');
     const formattedMinutes = String(minutes).padStart(2, '0');
     const formattedSeconds = String(seconds).padStart(2, '0');

     // Concatenar las partes formateadas para obtener el tiempo en formato HH:MM:SS
     const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

     // Obtener la fecha de hace 6 meses
     const sixMonthsAgo = new Date();
     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

     // Consulta SQL para contar los registros nuevos en los últimos 6 meses
     const contestCounts = await Levels.findAll({
       attributes: [
         [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
         [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
       ],
       where: {
         createdAt: { [Op.gte]: sixMonthsAgo } // Registros creados en los últimos 6 meses
       },
       group: ['month'],
       order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'ASC']] // Ordenar por fecha de menor a mayor
     });

     // Formatear los resultados para devolverlos
     const formattedCounts = contestCounts.map(count => ({
       month: count.getDataValue('month'),
       count: count.getDataValue('count')
     }));

     // Función para obtener las interacciones del nameTema con más interacciones en los últimos 6 meses
     const mostInteractedNameTemaData = await getMostInteractedNameTemaData(sixMonthsAgo);

     // Función para obtener el total de interacciones de cada nameTema, excluyendo al nameTema con más interacciones
     const totalInteractionsExceptMostInteracted = await getTotalInteractionsExceptMostInteracted(sixMonthsAgo, mostInteractedNameTemaData);

     res.json({ totalUsers, totalTime: formattedTime, contestCounts: formattedCounts, mostInteractedNameTemaData, totalInteractionsExceptMostInteracted });
   } catch (error) {
     console.error('Error al obtener datos:', error);
     res.status(500).json({ message: 'Error interno del servidor' });
   }
};

// Función para obtener las interacciones del nameTema con más interacciones en los últimos 6 meses
const getMostInteractedNameTemaData = async (sixMonthsAgo) => {
   const nameTemaInteractions = await Levels.findAll({
     attributes: [
       'nameTema',
       [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
       [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
     ],
     where: {
       createdAt: { [Op.gte]: sixMonthsAgo } // Registros creados en los últimos 6 meses
     },
     group: ['nameTema', 'month']
   });
 
   const totalInteractions = {};
   nameTemaInteractions.forEach(interaction => {
     const nameTema = interaction.getDataValue('nameTema');
     const count = interaction.getDataValue('count');
     if (!totalInteractions[nameTema]) {
       totalInteractions[nameTema] = 0;
     }
     totalInteractions[nameTema] += count;
   });
 
   let mostInteractedNameTema = null;
   let mostInteractedCount = 0;
   for (const nameTema in totalInteractions) {
     if (totalInteractions[nameTema] > mostInteractedCount) {
       mostInteractedNameTema = nameTema;
       mostInteractedCount = totalInteractions[nameTema];
     }
   }
 
   const mostInteractedInteractions = await Levels.findAll({
     attributes: [
       'nameTema',
       [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
       [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
     ],
     where: {
       nameTema: mostInteractedNameTema,
       createdAt: { [Op.gte]: sixMonthsAgo } // Registros creados en los últimos 6 meses
     },
     group: ['nameTema', 'month']
   });
 
   const interactions = mostInteractedInteractions.map(interaction => ({
     nameTema: interaction.getDataValue('nameTema'),
     month: interaction.getDataValue('month'),
     count: interaction.getDataValue('count')
   }));
 
   // Ordenar los datos por fecha de forma ascendente
   interactions.sort((a, b) => a.month.localeCompare(b.month));
 
   return interactions;
 };
 

const getTotalInteractionsExceptMostInteracted = async (sixMonthsAgo, mostInteractedNameTemaData) => {
   const nameTemaInteractions = await Levels.findAll({
     attributes: [
       'nameTema',
       [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
       [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
     ],
     where: {
       createdAt: { [Op.gte]: sixMonthsAgo } // Registros creados en los últimos 6 meses
     },
     group: ['nameTema', 'month']
   });
 
   const totalInteractions = {};
   nameTemaInteractions.forEach(interaction => {
     const nameTema = interaction.getDataValue('nameTema');
     const count = interaction.getDataValue('count');
     if (nameTema !== Object.keys(mostInteractedNameTemaData)[0]) {
       if (!totalInteractions[nameTema]) {
         totalInteractions[nameTema] = 0;
       }
       totalInteractions[nameTema] += count;
     }
   });
 
   const totalInteractionsExceptMostInteracted = [];
   for (const nameTema in totalInteractions) {
     const total = totalInteractions[nameTema];
     totalInteractionsExceptMostInteracted.push({ nameTema, total });
   }
 
   // Ordenar de mayor a menor
   totalInteractionsExceptMostInteracted.sort((a, b) => b.total - a.total);
 
   return totalInteractionsExceptMostInteracted;
 };


export { getData };
