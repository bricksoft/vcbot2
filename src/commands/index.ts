import { Collection, Client } from "discord.js";
import { Command } from "../util/command";

import addRole from "./addrole";
import help from "./help";
import ping from "./ping";
import removeRole from "./removerole";
import unwatch from "./unwatch";
import watch from "./watch";

const cmd = {
  addRole,
  help,
  ping,
  removeRole,
  unwatch,
  watch,
};

export default (client: Client) => {
  const commands = new Collection(
    Object.keys(cmd).map((c) => {
      const command = new cmd[c](client) as Command;
      return [command.name, command];
    })
  );

  return commands;
};
