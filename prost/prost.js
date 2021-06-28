const { CommandHandler, editMessageToResult } = require("../dist/userbot");

module.exports = new CommandHandler("prost", async function (event) {
    await editMessageToResult(event, "Stone ist prost!");
});
