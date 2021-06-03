import { Client, ClientOptions, GuildMember, VoiceState } from "discord.js";
import { join } from "path";
import { CommandHandler } from "./commandhandler";
import { ECLFAIL } from "./util/error";
import { ChannelWatchList } from "./util/watcher";

export { ClientOptions as Options } from "discord.js";

export type CustomClient = Client & {
  watcher: ChannelWatchList;
  handler: CommandHandler;
  prefix: string;
};

export type BotCredentials = {
  applicationId: string;
  token: string;
  publicKey: string;
};

export default class Bot {
  private client: CustomClient;
  constructor(
    credentials: BotCredentials,
    prefix = "!",
    configDir: string = join(__dirname, "../config"),
    options?: ClientOptions
  ) {
    this.client = new Client(options) as CustomClient;
    this.client.prefix = prefix;
    this.client.handler = new CommandHandler(this.client, prefix, credentials);
    this.client.watcher = new ChannelWatchList(
      this.client,
      join(configDir, "watchlist.json")
    );
    this.client
      .login(credentials.token)
      .then(this.onReady.bind(this.client))
      .catch(this.onLoginErr.bind(this.client));
    this.client.on(
      "voiceStateUpdate",
      this.client.watcher.handleVoiceStateChange.bind(this.client.watcher)
    );
    this.client.on("ready", async () => {
      this.onLogin(this.client);

      // TODO wait for discord.js v13
      // this.registerCommands(this.handler);
    });
  }
  protected onReady(this: Client) {
    console.log("ready [%s]", this.readyTimestamp);
  }
  protected onLogin(client: Client) {
    console.log(`Successfully logged in as ${client.user.tag}`);
  }
  protected onLoginErr(this: Client, err: Error) {
    throw new ECLFAIL(err.message);
  }

  // protected async registerCommands(handler: CommandHandler) {
  //   const result = await this.handler.registerSlashCommands();
  //   console.log(
  //     `slash commands(${result.length}): ${
  //       result.length
  //         ? `successfully registered: ${result.map((c) => c.name).join(", ")}`
  //         : "installation skipped"
  //     }`
  //   );
  // }
}
