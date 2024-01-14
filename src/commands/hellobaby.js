'use strict';

const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class PingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, preconditions: ['OwnerOnly'] });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(builder => builder.setName('hellobaby').setDescription('hellobaby'));
  }

  /**
   * @param {Command.ChatInputCommandInteraction} interaction Interaction
   */
  async chatInputRun(interaction) {
    await interaction.reply({
      embeds: [new EmbedBuilder({ description: 'привет', color: 0x0099ff })],
      ephemeral: true,
      fetchReply: true,
    });
  }
}
module.exports = {
  PingCommand,
};
