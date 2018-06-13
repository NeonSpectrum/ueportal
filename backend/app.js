const FormData = require('form-data')
const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const extractor = require('./extractor')
const Portal = require('./portal')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(
  session({
    secret: 'ueportal',
    resave: false,
    saveUninitialized: false
  })
)

app.post('/:data', (req, res) => {
  console.log(req.params.data)
  var portal = new Portal(req.body.sn, req.body.pass)
  portal
    .login()
    .then(async () => {
      let data = null
      if (req.params.data === 'info') {
        data = extractor.info(
          await portal.getHTML(
            'https://www.ue.edu.ph/studentsportal/?nav=studinfo'
          )
        )
        data.url =
          'https://www.ue.edu.ph/studentsportal/' +
          (await portal.getHTML(
            'https://www.ue.edu.ph/studentsportal/?nav=home'
          ))('div[align=center]>img').attr('src')
      } else if (req.params.data === 'grades') {
        data = extractor.grades(
          await portal.getHTML(
            'https://www.ue.edu.ph/studentsportal/?nav=viewgrade'
          )
        )
      } else if (req.params.data === 'schedules') {
        data = extractor.schedules(
          await portal.getHTML(
            'https://www.ue.edu.ph/studentsportal/?nav=schedule'
          )
        )
      }
      console.log(data)
      res.send({ success: true, data })
    })
    .catch(err => {
      console.log(err)
      res.send({ success: false })
    })
})

app.listen(3000, () => {
  console.log('Connected at port 3000')
})
