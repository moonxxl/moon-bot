let handler = async (m, {
   conn,
   usedPrefix,
   command,
   args,
   Func
}) => {
   conn.math = conn.math ? conn.math : {}
   if (args.length < 1) return m.reply(`Mode : ${Object.keys(modes).join(' | ')}\n\nContoh penggunaan : ${usedPrefix}math medium`)
   let mode = args[0].toLowerCase()
   if (!(mode in modes)) return m.reply(`Mode : ${Object.keys(modes).join(' | ')}\n\nContoh penggunaan : ${usedPrefix}math medium`)
   let id = m.chat
   if (id in conn.math) return conn.reply(m.chat, '^ Masih ada soal belum terjawab di chat ini', conn.math[id][0])
   let math = genMath(mode)
   let p = `乂  *M A T H*\n\n`
   p += `Berapa hasil dari *${math.str}*\n\n`
   p += `Waktu : [ *${(math.time / 60 / 1000)} menit* ]\n`
   p += `Balas pesan ini untuk menjawab.`
   conn.math[id] = [
      await conn.reply(m.chat, p, m),
      math,
      4,
      setTimeout(() => {
         if (conn.math[id]) conn.reply(m.chat, `*Waktu habis!*`, conn.math[id][0])
         delete conn.math[id]
      }, math.time),
   ]
}
handler.help = ['math']
handler.tags = ['game']
handler.limit = handler.game = handler.group = handler.register = true
module.exports = handler

let modes = {
   noob: [-3, 3, -3, 3, '+-', 15000, 10],
   easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
   medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
   hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
   extreme: [-999999, 999999, -999999, 999999, '*/', 30000, 9999],
   impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000,],
   impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000,],
}

let operators = {
   '+': '+',
   '-': '-',
   '*': '×',
   '/': '÷',
}

function genMath(mode) {
   let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
   let a = randomInt(a1, a2)
   let b = randomInt(b1, b2)
   let op = pickRandom([...ops])
   let result = new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`)()
   if (op == '/') [a, result] = [result, a]
   return {
      str: `${a} ${operators[op]} ${b}`,
      mode,
      time,
      bonus,
      result,
   }
}

function randomInt(from, to) {
   if (from > to) [from, to] = [to, from]
   from = Math.floor(from)
   to = Math.floor(to)
   return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
   return list[Math.floor(Math.random() * list.length)]
}