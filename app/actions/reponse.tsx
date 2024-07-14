require('dotenv').config();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: "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",dangerouslyAllowBrowser: true});

export default async function generateQuery(input:string){
    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": "create postgresql query for the given input instruction. Return only postgresql query nothing else only the postgreSQL syntax so that i can directly copy paste it don't put the quotes arround syntax also."
                },
                {
                    "role": "user",
                    "content": `${input}`
                }
            ],
            "model": "llama3-8b-8192",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });
        console.log(chatCompletion.choices[0].message.content)
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating query:', error);
        return 'An error occurred while generating the query. Please try again.';
    }
}
