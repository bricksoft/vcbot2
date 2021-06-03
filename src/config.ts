import Config, { IConfig } from "config";
import { ENOAPPID, ENOPUBKEY, ENOTOKEN } from "./util/error";

export type ConfigSchema = {
  appid: string;
  pubkey: string;
  token: string;
  prefix: string;
  channels: string[];
};

const config = Config as IConfig & ConfigSchema;

// check if token is set
if (!config.has("token") || config.token.length === 0) {
  throw new ENOTOKEN();
}
// check if application id is set
if (!config.has("appid") || config.appid.length === 0) {
  throw new ENOAPPID();
}
// check if public key is set
if (!config.has("pubkey") || config.pubkey.length === 0) {
  throw new ENOPUBKEY();
}

if (!config.has("prefix")) {
  config.prefix = "!";
}

if (!config.has("channels") || !Array.isArray(config.channels)) {
  config.channels =
    typeof config.channels === "string" ? [config.channels] : [];
}

export default config;
