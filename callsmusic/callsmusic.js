"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const gram_tgcalls_1 = require("gram-tgcalls");
const userbot_1 = require("../dist/userbot");
const gramtgcalls = new gram_tgcalls_1.GramTGCalls(userbot_1.client);
const getFfmpegArgs = (input) => {
    return ("-y -nostdin " +
        `-i ${input} ` +
        "-c copy " +
        "-acodec pcm_s16le " +
        "-f s16le " +
        "-ac 1 " +
        "-ar 65000 " +
        "pipe:1").split(/\s/g);
};
const chatType = "group";
const streamHandler = new userbot_1.CommandHandler(async (_, event) => {
    const repliedMessage = await event.message.getReplyMessage();
    const audioOrVoice = (repliedMessage === null || repliedMessage === void 0 ? void 0 : repliedMessage.audio) || (repliedMessage === null || repliedMessage === void 0 ? void 0 : repliedMessage.voice);
    if (audioOrVoice) {
        const path = String(audioOrVoice.id);
        if (!fs_1.existsSync(path)) {
            fs_1.writeFileSync(path, await userbot_1.client.downloadMedia(audioOrVoice, {}));
        }
        await gramtgcalls.stream(
        // @ts-ignore
        event.chatId, child_process_1.spawn("ffmpeg", getFfmpegArgs(path)).stdout);
        await event.message.edit({ text: userbot_1.getResultText("Streaming...") });
    }
}, { commands: "stream", chatType });
const pauseHandler = new userbot_1.CommandHandler((_, event) => {
    // @ts-ignore
    switch (gramtgcalls.pause(event.chatId)) {
        case true:
            return event.message.edit({ text: userbot_1.getResultText("Paused") });
        case false:
            return event.message.edit({
                text: userbot_1.getResultText("Not streaming"),
            });
        case null:
            return event.message.edit({
                text: userbot_1.getResultText("Not in call"),
            });
    }
}, { commands: "pause", chatType });
const resumeHandler = new userbot_1.CommandHandler((_, event) => {
    // @ts-ignore
    switch (gramtgcalls.resume(event.chatId)) {
        case true:
            return event.message.edit({ text: userbot_1.getResultText("Resumed") });
        case false:
            return event.message.edit({
                text: userbot_1.getResultText("Not paused"),
            });
        case null:
            return event.message.edit({
                text: userbot_1.getResultText("Not in call"),
            });
    }
}, { commands: "resume", chatType });
const stopHandler = new userbot_1.CommandHandler(async (_, event) => {
    await event.message.edit({
        text: userbot_1.getResultText(
        // @ts-ignore
        (await gramtgcalls.stop(event.chatId))
            ? "Stopped"
            : "Not in call"),
    });
}, { commands: "stop", chatType });
exports.default = [streamHandler, pauseHandler, resumeHandler, stopHandler];
