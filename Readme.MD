# VC-ROLE-BOT

This bot allows you to give users roles when they join selected channels.

Configuration of this bot is done by [node-config](https://github.com/lorenwest/node-config) please have a look there to find out more about how you can customize it.
Default values are provided by environment and have fallback strings.

## Setup

To create a working instance of this bot you need to create a docker container.

Volumes:

- /config : here you can place your bot [config](#config) instead of passing it through environment variables

```shell
$ docker run \
    -v /path/to/your/config:/config \       # optional
    -e APPID=your_application_id \              # not yet used
    -e PUBKEY=your_public_key \                 # not yet used
    -e PREFIX=your_command_prefix \             # optional
    -e TOKEN=your_bot_token \
    --name myvcbot \                            # optional
    bricksoft/vcbot
```

By attaching a volume you can provide your token in a config file like so:

```json
{
  "appid": "123456780ß", // not yet used
  "pubkey": "e54768zrhwefsz9h2iqawdf9zhuqwre", // not yet used
  "token": "abcdef123123.abcdef.abcdef1234abcdef12345",
  "prefix": "vc!" // optional
}
```

Create the file `production.json` in your config directory and enter your settings.
Next run docker command to start the bot:

```shell
$ docker run \
    -v /path/to/your/config:/config \
    --name myvcbot \                            # optional
    bricksoft/vcbot
```

## Configuration

Once you got the bot up and running you may want to setup the bot to actually manage your voice chat roles.
The default command prefix is `vc!`. You can run commands by typing the command prefix followed by the command name without spaces, e.g

to add roles to users when they join you can run this command:

> `<your bot prefix>`addRole `<id of role to manage>`

next add voice channels to watch by the bot:

> `<your bot prefix>`watch `<id of voice chat>`

And that's it! Your bot will now watch your voice channels.
