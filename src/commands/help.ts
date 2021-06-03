// import { Interaction } from "discord.js";
import {
  EmbedField,
  EmbedFieldData,
  MessageEmbed,
  PermissionObject,
} from "discord.js";
import { Command, /* CommandInteraction, */ Message } from "../util/command";

export default class Help extends Command {
  name = "help";
  description = "displays detailed help about commands";
  usage = `${this.prefix}${this.name} [command name]`;

  // interaction: CommandInteraction = {
  //   name: this.name,
  //   description: this.description,
  //   execute: (interaction: Interaction) => {
  //     return "Pong!";
  //   },
  // };
  execute = (message: Message, args: string[]) => {
    const command =
      this.client.handler.commands.get(args[0] || this.name) || this;

    const fallback = args.length
      ? !(
          args.length &&
          [...this.client.handler.commands.keys()].includes(args[0])
        )
      : false;

    message.reply(
      new MessageEmbed({
        title: `${this.client.user.username} Help ${
          fallback || command.name === this.name ? "" : `| ${command.name}`
        }`,
        description: command.description,
        fields: [
          {
            name: "usage",
            value: command.usage || `${this.prefix}${command.name}`,
          },
          {
            name: "required permissions",
            value: Object.keys(command.permissions).length
              ? "- " + Object.keys(command.permissions).join("\r\n")
              : "none required",
          },
          command.name === this.name
            ? {
                name: "commands",
                value:
                  "- " +
                  [...this.client.handler.commands.keys()].join("\r\n- "),
              }
            : null,
        ].filter((v) => typeof v !== "undefined" && v !== null),
        footer: fallback ? { text: `command ${args[0]} not found` } : null,
      })
    );
  };
}
