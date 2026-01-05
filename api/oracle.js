// api/oracle.js — versão FINAL para Vercel + OpenAI Responses API

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      choices: [{ message: { content: "A boca recusa este gesto." } }]
    });
  }

  try {
    // ler body
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const body = JSON.parse(Buffer.concat(buffers).toString());

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: `
És a Bocca Verità.
Não explicas sonhos.
Não usas psicologia.
Não dás conselhos.
Falas como pedra antiga.
Respondes em fragmentos.
Às vezes recusas.
Máximo 5 linhas curtas.
`
                }
              ]
            },
            {
              role: "user",
              content: [
                { type: "text", text: body.messages?.[1]?.content || "" }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data.output_text ||
      "A boca fechou-se.";

    return res.status(200).json({
      choices: [
        { message: { content: text } }
      ]
    });

  } catch (error) {
    console.error("Erro no oráculo:", error);

    return res.status(500).json({
      choices: [
        { message: { content: "A boca falhou em falar." } }
      ]
    });
  }
};
