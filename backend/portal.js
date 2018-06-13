const rp = require('request-promise')
const cheerio = require('cheerio')

class Portal {
  constructor (sn, pass) {
    this.sn = sn
    this.pass = pass
    this.jar = rp.jar()
  }

  login () {
    return new Promise(async (resolve, reject) => {
      rp({
        uri: 'https://www.ue.edu.ph/myportal/checkUser.php',
        jar: this.jar,
        method: 'POST',
        form: {
          SN: this.sn,
          accesscode: this.pass,
          portal: 'student'
        },
        json: true
      })
        .then(async json => {
          if (json.message == 'error') reject()
          else {
            await rp({
              uri: 'https://www.ue.edu.ph/myportal/index.php?ia=' + json.ia,
              jar: this.jar
            })
            resolve()
          }
        })
        .catch(err => reject())
    })
  }

  getHTML (link) {
    return new Promise(async resolve => {
      resolve(
        await rp({
          uri: link,
          jar: this.jar,
          transform: body => cheerio.load(body)
        })
      )
    })
  }
}

module.exports = Portal
