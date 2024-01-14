'use strict';
// eslint-disable-next-line no-unused-vars
const { Precondition, Command } = require('@sapphire/framework');
const { GuildMember } = require('discord.js');

module.exports = class OwnerOnlyPrecondition extends Precondition {
  /**
   * @param {Command.ChatInputCommandInteraction} interaction ChatInputCommandInteraction
   * @returns {void}
   */
  chatInputRun(interaction) {
    if (!(interaction.member instanceof GuildMember)) return this.error();

    const headModRoles = ['1182790100967493762'];

    return interaction.member.roles.cache.hasAny(...headModRoles)
      ? this.ok()
      : this.error(interaction.reply({ content: 'у вас нет прав', ephemeral: true }));
  }
};
