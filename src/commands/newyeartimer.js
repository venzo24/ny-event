'use strict';

const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

module.exports = class PingCommand extends Command {
  constructor(context, options) {
    super(context, { ...options, description: 'Time to new year' });
  }

  /**
   * @param {Command.Registry} registry Registry
   */
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(builder => builder.setName(this.name).setDescription(this.description));
  }

  /**
   * @param {Command.ChatInputCommandInteraction} interaction Interaction
   */
  async chatInputRun(interaction) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder({
          color: 0xfcdcb4,
          fields: [
            {
              name: '❄️До нового года',
              value: `**${this.timeToNewYear}**`,
              inline: true,
            },
            {
              name: '☃️До рождества осталось',
              value: `**${this.timeToChristmas}**`,
              inline: true,
            },
          ],
          image: {
            url: 'https://i.imgur.com/AfFp7pu.png',
          },
        }),
      ],
      fetchReply: true,
    });
  }

  get timeToNewYear() {
    return timeToString(new Date(2024, 0, 1) - new Date());
  }

  get timeToChristmas() {
    return timeToString(new Date(2023, 11, 25) - new Date());
  }
};

/**
 * @param {number} timestamp Date timestamp
 * @returns {string}
 */
function timeToString(timestamp) {
  let str = '';
  const days = Math.floor(timestamp / (24 * 60 * 60 * 1000));
  if (days !== 0) {
    if (days % 10 === 1 && days !== 11) str += `${days} день `;
    else if (days % 10 === 0 || (days >= 11 && days <= 14) || days % 10 >= 5) str += `${days} дней `;
    else if (days % 10 <= 4) str += `${days} дня `;
  }
  timestamp %= 24 * 60 * 60 * 1000;
  const hours = Math.floor(timestamp / (60 * 60 * 1000));
  if (hours !== 0) {
    if (hours % 10 === 1 && hours !== 11) str += `${hours} час `;
    else if (hours % 10 === 0 || (hours >= 11 && hours <= 14) || hours % 10 >= 5) str += `${hours} часов `;
    else if (hours % 10 <= 4) str += `${hours} часа `;
  }
  timestamp %= 60 * 60 * 1000;
  const minutes = Math.floor(timestamp / (60 * 1000));
  if (minutes !== 0) {
    if (minutes % 10 === 1 && minutes !== 11) str += `${minutes} минута `;
    else if (minutes % 10 === 0 || (minutes >= 11 && minutes <= 14) || minutes % 10 >= 5) str += `${minutes} минут `;
    else if (minutes % 10 <= 4) str += `${minutes} минуты `;
  }
  timestamp %= 60 * 1000;
  const seconds = Math.floor(timestamp / 1000);
  if (seconds !== 0) {
    if (seconds % 10 === 1 && seconds !== 11) str += `${seconds} секунда `;
    else if (seconds % 10 === 0 || (seconds >= 11 && seconds <= 14) || seconds % 10 >= 5) str += `${seconds} секунд `;
    else if (seconds % 10 <= 4) str += `${seconds} секунды `;
  }
  return str.trim();
}
