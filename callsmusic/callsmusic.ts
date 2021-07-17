import { spawn } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { GramTGCalls } from "gram-tgcalls";
import { client, CommandHandler, getResultText } from "../dist/userbot";

const gramtgcalls = new GramTGCalls(client);

const getFfmpegArgs = (input: string) => {
    return (
        "-y -nostdin " +
        `-i ${input} ` +
        "-c copy " +
        "-acodec pcm_s16le " +
        "-f s16le " +
        "-ac 1 " +
        "-ar 65000 " +
        "pipe:1"
    ).split(/\s/g);
};

const chatType = "group";

const streamHandler = new CommandHandler(
    async (_, event) => {
        const repliedMessage = await event.message.getReplyMessage();
        const audioOrVoice = repliedMessage?.audio || repliedMessage?.voice;

        if (audioOrVoice) {
            const path = String(audioOrVoice.id);

            if (!existsSync(path)) {
                writeFileSync(
                    path,
                    await client.downloadMedia(audioOrVoice, {}),
                );
            }

            await gramtgcalls.stream(
                // @ts-ignore
                event.chatId,
                spawn("ffmpeg", getFfmpegArgs(path)).stdout,
            );

            await event.message.edit({ text: getResultText("Streaming...") });
        }
    },
    { commands: "stream", chatType },
);

const pauseHandler = new CommandHandler(
    (_, event) => {
        // @ts-ignore
        switch (gramtgcalls.pause(event.chatId)) {
            case true:
                return event.message.edit({ text: getResultText("Paused") });
            case false:
                return event.message.edit({
                    text: getResultText("Not streaming"),
                });
            case null:
                return event.message.edit({
                    text: getResultText("Not in call"),
                });
        }
    },
    { commands: "pause", chatType },
);

const resumeHandler = new CommandHandler(
    (_, event) => {
        // @ts-ignore
        switch (gramtgcalls.resume(event.chatId)) {
            case true:
                return event.message.edit({ text: getResultText("Resumed") });
            case false:
                return event.message.edit({
                    text: getResultText("Not paused"),
                });
            case null:
                return event.message.edit({
                    text: getResultText("Not in call"),
                });
        }
    },
    { commands: "resume", chatType },
);

const stopHandler = new CommandHandler(
    async (_, event) => {
        await event.message.edit({
            text: getResultText(
                // @ts-ignore
                (await gramtgcalls.stop(event.chatId))
                    ? "Stopped"
                    : "Not in call",
            ),
        });
    },
    { commands: "stop", chatType },
);

export default [streamHandler, pauseHandler, resumeHandler, stopHandler];
