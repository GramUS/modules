# Plugin installation
```text
.update gramjsuserbot/plugins/[plugin_name]
```

# Contribution

Add your plugin to `[plugin_name]/[plugin_name].js` and send simply send a PR.

## Example plugin
JavaScript:
```js
const { CommandHandler, editMessageToResult } = require("../dist/userbot");

module.exports = new CommandHandler("hello", async function (event) {
    await editMessageToResult(event, "Hey!");
});
```

TypeScript:
```ts
import { NewMessageEvent } from "telegram";
import { CommandHandler, editMessageToResult } = require("../dist/userbot");

export = new CommandHandler("hello", async function (event: NewMessageEvent) {
    await editMessageToResult(event, "Hey!");
});
```

Note: The TS version might be compiled to JS ignoring import errors in the second line before usage.
