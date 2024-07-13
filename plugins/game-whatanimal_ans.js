const similarity = require('similarity')
const threshold = 0.72
let handler = m => m
handler.before = async function (m, {
  conn,
  users
}) {
  let id = m.chat
  conn.whatanimal = conn.whatanimal ? conn.whatanimal : {}
  if (m.quoted && /animalclue untuk bantuan/i.test(m.quoted.text) && !m.fromMe) {
    if (!(id in conn.whatanimal) && /animalclue untuk bantuan/i.test(m.quoted.text)) return m.reply('Soal itu telah berakhir')
    if (m.quoted.id == conn.whatanimal[id][0].id) {
      if (['Timeout', ''].includes(m.text)) return !0
      let json = JSON.parse(JSON.stringify(conn.whatanimal[id][1]))
      if (m.text.toLowerCase() == json.data.title.toLowerCase().trim()) {
        await m.reply(`*Benar*, *+ ${Func.formatNumber(conn.whatanimal[id][2])} Exp*`).then(() => {
          users.exp += conn.whatanimal[id][2]
          clearTimeout(conn.whatanimal[id][3])
          delete conn.whatanimal[id]
        })
      } else if (similarity(m.text.toLowerCase(), json.data.title.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
      else m.reply(`*Salah!*`)
    }
  }
  return !0
}
handler.exp = 0
module.exports = handler