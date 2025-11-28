const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function testFillPDF() {
    const templatePath = './public/pb1-template.pdf';
    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);

    const form = pdfDoc.getForm();

    console.log('\n=== Testing Form Field Filling ===\n');

    try {
        console.log('1. Attempting to fill field "fill_2"...');
        const field1 = form.getTextField('fill_2');
        field1.setText('Jan Kowalski - TEST');
        console.log('   ✓ Success!\n');

        console.log('2. Attempting to fill field "Ulica"...');
        const field2 = form.getTextField('Ulica');
        field2.setText('Polna 1 - TEST');
        console.log('   ✓ Success!\n');

        console.log('3. Attempting to fill field "fill_10"...');
        const field3 = form.getTextField('fill_10');
        field3.setText('Warszawa - TEST');
        console.log('   ✓ Success!\n');

        console.log('=== All fields filled successfully! ===\n');

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync('/tmp/test-filled.pdf', pdfBytes);
        console.log('Saved test PDF to: /tmp/test-filled.pdf\n');

    } catch (error) {
        console.error('!!! ERROR !!!');
        console.error('Type:', error.constructor.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
    }
}

testFillPDF();
