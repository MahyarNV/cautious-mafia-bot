const { Client, Intents, MessageEmbed } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildCreate', async guild => {
    await guild.systemChannel.send(`Hello, I'm CautiousMafia bot made by Mahyar! Thanks for inviting me.`)
});

client.on('messageCreate', async msg => {
    if (await !msg.guild) return;
    
    switch (msg.content) {
        case `${process.env.PREFIX}ping`:
            await msg.react('🏓');
            break;

        case `${process.env.PREFIX}createRoles`:
            role1 = await msg.guild.roles.create({
                name: 'GOD',
                color: 'WHITE'
            });
            role2 = await msg.guild.roles.create({
                name: 'PLAYER',
                color: 'BLACK'
            });
            await msg.react('✅');
            break;

        case `${process.env.PREFIX}close`:
            god_role = await msg.guild.roles.cache.find(r => r.id === process.env.GOD_ROLE_ID);
            player_role = await msg.guild.roles.cache.find(r => r.id === process.env.PLAYER_ROLE_ID);

            if (await msg.member.roles.cache.some(r => r.id === god_role.id)) {
                await msg.channel.permissionOverwrites.edit(
                    player_role,
                    { SEND_MESSAGES: false }
                );
                await msg.react('✅');
            } else {
                await msg.react('⛔');
                await setTimeout(await function(){ 
                    msg.delete();
                }, 3000);
            }
            break;

        case `${process.env.PREFIX}open`:
            god_role = await msg.guild.roles.cache.find(r => r.id === process.env.GOD_ROLE_ID);
            player_role = await msg.guild.roles.cache.find(r => r.id === process.env.PLAYER_ROLE_ID);
            roles = await msg.guild.roles;

            if (await msg.member.roles.cache.some(r => r.id === god_role.id)) {
                await msg.channel.permissionOverwrites.edit(
                    player_role,
                    { SEND_MESSAGES: true }
                );
                await msg.react('✅');
            } else {
                await msg.react('⛔');
                await setTimeout(await function(){ 
                    msg.delete();
                }, 3000);
            }

        case `${process.env.PREFIX}resetChannels`:
            let god_role = await msg.guild.roles.cache.find(r => r.id === process.env.GOD_ROLE_ID);

            if (await !msg.member.roles.cache.some(r => r.id === god_role.id)) {
                await msg.react('⛔');
                await setTimeout(await function(){ 
                    msg.delete();
                }, 3000);
                break;
            }

            let day_channel = await msg.guild.channels.cache.find(r => r.name === `day`);
            let vote_channel = await msg.guild.channels.cache.find(r => r.name === `vote`);
            let mafia_category = await msg.guild.channels.cache.find(c => c.id == process.env.MAFIA_CAT && c.type == "GUILD_CATEGORY");

            await day_channel.delete()
                .catch(err => {
                    console.error(err);
                });
            await vote_channel.delete()
                .catch(err => {
                    console.error(err);
                });

            day_channel = await msg.guild.channels.create(
                'day',  { type: "text" }
            );
            vote_channel = await msg.guild.channels.create(
                'vote',  { type: "text" }
            );

            const embed_msg = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('یادآوری:')
                .setDescription(
                    `برای گرفتن نوبت صحبت در روز طبق صحبت های خدا عمل کنید.
                    برای اعلام نظر خود روی نوبت طرف مقابل لایک یا دیسلایک بگذارید.`
                )
                .setTimestamp()

            vote_channel.send({ embeds: [embed_msg] });

            if (mafia_category && vote_channel && day_channel) {
                await vote_channel.setParent(mafia_category.id);
                await day_channel.setParent(mafia_category.id);
            }

            await msg.react('✅');

            break;

        case `${process.env.PREFIX}`:
            await msg.react('❓');
            await msg.reply(`Hey <@${msg.author.id}>, This command is wrong! @_@`);
            break;
    }
});

client.login(process.env.CLIENT_TOKEN);