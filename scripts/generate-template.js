import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function createTemplate() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('PB-1 WNIOSEK O POZWOLENIE NA BUDOWE', {
        x: 50,
        y: height - 50,
        size: 18,
        font: font,
        color: rgb(0, 0, 0),
    });

    // Placeholder fields
    const drawField = (label, y) => {
        page.drawText(label, { x: 50, y, size: 10, font });
        page.drawRectangle({
            x: 50,
            y: y - 20,
            width: 200,
            height: 15,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });
    };

    drawField('Imie i nazwisko / Nazwa inwestora', height - 100);
    drawField('Ulica', height - 140);
    drawField('Miejscowosc', height - 180);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('public/pb1-template.pdf', pdfBytes);
    console.log('Template created at public/pb1-template.pdf');
}

createTemplate();
