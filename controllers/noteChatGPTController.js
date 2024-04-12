import { generateNote } from "../helpers/openia.js"


const getNotas = async (req, res) => {
    const { nameEcology } = req.body
    const response = await generateNote(nameEcology)
  
    // Separar las notas, preguntas, respuestas y palabras para confundir
    const notasRegex = /Nota \d+: (.*?)(?=\n\n)/gs;
    const notas = response.match(notasRegex).map(nota => nota.trim().replace(/Nota \d+: /, ''));

    const preguntasRegex = /Pregunta \d+: (.*?)(?=\nPalabras para confundir:)/gs;
    const preguntas = response.match(preguntasRegex).map(pregunta => pregunta.trim().replace(/Pregunta \d+: /, ''));

    const respuestasRegex = /Respuesta: (.*?)(?=\n\nPregunta|$)/gs;
    const respuestas = response.match(respuestasRegex).map(respuesta => respuesta.trim().replace(/Respuesta: /, '').replace(/\.$/, ''));

    const palabrasConfundirRegex = /Palabras para confundir: (.*?)(?=\nRespuesta|$)/gs;
    const palabrasConfundir = response.match(palabrasConfundirRegex).map(palabras => palabras.trim().replace(/Palabras para confundir: /, '').replace(/\./g, '').split(', '));


    res.json(
        {
            notas,
            pregunta_1: [{
                pregunta: preguntas[0],
                respuesta: respuestas[0],
                palabras: palabrasConfundir[0]
            }],
            pregunta_2: [{
                pregunta: preguntas[1],
                respuesta: respuestas[1],
                palabras: palabrasConfundir[1]
            }],
            pregunta_3: [{
                pregunta: preguntas[2],
                respuesta: respuestas[2],
                palabras: palabrasConfundir[2]
            }]
        }
    )

}


export {
    getNotas
}