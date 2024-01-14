'use strict';

const { isMessageInstance } = require('@sapphire/discord.js-utilities');
const { Command } = require('@sapphire/framework');

module.exports = class PingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, description: 'Ping bot to see if it is alive' });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(builder => builder.setName(this.name).setDescription(this.description));
  }

  /**
   * @param {Command.ChatInputCommandInteraction} interaction Interaction
   */
  async chatInputRun(interaction) {
    const msg = await interaction.reply({ content: `Ping?`, fetchReply: true });

    if (isMessageInstance(msg)) {
      const diff = msg.createdTimestamp - interaction.createdTimestamp;
      const ping = Math.round(this.container.client.ws.ping);
      return interaction.editReply(`Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
    }

    return interaction.editReply('Failed to retrieve ping :(');
  }
};
