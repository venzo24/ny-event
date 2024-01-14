'use strict';

// eslint-disable-next-line no-unused-vars
const { Listener, SapphireClient } = require('@sapphire/framework');

module.exports = class ReadyListener extends Listener {
  /**
   * @param {SapphireClient} client Client
   */
  async run(client) {
    await client.guilds.fetch();
    for (const [, guild] of client.guilds.cache) {
      if (guild && guild.members.cache.size < guild.memberCount) {
        await guild.members.fetch();
        client.logger.debug(`Участники на сервере ${guild.name} получены! Кол-во: ${guild.memberCount}`);
      }
    }

    console.log(`Success loaded ${client.user.tag}`);
  }
};
