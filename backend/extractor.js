var extractor = {}

extractor.info = x => {
  var $ = x
  return {
    no: $('.subtable>tbody>tr')
      .eq(0)
      .find('td')
      .eq(1)
      .text(),
    name: $('.subtable>tbody>tr')
      .eq(1)
      .find('td')
      .eq(1)
      .text(),
    course: $('.subtable>tbody>tr')
      .eq(2)
      .find('td')
      .eq(1)
      .text(),
    yearLevel: $('.subtable>tbody>tr')
      .eq(0)
      .find('td')
      .eq(3)
      .text(),
    college: $('.subtable>tbody>tr')
      .eq(1)
      .find('td')
      .eq(3)
      .text(),
    campus: $('.subtable>tbody>tr')
      .eq(2)
      .find('td')
      .eq(3)
      .text()
  }
}

extractor.grades = x => {
  var $ = x
  var data = {}
  var current = null
  var table = $('.enhancedtable')
    .last()
    .find('tbody>tr')
  table.each(function (i) {
    if (i == table.length - 1 || i == table.length - 2) return
    if ($(this).attr('bgcolor') == 'ffffff') {
      current = $(this)
        .find('strong')
        .text()
      data[current] = []
    } else {
      data[current].push({
        code: $(this)
          .find('td')
          .eq(0)
          .text()
          .trim(),
        subject: $(this)
          .find('td')
          .eq(1)
          .text()
          .trim(),
        grade: $(this)
          .find('td')
          .eq(2)
          .text()
          .trim(),
        units: $(this)
          .find('td')
          .eq(4)
          .text()
          .trim()
      })
    }
  })
  return data
}

extractor.schedules = x => {
  var $ = x
  var data = []

  var table = $('.enhancedtable>tbody>tr')
  table.each(function (i) {
    if (i == table.length - 1) return
    var td = $(this).find('td')
    data.push({
      subjectcode: td
        .eq(0)
        .text()
        .trim(),
      section: td
        .eq(1)
        .text()
        .trim(),
      // units: td
      //   .eq(2)
      //   .text()
      //   .trim(),
      days: td
        .eq(3)
        .text()
        .trim(),
      time: td
        .eq(4)
        .text()
        .trim(),
      room: td
        .eq(5)
        .text()
        .trim(),
      faculty: td
        .eq(6)
        .text()
        .trim()
    })
  })
  return data
}
module.exports = extractor
