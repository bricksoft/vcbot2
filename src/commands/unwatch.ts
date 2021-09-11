// import { Interaction } from "discord.js";
import { PermissionObject, VoiceChannel } from "discord.js";
import { Command, /* CommandInteraction, */ Message } from "../util/command";
import { stripIndents } from "common-tags";

export default class Unwatch extends Command {
  name = "unwatch";
  description = "removes a channel from watchlist";
  permissions: Partial<PermissionObject> = {
    MANAGE_GUILD: true,
  };
  // interaction: CommandInteraction = {
  //   name: this.name,
  //   description: this.description,
  //   execute: (interaction: Interaction) => {
  //     return "Pong!";
  //   },
  // };
  execute = async (message: Message, args: string[]) => {
    if (args.length > 0) {
      const channel = message.guild.channels.resolve(args[0]);
      if (channel && channel.type === "voice") {
        const result = await this.client.watcher.removeChannel(
          message.guild.id,
          channel as VoiceChannel
        );
        return message.reply(
          stripIndents`channel(s) successfully removed from watchlist:
          ${result.map(([id]) => `- <#${id}>`).join("\r\n")}
          ${
            result.some(([_, found]) => !found)
              ? stripIndents`some channel(s) not yet watched:
            ${result.map(([id]) => `- <#${id}>`).join("\r\n")}`
              : ""
          }`
        );
      }
    }
    return message.reply(
      "no valid voice channel specified! try to copy and paste JUST the id of that voice channel!"
    );
  };
}
