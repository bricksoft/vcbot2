import { ObjectMap } from "./ObjectMap";

export class GuildConfig extends ObjectMap<
  string,
  { channels: Set<string>; roles: Set<string> }
> {
  get(key: string) {
    if (!this.has(key)) {
      this.set(key, {
        channels: new Set(),
        roles: new Set(),
      });
    }

    return super.get(key);
  }
}
