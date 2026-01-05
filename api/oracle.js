// api/oracle.js — versão com logs detalhados
export default async function handler(req, res) {
  // Configura CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Verifica corpo
  if (!req.body) {
    console.error("Corpo da requisição vazio.");
    return res.status(400).json({
      choices: [{ message: { content: "A boca não recebeu nada." } }]
    });
  }

  try {
    // Mostra no log o que vai ser enviado para a OpenAI
    console.log("Enviando payload para a OpenAI:", JSON.stringify(req.body));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    // Log do status HTTP da OpenAI
    console.log("Status da resposta da OpenAI:", response.status);

    const data = await response.json();

    // Log completo da resposta
    console.log("Resposta da OpenAI:", JSON.stringify(data));

    if (!data.choices || data.choices.length === 0) {
      return res.status(200).json({
        choices: [{ message: { content: "A boca fechou-se." } }]
      });
    }

    // Tudo certo: devolve resultado
    res.status(200).json(data);

  } catch (error) {
    console.error("Erro ao falar com a OpenAI:", error);

    res.status(500).json({
      choices: [{ message: { content: "A boca falhou em falar." } }]
    });
  }
}
