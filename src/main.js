import fs from 'fs'
import PluginCommon from './plugin/common.js'
import PluginJjencode from './plugin/jjencode.js'
import PluginSojson from './plugin/sojson.js'
import PluginSojsonV7 from './plugin/sojsonv7.js'
import PluginObfuscator from './plugin/obfuscator.js'
import PluginAwsc from './plugin/awsc.js'

// 读取参数
let type = 'common'
let encodeFile = 'input.js'
let decodeFile = 'output.js'
for (let i = 2; i < process.argv.length; i += 2) {
  if (process.argv[i] === '-t') {
    type = process.argv[i + 1]
  }
  if (process.argv[i] === '-i') {
    encodeFile = process.argv[i + 1]
  }
  if (process.argv[i] === '-o') {
    decodeFile = process.argv[i + 1]
  }
}
console.log(`类型: ${type}`)
console.log(`输入: ${encodeFile}`)
console.log(`输出: ${decodeFile}`)

const plugins = {
  sojson: PluginSojson,
  sojsonv7: PluginSojsonV7,
  obfuscator: PluginObfuscator,
  awsc: PluginAwsc,
  jjencode: PluginJjencode,
}

const main = () => {
  let sourceCode = fs.readFileSync(encodeFile, { encoding: 'utf-8' })
  console.log(`文件大小: ${(Buffer.byteLength(sourceCode) / 1024 / 1024).toFixed(1)} MB`)

  const plugin = plugins[type] || PluginCommon
  const code = plugin(sourceCode)

  sourceCode = null
  if (typeof globalThis.gc === 'function') {
    globalThis.gc()
  }

  if (code) {
    fs.writeFileSync(decodeFile, code)
    console.log(`输出完成: ${decodeFile}`)
  }
}

process.nextTick(async () => {
  main()
})
