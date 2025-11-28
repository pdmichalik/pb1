const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/fill-pdf', async (req, res) => {
    console.log('API /fill-pdf called');

    try {
        const data = req.body;
        console.log('Received data:', data);

        const templatePath = path.join(__dirname, 'public', 'pb1-template.pdf');
        console.log('Template path:', templatePath);

        if (!fs.existsSync(templatePath)) {
            console.error('Template not found');
            return res.status(500).json({ error: 'Template not found' });
        }

        const templateBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(templateBytes);

        // Get the form from the PDF
        const form = pdfDoc.getForm();

        // Fill form fields by name
        try {
            // Get all field names for debugging
            const fields = form.getFields();
            console.log('Total form fields found:', fields.length);

            // Fill the fields
            if (data.investorName) {
                console.log('Filling field "fill_2" with:', data.investorName);
                const field = form.getTextField('fill_2');
                field.setText(data.investorName);
                console.log('✓ Field "fill_2" filled successfully');
            }

            if (data.street) {
                console.log('Filling field "Ulica" with:', data.street);
                const streetField = form.getTextField('Ulica');
                streetField.setText(data.street);
                console.log('✓ Field "Ulica" filled successfully');
            }

            if (data.city) {
                console.log('Filling field "fill_10" with:', data.city);
                const cityField = form.getTextField('fill_10');
                cityField.setText(data.city);
                console.log('✓ Field "fill_10" filled successfully');
            }

            console.log('All fields filled successfully!');

        } catch (error) {
            console.error('!!! ERROR filling form fields !!!');
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            // Fallback to coordinate-based drawing if form fields don't exist
            console.log('Using fallback: drawing text at coordinates...');
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
        console.log('PDF generated successfully');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=wniosek-pb1.pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
});

app.get('/api/test', (req, res) => {
    console.log('Test endpoint called');
    res.json({ message: 'API server running!', time: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n✅ API server running on http://localhost:${PORT}`);
    console.log(`   Test: http://localhost:${PORT}/api/test\n`);
});
