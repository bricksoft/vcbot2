import { Client, Collection, VoiceChannel, VoiceState } from "discord.js";
import { writeFileSync, accessSync, statSync, mkdirSync } from "fs";
import { dirname } from "path";

export class ChannelWatchList {
  // #channels = new Set<VoiceChannel>();
  #channels = new Set<string>();
  #roles = new Set<string>();
  // #ready: Promise<void> = Promise.resolve();

  public get channels() {
    return this.#channels;
  }

  public get roles() {
    return this.#roles;
  }

  constructor(
    private client: Client,
    private file: string,
    channels: (string | VoiceChannel)[] | Set<string | VoiceChannel> = [],
    roles: string[] = []
  ) {
    // this.#ready = this.watch(...channels);
    const { channels: _channels, roles: _roles } = this.parse();

    this.addRoles(...new Set([...roles, ..._roles])).then(() =>
      this.watch(...new Set([...channels, ..._channels]))
    );
  }

  private parse() {
    let channels = [];
    let roles = [];
    try {
      const config = require(this.file);
      if (config.channels && Array.isArray(config.channels))
        channels = config.channels;

      if (config.roles && Array.isArray(config.roles)) roles = config.roles;
    } catch (error) {}
    return { channels, roles };
  }

  // private async resolveChannels(
  //   channels: (string | VoiceChannel)[] | Set<string | VoiceChannel>
  // ) {
  //   return await Promise.all(
  //     [...new Set(channels)].map(async (channel) => {
  //       if (typeof channel === "string") {
  //         const [guildId, channelId] = channel.split(";");
  //         const guild = await this.client.guilds.fetch(guildId, true);
  //         channel = guild.channels.resolve(channelId) as VoiceChannel;
  //       }
  //       return channel;
  //     })
  //   );
  // }

  private async serialize() {
    const json = JSON.stringify({
      channels: [...this.#channels] /* .map((c) => c.id) */,
      roles: [...this.#roles],
    });
    const statDir = statSync(dirname(this.file));

    if (!statDir.isDirectory()) {
      mkdirSync(dirname(this.file));
    }
    writeFileSync(this.file, json);
  }

  // public async ready() {
  //   await this.#ready;
  // }

  public async watch(...channels: (VoiceChannel | string)[]) {
    // const add = await this.resolveChannels(channels);
    channels.forEach((channel) =>
      this.#channels.add(typeof channel === "string" ? channel : channel.id)
    );
    await this.serialize();
  }

  public async unwatch(...channels: (VoiceChannel | string)[]) {
    // const remove = await this.resolveChannels(channels);
    channels.forEach((channel) =>
      this.#channels.delete(typeof channel === "string" ? channel : channel.id)
    );
    await this.serialize();
  }

  public async addRoles(...roles: string[]) {
    roles.forEach((role) => this.#roles.add(role));
    await this.serialize();
  }

  public async removeRoles(...roles: string[]) {
    roles.forEach((role) => this.#roles.delete(role));
    await this.serialize();
  }

  public handleVoiceStateChange(_oldState: VoiceState, newState: VoiceState) {
    const watchedChannels = [...this.#channels];
    const watcherRoles = [...this.#roles];

    if (!watchedChannels.length) return;

    try {
      // user joins a watched voice channel
      if (
        newState.channelID !== null &&
        watchedChannels.includes(newState.channelID)
      ) {
        // console.log("adding roles: %o", watcherRoles);
        newState.member.roles.add(watcherRoles);
      }

      // user leaves a watched voice channel
      else if (
        newState.channelID === null ||
        !watchedChannels.includes(newState.channelID)
      ) {
        // console.log("removing roles: %o", watcherRoles);
        newState.member.roles.remove(watcherRoles);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
