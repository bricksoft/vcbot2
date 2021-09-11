import { Client, VoiceChannel, VoiceState } from "discord.js";
import { writeFile, stat, mkdir } from "fs/promises";
import { dirname } from "path";
import { GuildConfig } from "./guildConfig";

export class ChannelWatchList {
  #config = new GuildConfig();
  
  constructor(
    client: Client,
    private file: string
  ) {
    // this.#ready = this.watch(...channels);
    /*  const { channels: _channels, roles: _roles } =  */
    this.parse();
    // this.#channels.merge(channels);
    // this.#roles.merge(roles);
    this.serialize();
    
    client.on(
      "voiceStateUpdate",
      this.onVoiceStateChange.bind(this)
    );
  }

  private parse() {
    try {
      const config = require(this.file);
      
      if(config && "guilds" in config){
        const guilds: ([string, {channels: string[],roles: string[]}])[] = config.guilds;

        if(Array.isArray(guilds) && guilds.length){
          guilds.forEach(([id, { channels, roles }]) => {
            this.#config.set(id as string, { channels: new Set(channels || []), roles: new Set(roles || []) });
          });
        }
      }
    } catch (error) {}

    // this.mergeRoles(roles.merge(_roles)).then(()=>{
    //   this.mergeChannels(channels.merge(_channels));
    // });
    // return { channels, roles };
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
    await mkdir(dirname(this.file),{ recursive:true });
    const json = JSON.stringify({
      guilds: [...this.#config.keys()].map<[string, {channels:string[], roles:string[]}]>(k => {
        const config = this.#config.get(k);
        return [k, {
          channels: [...config.channels],
          roles: [...config.roles]
        }];
      })
    });
    const statDir = await stat(dirname(this.file));

    if (!statDir.isDirectory()) {
      await mkdir(dirname(this.file));
    }
    await writeFile(this.file, json);
  }

  public async addChannel(guild:string, ...channels: (VoiceChannel | string)[]) {
    // const add = await this.resolveChannels(channels);
    const config = this.#config.get(guild);

    channels.forEach((channel) =>
      config.channels.add(typeof channel === "string" ? channel : channel.id)
    );

    this.#config.set(guild, config);
    await this.serialize();
    return [...config.channels]
  }

  public async removeChannel(guild:string, ...channels: (VoiceChannel | string)[]) {
    // const remove = await this.resolveChannels(channels);
    const config = this.#config.get(guild);
    const result = channels.map<[string, boolean]>(channel => {
      const id = typeof channel === "string" ? channel : channel.id; 
      return [id, config.channels.delete(id)]
    });

    this.#config.set(guild, config);
    await this.serialize();
    return result;
  }

  public async addRoles(guild:string, ...roles: string[]) {
    const config = this.#config.get(guild);
    
    roles.forEach(role => config.roles.add(role));
    this.#config.set(guild, config);
    await this.serialize();
    return [...config.roles]
  }
  
  public async removeRoles(guild:string, ...roles: string[]) {
    const config = this.#config.get(guild);
    const result = roles.map<[string, boolean]>(role => { 
      return [role, config.roles.delete(role)]
    });
    
    this.#config.set(guild, config);
    await this.serialize();
    return result;
  }

  public onVoiceStateChange(_oldState: VoiceState, newState: VoiceState) {
    const guild = newState.guild.id;
    const config = this.#config.get(guild);

    if (!config.channels.size) return;

    try {
      // user joins a watched voice channel
      if (
        newState.channelID !== null &&
        config.channels.has(newState.channelID)
      ) {
        // console.log("adding roles: %o", watcherRoles);
        newState.member.roles.add([...config.roles]);
      }

      // user leaves a watched voice channel
      else if (
        newState.channelID === null ||
        !config.channels.has(newState.channelID)
      ) {
        // console.log("removing roles: %o", watcherRoles);
        newState.member.roles.remove([...config.roles]);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
