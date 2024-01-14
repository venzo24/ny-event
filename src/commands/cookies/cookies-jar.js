'use strict';

const { EmbedBuilder } = require('discord.js');
const NewYear19Log = require('../../models/NewYear19Log');
const NewYear19User = require('../../models/NewYear19User');
const { Command } = require('@sapphire/framework');

module.exports = class PingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, description: 'cookies' });
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
          .addUserOption(option => option.setName('member').setDescription('Пользователь (упоминание или id)')),
      {
        guildIds: ['1179130438116196362'],
      },
    );
  }

  /**
   * @param {Command.ChatInputCommandInteraction} ctx Interaction
   */
  async chatInputRun(ctx) {
    const target = ctx.options.getMember('member');
    const options = { guildId: ctx.guildId, userId: target ? target.id : ctx.user.id };

    const logs = await NewYear19Log.find(options);

    let user = await NewYear19User.findOne(options);
    if (!user && !target) user = await NewYear19User.create(options);
    else if (!user && target) {
      await ctx.reply({ content: 'Пользователь не найден!', ephemeral: true });
      return;
    }

    await ctx.reply({
      embeds: [
        new EmbedBuilder({
          title: `${target ? 'C' : `Ваша c`}татистика ${target ? target.displayName : ''}`,
          description: `У ${target ? target.displayName : 'вас'} ${user.cookies} 🍪`,
          // eslint-disable-next-line no-extra-boolean-cast
          color: !!ctx.member.displayColor ? ctx.member.displayColor : 0xeed6ea,
          fields:
            logs.length && ctx.member.roles.cache.has('1184814652958449765')
              ? [
                  {
                    name: 'Последние логи',
                    value: `\`\`\`${logs
                      .sort((log1, log2) => +log1.createdAt - +log2.createdAt)
                      .map(
                        log =>
                          `[${log.createdAt.toLocaleDateString('ru-US', {
                            timeZone: 'Europe/Kiev',
                            options: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}] ${
                            log.editorId === ctx.client.user.id
                              ? 'Вы приготовили '
                              : log.editorId === log.userId
                                ? `Вы ${log.cookies[0] > log.cookies[1] ? 'отдали' : 'забрали'}`
                                : `${ctx.guild.members.cache.get(log.editorId)?.displayName ?? `[${log.editorId}]`} ${
                                    log.cookies[0] > log.cookies[1] ? 'забрал у вас' : 'дал вам'
                                  }:`
                          } ${
                            log.cookies[0] > log.cookies[1]
                              ? log.cookies[0] - log.cookies[1]
                              : log.cookies[1] - log.cookies[0]
                          } 🍪`,
                      )
                      .slice(0, 10)
                      .join('\n')}\`\`\``,
                  },
                ]
              : [],
        }),
      ],
    });
  }
};
