const rp = require('request-promise')
const cookie = require('cookie')
const cheerio = require('cheerio')
const { jars } = require('./auth')

class Portal {
  constructor (id) {
    this.id = id
  }

  getHTML (link) {
    return new Promise(async resolve => {
      let jar = jars[this.id]
      resolve(
        await rp({
          uri: link,
          jar: jar,
          transform: body => cheerio.load(body)
        })
      )
    })
  }

  get isExists () {
    if (jars[this.id]) {
      return true
    } else {
      return false
    }
  }

  destroy () {
    if (jars[this.id]) {
      console.log(Object.keys(jars))
      delete jars[this.id]
      console.log(Object.keys(jars))
      return true
    }
    return false
  }
}

module.exports = Portal
