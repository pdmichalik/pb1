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
