
module.exports = async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({
      choices: [{ message: { content: "A boca não tem língua." } }]
    });
  }

  return res.status(200).json({
    choices: [{ message: { content: "A boca tem língua." } }]
  });
};
