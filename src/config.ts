import Config, { IConfig } from "config";
import { dirname, join, resolve } from "path";
import { /* ENOAPPID, ENOPUBKEY, */ ENOTOKEN } from "./util/error";

export type ConfigSchema = {
  appid: string;
  pubkey: string;
  token: string;
  prefix: string;
  channels: string[];
};

const config = Config as IConfig & ConfigSchema;
export const dataDir =
  (process.env.DATA_DIR && resolve(dirname(__dirname), process.env.DATA_DIR)) ||
  join(__dirname, "../data");

// check if token is set
if (!config.has("token") || config.token.length === 0) {
  throw new ENOTOKEN();
}
// check if application id is set
if (!config.has("appid") || config.appid.length === 0) {
  // throw new ENOAPPID(); // TODO enable when slash is ready
}
// check if public key is set
if (!config.has("pubkey") || config.pubkey.length === 0) {
  // throw new ENOPUBKEY(); // TODO enable when slash is ready
}

if (!config.has("prefix")) {
  config.prefix = "!";
}

export default config;
