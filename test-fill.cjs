const { PDFDocument } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');

async function testFillPDF() {
    const templatePath = './public/pb1-template.pdf';
    const fontPath = './public/fonts/Ubuntu-R.ttf';

    const templateBytes = fs.readFileSync(templatePath);
    const fontBytes = fs.readFileSync(fontPath);

    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const form = pdfDoc.getForm();

    console.log('\n=== Testing Full Form Field Filling with Custom Font ===\n');

    // Helper
    function fill(name, value) {
        try {
            const field = form.getTextField(name);
            field.setText(value);
            field.updateAppearances(customFont);
            console.log(`✓ Filled "${name}" with "${value}"`);
        } catch (e) {
            console.error(`✗ Failed to fill "${name}": ${e.message}`);
        }
    }

    try {
        console.log('--- Section 1: Investor ---');
        fill('Nazwa', 'Firma ABC');
        fill('fill_2', 'Jan Kowalski');
        fill('Kraj', 'Polska');
        fill('Województwo', 'Mazowieckie');
        fill('Ulica', 'Polna');
        fill('Nr domu', '1');
        fill('fill_10', 'Warszawa');

        console.log('\n--- Section 2: Correspondence ---');
        fill('Kraj_2', 'Polska');
        fill('Województwo_2', 'Małopolskie');
        fill('fill_22', 'Kraków'); // City
        fill('Ulica_2', 'Wawelska');

        console.log('\n--- Section 3: Proxy ---');
        fill('nazwisko', 'Anna Nowak');
        fill('fill_34', 'Gdańsk'); // City

        console.log('\n--- Section 4: Property ---');
        fill('fill_38', 'Mazowieckie'); // Voivodeship
        fill('5 NAZWA ZAMIERZENIA BUDOWLANEGO1', 'Budowa domu jednorodzinnego');

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync('/tmp/test-full-filled.pdf', pdfBytes);
        console.log('\n=== Success! Saved to /tmp/test-full-filled.pdf ===\n');

    } catch (error) {
        console.error('!!! ERROR !!!');
        console.error(error);
    }
}

testFillPDF();
