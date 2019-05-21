const fs = require('fs')
const jsyaml = require('js-yaml')
const Handlebars = require('handlebars')

const template = Handlebars.compile(fs.readFileSync('template.hbs', 'utf8'))
const data = jsyaml.load(fs.readFileSync('data.yaml', 'utf8'))

console.log('Rendering template')
const html = template(data) 
console.log(html)

fs.writeFileSync('index.html', html)
console.log(`${html.length} bytes written`)
