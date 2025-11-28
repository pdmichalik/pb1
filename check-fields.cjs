const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function checkPDFFields() {
    const templatePath = path.join(__dirname, 'public', 'pb1-template.pdf');

    if (!fs.existsSync(templatePath)) {
        console.error('Template not found at:', templatePath);
        return;
    }

    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);

    try {
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log('\n=== PDF Form Fields ===');
        console.log(`Total fields: ${fields.length}\n`);

        fields.forEach((field, index) => {
            const name = field.getName();
            const type = field.constructor.name;
            console.log(`${index + 1}. Name: "${name}" | Type: ${type}`);
        });

        console.log('\n======================\n');
    } catch (error) {
        console.error('Error reading form fields:', error.message);
        console.log('This PDF may not have form fields.');
    }
}

checkPDFFields();
