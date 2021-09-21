const { Client, Intents, MessageEmbed } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildCreate', async guild => {
    await guild.systemChannel.send(`Hello, I'm CautiousMafia bot made by Mahyar! Thanks for inviting me.`)
});

client.on('messageCreate', async message => {
    if (await !message.guild) return;
    if (await message.author.bot) return;
    if (await !message.content.startsWith(process.env.PREFIX)) return;

    const commandBody = await message.content.slice(process.env.PREFIX.length);
    const args = await commandBody.split(' ');
    const command = await args.shift().toLowerCase();

    let god_role = await message.guild.roles.cache.find(r => r.id === process.env.GOD_ROLE_ID);
    let player_role = await message.guild.roles.cache.find(r => r.id === process.env.PLAYER_ROLE_ID);
    

    if (command === 'ping') {
        await message.react('🏓');
    }
    else if (command === 'createroles') {
        role1 = await message.guild.roles.create({
            name: 'GOD',
            color: 'WHITE'
        });
        role2 = await message.guild.roles.create({
            name: 'PLAYER',
            color: 'BLACK'
        });
        await message.react('✅');
    }


    else if (command === 'close') {
        if (await message.member.roles.cache.some(r => r.id === god_role.id)) {
            await message.channel.permissionOverwrites.edit(
                player_role,
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


    else if (command === 'open') {
        if (await message.member.roles.cache.some(r => r.id === god_role.id)) {
            await message.channel.permissionOverwrites.edit(
                player_role,
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


    else if (command === 'resetchannels') {
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

            const embed_message = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('یادآوری:')
                .setDescription(
                    `برای گرفتن نوبت صحبت در روز طبق صحبت های خدا عمل کنید.
                    برای اعلام نظر خود روی نوبت طرف مقابل لایک یا دیسلایک بگذارید.`
                )
                .setTimestamp()

            day_channel.send({ embeds: [embed_message] });

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