import config, { dataDir } from "./config";
import Bot, { Options } from "./bot";

export default (
  options: Omit<Options, "intents"> = {},
  prefix = config.prefix
) =>
  new Bot(
    {
      token: config.token,
      applicationId: config.appid,
      publicKey: config.pubkey,
    },
    prefix,
    dataDir,
    { /* intents: ["GUILD_MEMBERS"], */ ...options } // TODO add Intents with djs 13
  );
