// import { Interaction } from "discord.js";
import { Command, /* CommandInteraction, */ Message } from "../util/command";

export default class Ping extends Command {
  name = "ping";
  description = "pings back to user";
  // interaction: CommandInteraction = {
  //   name: this.name,
  //   description: this.description,
  //   execute: (interaction: Interaction) => {
  //     return "Pong!";
  //   },
  // };
  execute = (message: Message) => {
    return message.reply("pong!");
  };
}
