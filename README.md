# GramJS Modules

Customizing [GramJS Userbot](https://github.com/gramjsuserbot/gramjsuerbot).

## Introduction

GramJS Userbots can be customized with modules. GramJS Userbot modules are JavaScript files hosted in a GitHub repository, which includes some handlers that will be added to GramJS Userbot after they are installed. A GramJS Userbot can be written by you or someone else, in either JavaScript or TypeScript. But if one writes a module in TypeScript, they should build it to JavaScript before it works and gets published.

The goal of this repository is to collect useful modules for you and by you. Anyone can add their modules to here by sending a PR.

## Installing modules

For installing modules in a GramJS Userbot, simply use the `.update` command with the following syntax:

```text
.update <user>/<repo>/<module_name>(/<branch>)
```

> 1️⃣ The < and > signs are just to tell you that the value can change, they should not be included when using the command.  
> 2️⃣ Arguments inside ( and ) are optional.

## Hello world module example

1. Clone the GramJS Userbot repository:

```bash
git clone https://github.com/gramjsuserbot/gramjsuserbot
```

2. Open the cloned folder with an editor.
3. Create a new file named `hello.ts` in the `src/handlers` folder with the following code:

```ts
import { CommandHandler } from "../userbot";

export default new CommandHandler(
  async (client, event) => {
    await event.message.reply({ message: "world!" });
  },
  { commands: "hello" }
);
```

4. Run your bot, and try if it works.
5. Find your handler's compiled JavaScript file in the `dist` folder and fix the imports from other directories, for example replace `../userbot` with `../dist/userbot`.
6. Upload it to a GitHub repository in a folder with the same name of your handler file without `.js`.
7. Install it with the instruction above.
