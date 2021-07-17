# Module installation

1. Save:

```text
.update [user]/[repo]/[plugin_name](/[branch])
```

2. Reload the handlers:

```text
.reload
```

# Installing a module from here

```text
.update gramjsuserbot/plugins/[plugin_name]
```

# Contribution

Add your module to `[plugin_name]/[plugin_name].js` and send simply send a PR.

## Example module

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
