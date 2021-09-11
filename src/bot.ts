import { Client, ClientOptions } from "discord.js";
import { join } from "path";
import { CommandHandler } from "./commandhandler";
import { ECLFAIL } from "./util/error";
import { ChannelWatchList } from "./util/watcher";
import { dataDir as DATA_DIR } from "./config";

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
    dataDir = DATA_DIR,
    options?: ClientOptions
  ) {
    this.client = new Client(options) as CustomClient;
    this.client.prefix = prefix;
    this.client.handler = new CommandHandler(this.client, prefix, credentials);
    this.client.watcher = new ChannelWatchList(
      this.client,
      join(dataDir, "watchlist.json")
    );
    this.client
      .login(credentials.token)
      .then(this.onLogin.bind(this.client))
      .catch(this.onLoginErr.bind(this.client));

    this.client.on("ready", async () => {
      await this.setPresence(prefix);
      this.onReady(this.client);

      // TODO wait for discord.js v13
      // this.registerCommands(this.handler);
    });
  }

  protected async setPresence(prefix: string) {
    await this.client.user.setPresence({
      status: "online",
      activity: {
        name: `${prefix}help`,
        type: "LISTENING",
      },
      afk: false,
    });
  }

  protected onReady(client: Client) {
    console.log("ready [%s]", client.readyTimestamp);
  }
  protected onLogin(this: Client) {
    console.log(`Successfully logged in as ${this.user.tag}`);
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
