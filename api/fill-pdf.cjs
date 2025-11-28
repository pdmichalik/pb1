const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
    console.log('API endpoint called');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;
        console.log('Received data:', data);

        const templatePath = path.join(process.cwd(), 'public', 'pb1-template.pdf');
        console.log('Template path:', templatePath);
        console.log('File exists:', fs.existsSync(templatePath));

        if (!fs.existsSync(templatePath)) {
            console.error('Template file not found');
            return res.status(500).json({ error: 'Template not found', path: templatePath });
        }

        const templateBytes = fs.readFileSync(templatePath);
        console.log('Template loaded, size:', templateBytes.length);
        const pdfDoc = await PDFDocument.load(templateBytes);

        // Get the form from the PDF
        const form = pdfDoc.getForm();

        // Fill form fields by name
        try {
            // Fill the fields
            if (data.investorName) {
                const field = form.getTextField('fill_2');
                field.setText(data.investorName);
            }

            if (data.street) {
                const streetField = form.getTextField('Ulica');
                streetField.setText(data.street);
            }

            if (data.city) {
                const cityField = form.getTextField('fill_10');
                cityField.setText(data.city);
            }

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
};
