const fs = require('fs')
const jsyaml = require('js-yaml')
const Handlebars = require('handlebars')

const templateFilename = './src/template.hbs'
const dataFilename = './src/data.yaml'
const outputFilename = './index.html'

const contains = (list, element) => list.filter(x => x === element).length > 0

const render = (templateFilename, dataFilename, outputFilename) => {
    const template = Handlebars.compile(fs.readFileSync(templateFilename, 'utf8'))
    const data = jsyaml.load(fs.readFileSync(dataFilename, 'utf8'))
        
    console.log('Rendering template')
    const html = template(data) 
    console.log(html)
    
    fs.writeFileSync(outputFilename, html)
    console.log(`${html.length} bytes written`)    
}

render(templateFilename, dataFilename, outputFilename)

if (contains(process.argv, '--pdf')) {
    const pdf = require('html-pdf')
    const options = {}
    const html = fs.readFileSync(outputFilename, 'utf8')
    pdf.create(html, options).toFile('./resume.pdf', function (err, res) {
        if (err) {
            console.log(err)
        }
        console.log(res)
    })
}

if (contains(process.argv, '--watch')) {
    console.log("Watching... Press Ctrl+C to quit.")
    fs.watch('./src', (event, filename) => {
        console.log(`${event}: ${filename}`)
        try {
            render(templateFilename, dataFilename, outputFilename)    
        } catch (error) {
            console.log(`Rendering failed: ${error}`)
        }        
    })
}
