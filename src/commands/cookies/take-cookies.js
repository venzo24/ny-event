'use strict';

const NewYear19User = require('../../models/NewYear19User');
const NewYear19Log = require('../../models/NewYear19Log');
const { Command } = require('@sapphire/framework');

module.exports = class PingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, description: 'take cookies', preconditions: ['headModOnly'] });
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
          .addIntegerOption(option =>
            option
              .setName('amount')
              .setDescription('Количество печенек')
              .setRequired(true)
              .setMinValue(1)
              .setMaxValue(50),
          ),

      {
        guildIds: ['1179130438116196362'],
      },
    );
  }

  /**
   * @param {Command.ChatInputCommandInteraction} ctx Interaction
   */
  async chatInputRun(ctx) {
    const target = ctx.options.getUser('member');
    const amount = ctx.options.getInteger('amount');

    if (!target) {
      await ctx.reply({ content: 'Пользователь не найден!', ephemeral: true });
      return;
    } else if (ctx.user.id === target.id) {
      await ctx.reply({ content: 'Вы не можете забрать у себя печенье!', ephemeral: true });
      return;
    }

    const [user, recipient] = await Promise.all([
      await NewYear19User.findOne({ guildId: ctx.guildId, userId: ctx.user.id }),
      await NewYear19User.findOne({ guildId: ctx.guildId, userId: target.id }),
    ]);

    if (!recipient) {
      ctx.reply({ content: `Пользователь с Id ${target.id} не существует`, ephemeral: true });
      return;
    } else if (amount > recipient.cookies) {
      await ctx.reply({ content: 'Вы не можете забрать больше печенья чем имеется у пользователя!', ephemeral: true });
      return;
    }

    await Promise.all([
      await NewYear19Log.create({
        guildId: ctx.guildId,
        userId: target.id,
        editorId: ctx.user.id,
        cookies: [recipient.cookies, recipient.cookies - amount],
      }),
      await NewYear19Log.create({
        guildId: ctx.guildId,
        userId: ctx.user.id,
        editorId: ctx.user.id,
        cookies: [user.cookies, user.cookies + amount],
      }),
    ]);

    await Promise.all([
      await user.updateOne({ $inc: { cookies: +amount } }),
      await recipient.updateOne({ $inc: { cookies: -amount } }),
    ]);

    await ctx.reply(`Вы успешно отобрали ${amount} печенек у пользователя ${target.username}`);
  }
};
