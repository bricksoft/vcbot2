// import { Interaction } from "discord.js";
import { PermissionObject, VoiceChannel } from "discord.js";
import { Command, /* CommandInteraction, */ Message } from "../util/command";

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
  execute = (message: Message, args: string[]) => {
    if (args.length === 1) {
      const channel = message.guild.channels.resolve(args[0]);
      if (channel && channel.type === "voice") {
        return message.reply(
          this.client.watcher.unwatch(channel as VoiceChannel)
            ? `channel <#${channel.id}> successfully removed from watchlist`
            : `channel <#${channel.id}> not yet watched`
        );
      }
    }
    return message.reply(
      "no valid voice channel specified! try to copy and paste JUST the id of that voice channel!"
    );
  };
}
