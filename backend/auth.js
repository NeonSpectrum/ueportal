const rp = require('request-promise')
var jars = {}

class Auth {
  constructor (sn, pass) {
    this.sn = sn
    this.pass = pass
  }

  login () {
    return new Promise(async (resolve, reject) => {
      let id = this._generateID()
      jars[id] = rp.jar()
      rp({
        uri: 'https://www.ue.edu.ph/myportal/checkUser.php',
        jar: jars[id],
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
              jar: jars[id]
            })
            this.generatedID = id
            resolve(true)
          }
        })
        .catch(err => resolve(false))
    })
  }

  get id () {
    return this.generatedID
  }

  _generateID () {
    var text = ''
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    do {
      for (var i = 0; i < 32; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length))
      }
    } while (jars[text])

    return text
  }
}

module.exports = { Auth, jars }
