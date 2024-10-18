module.exports = {
   help: ['prompter'],
   use: 'reply photo',
   tags: ['tools'],
   command: /^(prompter)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      Scraper,
      Func
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               m.react('🕒')
               let old = new Date()
               let img = await conn.downloadMediaMessage(q)
               let image = await Scraper.uploader(img)
               const json = await Api.get('api/prompter', {
                  image: image.data.url
               })
               if (!json.status) return m.reply(Func.jsonFormat(json))
               let result = json.data[0].content.parts[0].text
               conn.reply(m.chat, Func.jsonFormat(result), m)
            } else conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return conn.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return conn.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            m.react('🕒')
            let old = new Date()
            let img = await q.download()
            let image = await Scraper.uploader(img)
            const json = await Api.get('api/prompter', {
               image: image.data.url
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            let result = json.data[0].content.parts[0].text
            conn.reply(m.chat, Func.jsonFormat(result), m)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   premium: true,
}