import config from "./config";
import Bot, { Options } from "./bot";
import { join } from "path";

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
    join(__dirname, "../config"),
    { /* intents: ["GUILD_MEMBERS"], */ ...options }
  );
