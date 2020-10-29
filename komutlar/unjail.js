const Discord = require("discord.js")
const moment = require("moment")
const db = require("quick.db")
const osettings = require("../ayarlar.json")

module.exports.run = async(client,message,args) => {
const guild = message.guild;
const executor = message.member;
// Türkiye bura
//Embed
let oziemb = new Discord.MessageEmbed()
    .setAuthor(guild.name, guild.iconURL({dynamic: true}))
    .setFooter("Ozzy ❤️ Serendia", executor.user.displayAvatarURL({dynamic: true}))
    .setTimestamp()

//Gerekli IDLER!!!!! (Hazır proje değilse burayı doldurun)
let cezarolu = osettings.jailhammer || "jailhammerroluid"; 
let ujlog = osettings.cezalog || "logkanalı";
let brol = osettings.boosterrolu || "boosterrolid";
let ujrol = osettings.unjailverilecekrol || "unjailatıldıgındaverilecekrolid";
ujlog = guild.channels.cache.get(ujlog)
//
let cezarolismi = guild.roles.cache.get(cezarolu).name
let ujrolismi = guild.roles.cache.get(ujrol).name

if(!executor.hasPermission("ADMINISTRATOR") && !executor.roles.cache.has(cezarolu)) {
    return message.channel.send(oziemb.setDescription(`**Bu komutu kullanabilmek için ${cezarolismi} rolüne sahip olmalısınız.**`).setColor("RED")).then(x => x.delete({timeout:6500}));
}
//Kişi etiketli / idsi girili mi
let kisi = message.mentions.members.first() || guild.members.cache.get(args[0])
if(!kisi) {
    return message.channel.send(oziemb.setDescription(`**Lütfen hapisden çıkarılacak kişiyi etiketleyin veya bir ID giriniz.**`).setColor("RED")).then(x => x.delete({timeout:6500}));
}
let tarih = moment(message.createdAt).format("lll")
kisi.roles.cache.has(brol) ? kisi.roles.set([brol,ujrol]) : kisi.roles.set([ujrol]);
//Hapis açmayla ilgili mesajlarr
message.channel.send(oziemb.setDescription(`**${kisi} kullancısı başarıyla hapisten çıkartıldı ve ${ujrolismi} ismi verildi.**`).setColor("GREEN"));
ujlog.send(oziemb.setDescription(`**${kisi} kullancısının cezası ${executor} tarafından başarıyla kaldırıldı.\nT**`).setColor("GREEN"));
//Bitiş süresini ekleyelimmm

let cezano = db.fetch(`CezaNo_${guild.name}`);
db.set(`Hapiste_${guild.name}_${kisi.id}`, false)
for (i = cezano; i > 0; i--) {
    let ceza = db.fetch(`Ceza_${i}_${guild.name}`)
    if(ceza.cezalanan == kisi.id && ceza.tur == "Jail"){
        db.set(`Ceza_${i}_${guild.name}.bitistarihi`, Date.now())
        break;
    }
  }
}


exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["unkarantina","karantinaçıkar","karantinaaç"],
    permLevel: 0
  } // UnBan By Ozzy
  exports.help = {
    name: 'unjail',
    description: 'unjail kodu lo',
    usage: '.unjail id/@etiket'
  }
