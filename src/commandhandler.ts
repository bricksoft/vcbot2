import {
  Client,
  Collection /* Interaction */,
  PermissionString,
} from "discord.js";
import { DiscordInteractions } from "slash-commands";
import { BotCredentials } from "./bot";
import commands from "./commands";
import { Command, Message } from "./util/command";
import { ECMDFAIL, EPERMFAIL } from "./util/error";

export class CommandHandler {
  private replies = new Collection<string, Message[]>();
  #commands: Collection<string, Command>;
  private interaction: DiscordInteractions;

  public get commands() {
    return this.#commands.clone();
  }

  constructor(
    private client: Client,
    private prefix: string,
    {
      applicationId,
      token,
      publicKey,
    }: BotCredentials
  ) {
    this.#commands = commands(this.client);
    this.interaction = new DiscordInteractions({
      applicationId,
      authToken: token,
      publicKey,
    });
    this.client.on("message", this.onMessage.bind(this));
    this.client.on("messageUpdate", this.onMessageUpdate.bind(this));
    this.client.on("messageDelete", this.onMessageDelete.bind(this));
    // this.client.on("interaction", this.onInteraction.bind(this));
  }

  // private async onInteraction(interaction: Interaction) {
  //   if (!interaction.isCommand()) return;
  //   const command: Command = this.commands.find(
  //     (c) => c.name === interaction.commandName
  //   )[0];
  //   if (!command) return await interaction.reply(null);

  //   const result = await command.interaction.execute(interaction);
  //   await interaction.reply(result as string, {});
  // }

  private async onMessage(message: Message) {
    const args = message.content.split(/ +/);
    const command = args.shift().toLowerCase().replace(this.prefix, "");

    if (
      !message.content.startsWith(this.prefix) ||
      !this.#commands.has(command)
    ) {
      return;
    }

    try {
      const cmd = this.#commands.get(command.replace(this.prefix, ""));
      const missingPerms = Object.keys(cmd.permissions)
        .map((k) => {
          if (
            cmd.permissions[k] &&
            !message.member.permissions.has(k as PermissionString)
          ) {
            return k;
          }
        })
        .filter((p) => typeof p !== "undefined");
      if (missingPerms.length) {
        console.log(
          new EPERMFAIL(
            command,
            `user ${message.member.id}(${
              message.member.nickname
            }) missing permission(s): ${missingPerms.join(", ")}`
          )
        );
        return false;
      }
      const result = await cmd.execute(message, args);
      if (result) {
        const resultSet = this.replies.has(message.id)
          ? this.replies.get(message.id)
          : [];

        if (Array.isArray(result)) {
          this.replies.set(message.id, [
            ...new Set<Message>([...resultSet, ...result]),
          ]);
        } else {
          this.replies.set(message.id, [
            ...new Set<Message>([...resultSet, result]),
          ]);
        }
      }
    } catch (error) {
      throw new ECMDFAIL(command, error);
    }
  }
  private onMessageUpdate(oldMessage: Message, newMessage: Message) {}
  private onMessageDelete(message: Message) {
    if (this.replies.has(message.id)) {
      this.replies.get(message.id).forEach((r) => {
        if (r.deletable) {
          r.delete();
        }
      });
    }
  }

  // public async registerSlashCommands() {
  //   const registeredCommands = await this.interaction.getApplicationCommands();

  //   // check if all commands are set
  //   if (
  //     registeredCommands.length ===
  //     this.commands.filter((command) => !!command.interaction).size
  //   ) {
  //     if (
  //       registeredCommands.every((c) =>
  //         this.commands.find(
  //           (c2) =>
  //             c2.interaction &&
  //             c2.interaction.name === c.name &&
  //             c2.interaction.description === c.description &&
  //             (c2.interaction.options || new Collection()).every(
  //               (o) => !!c.options.find((o2) => o2.name === o.name)
  //             )
  //         )
  //       )
  //     )
  //       return registeredCommands;
  //   }

  //   // delete all commands
  //   await Promise.all(
  //     registeredCommands.map((c) =>
  //       this.interaction.deleteApplicationCommand(c.id)
  //     )
  //   );

  //   // register all commands
  //   return Promise.all(
  //     this.commands
  //       .filter((command) => !!command.interaction)
  //       .map((command) => {
  //         return this.interaction.createApplicationCommand(
  //           command.interaction as any
  //         );
  //       })
  //   );
  // }
}
