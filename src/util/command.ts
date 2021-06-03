import {
  Message,
  Client,
  PermissionFlags,
  PermissionObject,
  // Interaction,
  // APIMessage,
  // InteractionReplyOptions,
  // MessageAdditions,
  // Collection,
  // CommandInteractionOption,
} from "discord.js";
import { PartialApplicationCommand } from "slash-commands";
import { CustomClient } from "../bot";
import { ChannelWatchList } from "./watcher";

// export type CommandInteraction = Omit<PartialApplicationCommand, "options"> & {
//   options?: Collection<string, CommandInteractionOption>;
//   execute:
//     | (() =>
//         | string
//         | null
//         | APIMessage
//         | InteractionReplyOptions
//         | MessageAdditions
//         | Promise<
//             | string
//             | null
//             | APIMessage
//             | InteractionReplyOptions
//             | MessageAdditions
//           >)
//     | ((
//         interaction: Interaction
//       ) =>
//         | string
//         | null
//         | APIMessage
//         | InteractionReplyOptions
//         | MessageAdditions
//         | Promise<
//             | string
//             | null
//             | APIMessage
//             | InteractionReplyOptions
//             | MessageAdditions
//           >);
// };

export abstract class Command {
  name: string;
  readonly prefix: string;
  description?: string;
  usage?: string;
  permissions: Partial<PermissionObject> = {};
  constructor(protected client: CustomClient) {
    this.prefix = client.prefix;
  }
  // interaction?: CommandInteraction;
  abstract execute:
    | (() => Message | Message[] | void | Promise<Message | Message[] | void>)
    | ((
        message: Message
      ) => Message | Message[] | void | Promise<Message | Message[] | void>)
    | ((
        message: Message,
        args: string[]
      ) => Message | Message[] | void | Promise<Message | Message[] | void>);
}

export { Message } from "discord.js";
