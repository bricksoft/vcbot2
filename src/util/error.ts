export class ENOTOKEN extends Error {
  constructor() {
    super("missing discord bot token");
    this.name = "ENOTOKEN";
    Error.captureStackTrace(this, ENOTOKEN);
  }
}
export class ENOAPPID extends Error {
  constructor() {
    super("missing discord bot applicationId");
    this.name = "ENOAPPID";
    Error.captureStackTrace(this, ENOAPPID);
  }
}
export class ENOPUBKEY extends Error {
  constructor() {
    super("missing discord bot publicKey");
    this.name = "ENOPUBKEY";
    Error.captureStackTrace(this, ENOPUBKEY);
  }
}

export class ECLFAIL extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ECLFAIL";
    Error.captureStackTrace(this, ECLFAIL);
  }
}

export class ECMDFAIL extends Error {
  constructor(command: string, error: Error, capture: boolean = false) {
    super(`failed to execute command '${command}': ${error.message}`);
    this.stack = error.stack;
    this.name = "ECMDFAIL";
    if (capture) {
      Error.captureStackTrace(this, ECMDFAIL);
    }
  }
}
