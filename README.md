# Plugin installation

1. Save the plugin:

```text
.update [user]/[repo]/[plugin_name](/[branch])
```

2. Reload the plugins:

```text
.reload
```

# Installing a plugin from here

```text
.update gramjsuserbot/plugins/[plugin_name]
```

# Contribution

Add your plugin to `[plugin_name]/[plugin_name].js` and send simply send a PR.

## Example plugin

JavaScript:

```js
const { CommandHandler } = require("../dist/userbot");

exports.default = new CommandHandler(
  (client, event) => {
    event.message.reply({ message: "Hey!" });
  },
  { commands: "hello" }
);
```

TypeScript:

```ts
import { CommandHandler } from "../dist/userbot";

export default new CommandHandler(
  (client, event) => {
    event.message.reply({ message: "Hey!" });
  },
  { commands: "hello" }
);
```

Note: The TS version might be compiled to JS ignoring import errors in the second line before usage.
