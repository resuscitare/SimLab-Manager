// Exemplo com OpenAI/Claude
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini", // Use um modelo mais eficiente se possível
  messages: [{ role: "user", content: prompt.slice(0, 30000) }], // Limite a 30k chars
  max_tokens: 1000, // Limite a resposta
});