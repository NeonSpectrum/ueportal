const rp = require('request-promise')
const cookie = require('cookie')
const cheerio = require('cheerio')
const { credentials } = require('./auth')

class Portal {
  constructor (id) {
    this.id = id
  }

  getHTML (link) {
    return new Promise(async resolve => {
      let jar = credentials[this.id].jar
      let $ = await rp({
        uri: link,
        jar: jar,
        transform: body => cheerio.load(body)
      })
      if ($('form[name=loginform]').length !== 0) {
        await this.refresh()
        this.getHTML(link)
      } else {
        resolve($)
      }
    })
  }

  get isExists () {
    return Boolean(credentials[this.id])
  }

  refresh () {
    return new Promise(async (resolve, reject) => {
      let { sn, pass, jar } = credentials[this.id]
      rp({
        uri: 'https://www.ue.edu.ph/myportal/checkUser.php',
        jar: jar,
        method: 'POST',
        form: {
          SN: sn,
          accesscode: pass,
          portal: 'student'
        },
        json: true
      })
        .then(async json => {
          if (json.message == 'error') resolve(false)
          else {
            await rp({
              uri: 'https://www.ue.edu.ph/myportal/index.php?ia=' + json.ia,
              jar: jar
            })
            resolve(true)
          }
        })
        .catch(err => resolve(false))
    })
  }

  destroy () {
    if (credentials[this.id]) {
      delete credentials[this.id]
      return true
    }
    return false
  }
}

module.exports = Portal
