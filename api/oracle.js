const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({
      choices: [{ message: { content: "A boca recusa este gesto." } }]
    });
  }

  try {
    // ler body manualmente
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const rawBody = Buffer.concat(buffers).toString();
    const body = JSON.parse(rawBody);

    const dream = body.messages?.[1]?.content || "";

    // chamada ao OpenAI SDK
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
És a Bocca Verità.
Não explicas sonhos.
Não dás conselhos.
Falas como pedra antiga.
Respondes em fragmentos.
Às vezes recusas.
Máximo 5 linhas curtas.
`
        },
        {
          role: "user",
          content: dream
        }
      ]
    });

    const text = response.choices?.[0]?.message?.content || "A boca fechou-se.";

    return res.status(200).json({ choices: [{ message: { content: text } }] });

  } catch (err) {
    console.error("Erro no oráculo:", err);
    return res.status(500).json({
      choices: [{ message: { content: "A boca falhou em falar." } }]
    });
  }
};
