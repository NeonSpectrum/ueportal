const rp = require('request-promise')
var credentials = {}

class Auth {
  constructor (sn, pass) {
    this.sn = sn
    this.pass = pass
  }

  login () {
    return new Promise(async (resolve, reject) => {
      let id = this._generateID()
      let jar = rp.jar()
      let { sn, pass } = this
      rp({
        uri: 'https://www.ue.edu.ph/myportal/checkUser.php',
        jar: jar,
        method: 'POST',
        form: {
          SN: this.sn,
          accesscode: this.pass,
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
            this.generatedID = id
            // this.removeDuplicate(sn)
            credentials[id] = { sn, pass, jar }
            resolve(true)
          }
        })
        .catch(err => resolve(false))
    })
  }

  get id () {
    return this.generatedID
  }

  removeDuplicate (sn) {
    let ids = Object.keys(credentials).filter(x => credentials[x].sn === sn)
    ids.forEach(id => {
      delete x[id]
    })
  }

  _generateID () {
    var text = ''
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    do {
      for (var i = 0; i < 32; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length))
      }
    } while (credentials[text])

    return text
  }
}

module.exports = { Auth, credentials }
