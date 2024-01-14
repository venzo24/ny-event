'use strict';

const { Command } = require('@sapphire/framework');
const muteInfo = require('../../models/muteInfo');
module.exports = class PingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, description: 'take cookies', preconditions: ['modOnly'] });
  }

  /**
   * @param {Command.Registry} registry Registry
   */
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      builder =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addUserOption(option =>
            option.setName('member').setDescription('Пользователь (упоминание или id)').setRequired(true),
          )
          .addIntegerOption(option => option.setName('time').setDescription('Время').setRequired(true))
          .addStringOption(option => option.setName('reason').setDescription('Причина').setRequired(true)),

      {
        guildIds: ['1179130438116196362'],
      },
    );
  }
  /**
   * @param {Command.ChatInputCommandInteraction} ctx Interaction
   */
  async chatInputRun(ctx) {
    // 1
  }
};
