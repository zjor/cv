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
    const puppeteer = require('puppeteer')
    const path = require('path')
    
    ;(async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        
        // Load the HTML file with proper base URL so CSS can be resolved
        const filePath = 'file://' + path.resolve(outputFilename)
        await page.goto(filePath, { waitUntil: 'networkidle0' })
        
        await page.pdf({ 
            path: './resume.pdf', 
            format: 'A4',
            printBackground: true,
            margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' }
        })
        await browser.close()
        console.log('PDF generated: ./resume.pdf')
    })().catch(console.error)
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
