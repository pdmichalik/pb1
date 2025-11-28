import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
    console.log('API endpoint called');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;
        console.log('Received data:', data);

        // In Vercel, use process.cwd() to get the project root
        const templatePath = join(process.cwd(), 'public', 'pb1-template.pdf');
        console.log('Current working directory:', process.cwd());
        console.log('Attempting to read template from:', templatePath);

        if (!existsSync(templatePath)) {
            console.error('Template file not found at:', templatePath);
            return res.status(500).json({ error: `Template file not found at ${templatePath}` });
        }

        const templateBytes = readFileSync(templatePath);
        console.log('Template loaded, size:', templateBytes.length);

        const pdfDoc = await PDFDocument.load(templateBytes);

        // Get the form from the PDF
        const form = pdfDoc.getForm();

        // Fill form fields by name
        try {
            // Fill the fields
            if (data.investorName) {
                console.log('Filling field "fill_2" with:', data.investorName);
                const field = form.getTextField('fill_2');
                field.setText(data.investorName);
            }

            if (data.street) {
                console.log('Filling field "Ulica" with:', data.street);
                const streetField = form.getTextField('Ulica');
                streetField.setText(data.street);
            }

            if (data.city) {
                console.log('Filling field "fill_10" with:', data.city);
                const cityField = form.getTextField('fill_10');
                cityField.setText(data.city);
            }

            console.log('All fields filled successfully!');

        } catch (error) {
            console.error('Error filling form fields:', error);
            // Fallback to coordinate-based drawing
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const { height } = firstPage.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            const drawText = (text, x, y) => {
                if (text) {
                    firstPage.drawText(text, { x, y, size: 10, font, color: rgb(0, 0, 0) });
                }
            };

            drawText(data.investorName || '', 55, height - 115);
            drawText(data.street || '', 55, height - 155);
            drawText(data.city || '', 55, height - 195);
        }

        const pdfBytes = await pdfDoc.save();
        console.log('PDF generated, size:', pdfBytes.length);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=wniosek-pb1.pdf');
        return res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
}
