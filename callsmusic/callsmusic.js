"use strict";
const crypto_1 = require("crypto");
const child_process_1 = require("child_process");
const gram_tgcalls_1 = require("gram-tgcalls");
const fs_1 = require("fs");
const userbot_1 = require("../userbot");
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
const gramtgcalls = new gram_tgcalls_1.GramTGCalls(userbot_1.client);
async function stream(event) {
    const repliedMessage = await userbot_1.getRepliedMessage(event);
    const audioOrVoice = repliedMessage.audio || repliedMessage.voice;
    if (audioOrVoice) {
        const id = crypto_1.createHash("md5")
            .update(audioOrVoice.id.toString())
            .digest("hex")
            .toString();
        if (!fs_1.existsSync(id)) {
            fs_1.writeFileSync(id, await userbot_1.client.downloadMedia(audioOrVoice, {}));
        }
        try {
            await gramtgcalls.stream(
            // @ts-ignore
            event.chatId, child_process_1.spawn("ffmpeg", getFfmpegArgs(id)).stdout);
            await userbot_1.editMessageToResult(event, "Streaming...");
        }
        catch (e) {
            await userbot_1.editMessageToError(event, e instanceof Error ? e.message : e);
        }
    }
}
async function pause(event) {
    // @ts-ignore
    const result = gramtgcalls.pause(event.chatId);
    if (result) {
        await userbot_1.editMessageToResult(event, "Paused");
    }
    else if (result == false) {
        await userbot_1.editMessageToError(event, "Not streaming");
    }
    else {
        await userbot_1.editMessageToError(event, "Not in call");
    }
}
async function resume(event) {
    // @ts-ignore
    const result = gramtgcalls.resume(event.chatId);
    if (result) {
        await userbot_1.editMessageToResult(event, "Resumed");
    }
    else if (result == false) {
        await userbot_1.editMessageToError(event, "Not paused");
    }
    else {
        await userbot_1.editMessageToError(event, "Not in call");
    }
}
async function leave(event) {
    // @ts-ignore
    const result = await gramtgcalls.leave(event.chatId);
    if (result) {
        userbot_1.editMessageToResult(event, "Left the call");
    }
    else {
        userbot_1.editMessageToError(event, "Not in call");
    }
}
module.exports = [
    new userbot_1.CommandHandler("stream", stream, {
        requireReply: true,
        requireGroup: true,
    }),
    new userbot_1.CommandHandler("pause", pause, { requireGroup: true }),
    new userbot_1.CommandHandler("resume", resume, { requireGroup: true }),
    new userbot_1.CommandHandler("leave", resume, { requireGroup: true }),
];
