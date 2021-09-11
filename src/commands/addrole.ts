// import { Interaction } from "discord.js";
import { PermissionObject } from "discord.js";
import { Command, /* CommandInteraction, */ Message } from "../util/command";

export default class AddRole extends Command {
  name = "addrole";
  description =
    "adds a role which the bot should add / remove for watched channels";
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
    if (args.length === 1) {
      const role = message.guild.roles.resolve(args[0]);
      if (role) {
        await this.client.watcher.addRoles(message.guild.id, role.id);
        return message.reply(
          `I will add/remove the role <@&${role.id}> from now on!`
        );
      }
    }
    return message.reply(
      "no role specified! try to copy and paste JUST the id of that role!"
    );
  };
}
