const { CommandHandler, editMessageToError } = require("../dist/userbot");

module.exports = new CommandHandler("error", async function (event) {
    await editMessageToError(event, "Wrr!");
});
