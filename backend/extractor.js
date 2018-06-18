var extractor = {}

extractor.info = x => {
  let $ = x
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
  let $ = x
  let data = {}
  let current = null
  let table = $('.enhancedtable')
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
        grade:
          $(this)
            .find('td')
            .eq(3)
            .text()
            .trim() ||
          $(this)
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
  let $ = x
  let data = []

  let table = $('.enhancedtable>tbody>tr')
  table.each(function (i) {
    if (i == table.length - 1) return
    let td = $(this).find('td')
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

extractor.lectures = x => {
  let $ = x
  let header = $('.enhancedtable')
    .find('thead>tr>th>strong')
    .text()
    .toUpperCase()
  let data = {
    [header]: []
  }
  $('.enhancedtable>tbody>tr')
    .filter(i => i % 2 == 0)
    .each(function () {
      let datatable = $(this)
        .next()
        .find('.dtltable')
      let temp = {
        code: $(this)
          .find('td')
          .eq(0)
          .text(),
        section: $(this)
          .find('td')
          .eq(1)
          .text(),
        days: $(this)
          .find('td')
          .eq(2)
          .text(),
        time: $(this)
          .find('td')
          .eq(3)
          .text(),
        room: $(this)
          .find('td')
          .eq(4)
          .text(),
        faculty: $(this)
          .find('td')
          .eq(5)
          .text(),
        lectures: []
      }
      datatable
        .find('tr')
        .slice(1)
        .each(function () {
          let lecture = {
            name: $(this)
              .find('td')
              .eq(0)
              .text(),
            file: $(this)
              .find('td')
              .eq(1)
              .text(),
            link: `https://www.ue.edu.ph/studentsportal/${$(this)
              .find('td')
              .eq(2)
              .find('a')
              .attr('href')}`
          }
          temp.lectures.push(lecture)
        })
      data[header].push(temp)
    })
  return data
}

module.exports = extractor
