const fs = require('fs')
const path = require('path')
const jsyaml = require('js-yaml')
const Handlebars = require('handlebars')

const root = path.resolve(__dirname, '..', '..')
const templateFilename = path.join(__dirname, 'template.hbs')
const dataFilename = path.join(__dirname, 'data.yaml')
const outputFilename = path.join(root, 'dist', 'index.html')
const pdfFilename = path.join(root, 'src', 'cv-pdf', 'resume.pdf')

// Copied next to index.html so the published URLs stay the same
const assets = {
    'css/style.css': path.join(__dirname, 'css', 'style.css'),
    'resume.pdf': pdfFilename,
    'resume.html': path.join(root, 'src', 'cv-pdf', 'resume.html'),
}

const contains = (list, element) => list.filter(x => x === element).length > 0

const render = (templateFilename, dataFilename, outputFilename) => {
    const template = Handlebars.compile(fs.readFileSync(templateFilename, 'utf8'))
    const data = jsyaml.load(fs.readFileSync(dataFilename, 'utf8'))

    console.log('Rendering template')
    const html = template(data)
    console.log(html)

    fs.mkdirSync(path.dirname(outputFilename), { recursive: true })
    fs.writeFileSync(outputFilename, html)
    Object.entries(assets).forEach(([rel, src]) => {
        const dest = path.join(path.dirname(outputFilename), rel)
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.copyFileSync(src, dest)
    })
    console.log(`${html.length} bytes written`)
}

render(templateFilename, dataFilename, outputFilename)

if (contains(process.argv, '--watch')) {
    console.log("Watching... Press Ctrl+C to quit.")
    fs.watch(__dirname, { recursive: true }, (event, filename) => {
        console.log(`${event}: ${filename}`)
        try {
            render(templateFilename, dataFilename, outputFilename)
        } catch (error) {
            console.log(`Rendering failed: ${error}`)
        }
    })
}
