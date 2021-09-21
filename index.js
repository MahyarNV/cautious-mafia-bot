const { Client, Intents, MessageEmbed } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = process.env.PREFIX;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildCreate', async guild => {
    await guild.systemChannel.send(`Hello, I'm CautiousMafia bot made by Mahyar! Thanks for inviting me.`)
});

client.on('messageCreate', async message => {
    if (await !message.guild) return;
    if (await message.author.bot) return;
    if (await !message.content.startsWith(prefix)) return;

    const commandBody = await message.content.slice(prefix.length);
    const args = await commandBody.split(' ');
    const command = await args.shift().toLowerCase();

    const channel = message.channel;

    let god_role = await message.guild.roles.cache.find(r => r.id === process.env.GOD_ROLE_ID);
    let players_role = await message.guild.roles.everyone;
    
    
    if (command === 'help') {
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('CautiousMafia Help')
            .setAuthor('CautiousMafia', 'https://i.imgur.com/lHz2gI7.png')
            .setDescription('You can see a full list of commands here:')
            .setThumbnail('https://i.imgur.com/lHz2gI7.png')
            .addFields(
                { name: '`createRoles`', value: 'Use it in the first time you want to create needed roles for bot.' },
                { name: '`open`', value: 'Open channel for players.', inline: true },
                { name: '`close`', value: 'Close channel for players.', inline: true },
                { name: '`resetChannels`', value: 'Reset channels for next match.', inline: true },
                { name: '`unlock`', value: 'Open channel for players.', inline: true },
                { name: '`lock`', value: 'Close channel for players.', inline: true },
                { name: '`reset`', value: 'Reset channels for next match.', inline: true },
                { name: 'Prefix', value: 'Prefix: `?`' },
                { name: 'Usage', value: 'command + prefix. ex: `?open`' },
            )
            .setTimestamp()
            .setFooter('MahyarNV');

        channel.send({ embeds: [exampleEmbed] });
    }

    
    else if (command === 'ping') {
        await message.react('🏓');
    }

    
    else if (command === 'createroles') {
        role = await message.guild.roles.create({
            name: 'GOD',
            color: 'WHITE'
        });
        await message.react('✅');
    }

    
    else if (command === 'close' || command === 'lock') {
        if (await message.member.roles.cache.some(r => r.id === god_role.id)) {
            await message.channel.permissionOverwrites.edit(
                players_role,
                { SEND_MESSAGES: false }
            );
            await message.react('✅');
        } else {
            await message.react('⛔');
            await setTimeout(await function(){ 
                message.delete();
            }, 3000);
        }
    }

    
    else if (command === 'open' || command === 'unlock') {
        if (await message.member.roles.cache.some(r => r.id === god_role.id)) {
            await message.channel.permissionOverwrites.edit(
                players_role,
                { SEND_MESSAGES: true }
            );
            await message.react('✅');
        } else {
            await message.react('⛔');
            await setTimeout(await function(){ 
                message.delete();
            }, 3000);
        }
    }

    
    else if (command === 'resetchannels' || command === 'reset') {
        if (await !message.member.roles.cache.some(r => r.id === god_role.id)) {
            await message.react('⛔');
            await setTimeout(await function(){ 
                message.delete();
            }, 3000);
        } else {
            let day_channel = await message.guild.channels.cache.find(r => r.name === `day`);
            let vote_channel = await message.guild.channels.cache.find(r => r.name === `vote`);

            if (!day_channel && !vote_channel) {
                await message.reply(`I couldn't find the "vote" or "day" channel, delete them manually.`);
            }
            else {
                await day_channel.delete()
                    .catch(err => {
                        console.error(err);
                    });
                await vote_channel.delete()
                    .catch(err => {
                        console.error(err);
                    });
            }

            mafia_category = await message.guild.channels.cache.find(c => c.id == process.env.MAFIA_CAT && c.type == "GUILD_CATEGORY");

            day_channel = await message.guild.channels.create(
                'day',  { type: "text" }
            );
            vote_channel = await message.guild.channels.create(
                'vote',  { type: "text" }
            );

            let embed_message = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('یادآوری:')
                .setDescription(
                    `برای گرفتن نوبت صحبت در روز طبق صحبت های خدا عمل کنید.
                    برای اعلام نظر خود روی نوبت طرف مقابل لایک یا دیسلایک بگذارید.`
                )
                .setTimestamp()

            day_channel.send({ embeds: [embed_message] });

            embed_message = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('یادآوری:')
                .setDescription(
                    `برای شرکت در رای گیری ها در این چنل پیام دهید.`
                )
                .setTimestamp()

            vote_channel.send({ embeds: [embed_message] });

            if (mafia_category && vote_channel && day_channel) {
                await vote_channel.setParent(mafia_category.id);
                await day_channel.setParent(mafia_category.id);
            }
        }
    }


    else {
        await message.react('❓');
        await message.reply(`Hey <@${message.author.id}>, This command is wrong! @_@`);
    }
});

client.login(process.env.CLIENT_TOKEN);