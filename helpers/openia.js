import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.API_KEY_OPENIA, // This is the default and can be omitted
});

export async function generateNote(nameType) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{
            role: 'user', 
            content: `Generame 2 notas de ecologia 30 palabras del tema ${nameType}.
            De las 2 notas, generame 3 preguntas que tengan como respuesta una palabra, 
            y también generame 3 palabras para confundir en cada pregunta.
            
            Estructura esperada:
            Nota 1: {{Nota1}}
            Nota 2: {{Nota2}}
            Pregunta 1: {{Pregunta1}}
            Palabras para confundir: {{PalabrasConfundir1}}
            Respuesta: {{Respuesta1}}
            Pregunta 2: {{Pregunta2}}
            Palabras para confundir: {{PalabrasConfundir2}}
            Respuesta: {{Respuesta2}}
            Pregunta 3: {{Pregunta3}}
            Palabras para confundir: {{PalabrasConfundir3}}
            Respuesta: {{Respuesta3}}
            `
             }],
        model: 'gpt-3.5-turbo',
    });

    // Accede al contenido del mensaje dentro del objeto choices
    const text = chatCompletion.choices[0].message.content;
    return text
}

