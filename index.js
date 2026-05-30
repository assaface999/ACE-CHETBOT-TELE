require("dotenv").config();

const { Telegraf } = require("telegraf");
const OpenAI = require("openai");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

bot.start((ctx) => {
  ctx.reply("שלום! אני מחובר ל-ChatGPT. שלח לי הודעה 🙂");
});

bot.on("text", async (ctx) => {
  try {
    const userMessage = ctx.message.text;

    await ctx.reply("חושב...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "אתה עוזר אישי ידידותי, ברור ותמציתי. ענה בעברית אלא אם המשתמש מבקש אחרת.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const answer = response.choices[0].message.content;
    await ctx.reply(answer);
  } catch (error) {
    console.error(error);
    await ctx.reply("אירעה שגיאה. בדוק את הלוגים בשרת.");
  }
});

bot.launch();

console.log("Telegram ChatGPT bot is running...");
