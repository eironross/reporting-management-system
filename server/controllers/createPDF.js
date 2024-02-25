import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import hbs from "handlebars";
import moment from "moment";

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
    const html = fs.readFileSync(filePath, "utf-8");
    return hbs.compile(html)(data)
}

hbs.registerHelper("dateFormat", function(value, format) {
    return moment(value).format(format);
});

export const create_pdf = async (data) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // "const pdfPath = path.join(, );"
        // console.log(pdfPath)
        const content = await compile("template", data)

        await page.setContent(content)
        await page.emulateMediaType('screen');
        await page.pdf({
                  format: "A4",
                  displayHeaderFooter: false,
                  printBackground: true,
                  path: `./tmp/${data.title}_${data.date.split("-").join("")}.pdf`,
                });
        console.log("done pdf generation")
        await browser.close();
    } catch (error) {
        console.log("Error:", error)
    }
    
  }


