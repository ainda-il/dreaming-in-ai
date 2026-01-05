export default async function handler(req, res) {
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
    // 🔑 Ler o body manualmente
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const rawBody = Buffer.concat(buffers).toString();
    const body = JSON.parse(rawBody);

    console.log("Body recebido:", body);

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return res.status(200).json({
        choices: [{ message: { content: "A boca fechou-se." } }]
      });
    }

    return res.status(200).json(data);

} catch (error) {
  console.error("ERRO COMPLETO:", error);

  return res.status(500).json({
    choices: [{
      message: {
        content: "Erro técnico. Ver logs do Vercel."
      }
    }],
    error: String(error)
  });
}
