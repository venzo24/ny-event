'use strict';

const { EmbedBuilder } = require('@discordjs/builders');
const NewYear19Log = require('../../models/NewYear19Log');
const NewYear19User = require('../../models/NewYear19User');
const { Command } = require('@sapphire/framework');

module.exports = class PingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, description: 'get cookies' });
    this.cooldown = 60 * 60 * 1000;
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
    const lastLog = await NewYear19Log.findOne(
      { guildId: ctx.guildId, userId: ctx.user.id },
      {},
      { sort: { createdAt: -1 } },
    );

    if (
      lastLog &&
      lastLog.editorId === ctx.client.user.id &&
      +lastLog.createdAt + this.cooldown > new Date().getTime()
    ) {
      await ctx.reply({
        embeds: [
          new EmbedBuilder({
            title: 'Заголовок',
            description: `До нужной температуры для выпекания осталось подождать <t:${(
              (+lastLog.createdAt + this.cooldown) /
              1000
            ).toFixed(0)}:R> минут`,
            footer: {
              text: 'RoboVenzo',
              icon_url: ctx.client.user.displayAvatarURL(),
            },
          }),
        ],
      });
      return;
    }

    const options = { guildId: ctx.guildId, userId: ctx.user.id };

    let user = await NewYear19User.findOne(options);
    if (!user) user = await NewYear19User.create(options);

    const cookiesGained = Math.floor(Math.random() * (10 - 5) + 5);

    await NewYear19Log.create({
      ...options,
      editorId: ctx.client.user.id,
      cookies: [user.cookies, user.cookies + cookiesGained],
    });

    await user.updateOne({ $inc: { cookies: cookiesGained } });

    await ctx.reply({
      embeds: [
        new EmbedBuilder({
          title: 'Ваши кулинарные навыки на высоте! ',
          description: `Вы испекли ${cookiesGained} печенек.`,
          color: 0xeed6ea,
          footer: {
            text: 'RoboVenzo',
            icon_url: ctx.client.user.displayAvatarURL(),
          },
        }),
      ],
    });
  }
};
