const FormData = require('form-data')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const extractor = require('./extractor')
const Portal = require('./portal')
const { Auth } = require('./auth')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.post('/', async (req, res) => {
  var auth = new Auth(req.body.sn, req.body.pass)
  var success = await auth.login()
  console.log({ sn: req.body.sn, pass: req.body.pass, id: auth.id })
  res.send({ success, id: auth.id })
})

app.get('/destroy/:id', async (req, res) => {
  var portal = new Portal(req.params.id)
  res.send({ success: portal.destroy() })
})

app.get('/id/:id', async (req, res) => {
  var portal = new Portal(req.params.id)
  res.send({ success: portal.isExists })
})

app.post('/:data', async (req, res) => {
  var portal = new Portal(req.body.id)
  if (portal.isExists) {
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
    } else if (req.params.data === 'lectures') {
      data = extractor.lectures(
        await portal.getHTML(
          'https://www.ue.edu.ph/studentsportal/?nav=elearning'
        )
      )
    }
    res.send({ success: true, data })
  } else {
    res.send({ success: false, data: null })
  }
})

app.listen(3000, () => {
  console.log('Connected at port 3000')
})
