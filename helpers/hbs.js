const moment = require('moment')

module.exports = {
  truncate: (str, len) => {
    if (str.length > len && str.length > 0) {
      let newStr = str + ' '
      newStr = str.substr(0, len)
      newStr = str.substr(0, newStr.lastIndexOf(' '))
      newStr = (newStr.length > 0) ? newStr : str.substr(0, len)
      return newStr + '...'
    }
    return str
  },
  stripTags: (input) => {
    return input.replace(/<(?:.|\n)*?>/gm, ' ')
  },
  formatDate: (date, format) => {
    return moment(date).format(format)
  },
  select: (selected, options) => {
    return options.fn(this).replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"').replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&')
  },
  editIcon: (adventureUser, loggedUser, adventureId, floating = true) => {
    if (adventureUser === loggedUser) {
      if (floating) {
        return `<a href="/adventures/edit/${adventureId}" class="btn-floating halfway-fab green"><i class="fas fa-pencil-alt"></i></a>`
      } else {
        return `<a href="/adventures/edit/${adventureId}" class="green-text"><i class="fas fa-pencil-alt"></i></a>`
      }
    } else {
      return ''
    }
  }
}
