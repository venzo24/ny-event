'use strict';

const { EmbedBuilder } = require('discord.js');

const NewYear19User = require('../../models/NewYear19User');
const { Command } = require('@sapphire/framework');

module.exports = class PingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, description: 'top cookies' });
  }

  /**
   * @param {Command.Registry} registry Registry
   */
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(builder => builder.setName(this.name).setDescription(this.description), {
      guildIds: ['1179130438116196362'],
    });
  }

  /**
   * @param {Command.ChatInputCommandInteraction} ctx Interaction
   */
  async chatInputRun(ctx) {
    const usersTop = await NewYear19User.find({ guildId: ctx.guildId }, {}, { sort: { cookies: -1 }, limit: 5 }).lean();

    // 1const top5Users = allUsers.sort((user1, user2) => user2.cookies - user1.cookies).slice(0, 5);

    const embed = new EmbedBuilder({
      title: 'Самые талантливые кондитеры:',
      color: 0xeed6ea,
      description: usersTop.map((user, i) => `${i + 1}. <@${user.userId}> - ${user.cookies} 🍪`).join('\n'),
    });
    await ctx.reply({ embeds: [embed] });
  }
};
