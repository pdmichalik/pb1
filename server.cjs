const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/fill-pdf', async (req, res) => {
    console.log('API endpoint called');

    try {
        const data = req.body;
        console.log('Received data:', data);

        const templatePath = path.join(__dirname, 'public', 'pb1-template.pdf');
        const fontPath = path.join(__dirname, 'public', 'fonts', 'Ubuntu-R.ttf');
        console.log('Template path:', templatePath);

        if (!fs.existsSync(templatePath)) {
            console.error('Template file not found');
            return res.status(500).json({ error: `Template file not found at ${templatePath}` });
        }

        const templateBytes = fs.readFileSync(templatePath);
        const fontBytes = fs.readFileSync(fontPath);

        const pdfDoc = await PDFDocument.load(templateBytes);
        pdfDoc.registerFontkit(fontkit);
        const customFont = await pdfDoc.embedFont(fontBytes);

        // Get the form from the PDF
        const form = pdfDoc.getForm();

        // Helper function
        function fillFormField(form, fieldName, value, font) {
            if (!value) return;
            try {
                const field = form.getTextField(fieldName);
                field.setText(String(value));
                if (font) {
                    field.updateAppearances(font);
                }
            } catch (error) {
                console.warn(`Field "${fieldName}" not found or error:`, error.message);
            }
        }

        // Fill form fields by name
        try {
            // Get all field names for debugging
            const fields = form.getFields();
            console.log('Total form fields found:', fields.length);

            // Fill the fields
            // Sekcja 1: Dane Inwestora (14 pól)
            fillFormField(form, 'Nazwa', data.investorCompanyName, customFont);
            fillFormField(form, 'fill_2', data.investorName, customFont);
            fillFormField(form, 'Kraj', data.country, customFont);
            fillFormField(form, 'Województwo', data.voivodeship, customFont);
            fillFormField(form, 'Powiat', data.county, customFont);
            fillFormField(form, 'Gmina', data.municipality, customFont);
            fillFormField(form, 'Ulica', data.street, customFont);
            fillFormField(form, 'Nr domu', data.houseNumber, customFont);
            fillFormField(form, 'Nr lokalu', data.apartmentNumber, customFont);
            fillFormField(form, 'fill_10', data.city, customFont);
            fillFormField(form, 'Kod pocztowy', data.postalCode, customFont);
            fillFormField(form, 'Poczta', data.postOffice, customFont);
            fillFormField(form, 'fill_13', data.email, customFont);
            fillFormField(form, 'fill_14', data.phone, customFont);

            // Sekcja 2: Dane do Korespondencji (13 pól)
            fillFormField(form, 'Kraj_2', data.corrCountry, customFont);
            fillFormField(form, 'Województwo_2', data.corrVoivodeship, customFont);
            fillFormField(form, 'Powiat_2', data.corrCounty, customFont);
            fillFormField(form, 'Gmina_2', data.corrMunicipality, customFont);
            fillFormField(form, 'Ulica_2', data.corrStreet, customFont);
            fillFormField(form, 'Nr domu_2', data.corrHouseNumber, customFont);
            fillFormField(form, 'Nr lokalu_2', data.corrApartmentNumber, customFont);
            fillFormField(form, 'fill_22', data.corrCity, customFont);
            fillFormField(form, 'Kod pocztowy_2', data.corrPostalCode, customFont);
            fillFormField(form, 'Poczta_2', data.corrPostOffice, customFont);
            fillFormField(form, 'Adres skrzynki ePUAP2', data.corrEpuap, customFont);

            // Checkboxes
            if (data.isProxy) {
                try { form.getCheckBox('toggle_1').check(); } catch (e) { console.warn(`✗ Checkbox "toggle_1" not found or could not be checked. Error: ${e.message}`); }
            }
            if (data.isProxyForDelivery) {
                try { form.getCheckBox('toggle_2').check(); } catch (e) { console.warn(`✗ Checkbox "toggle_2" not found or could not be checked. Error: ${e.message}`); }
            }

            // Sekcja 3: Dane Pełnomocnika (11 pól)
            fillFormField(form, 'nazwisko', data.proxyName, customFont);
            fillFormField(form, 'Kraj_3', data.proxyCountry, customFont);
            fillFormField(form, 'Województwo_3', data.proxyVoivodeship, customFont);
            fillFormField(form, 'Powiat_3', data.proxyCounty, customFont);
            fillFormField(form, 'Gmina_3', data.proxyMunicipality, customFont);
            fillFormField(form, 'Ulica_3', data.proxyStreet, customFont);
            fillFormField(form, 'Nr domu_3', data.proxyHouseNumber, customFont);
            fillFormField(form, 'Nr lokalu_3', data.proxyApartmentNumber, customFont);
            fillFormField(form, 'fill_34', data.proxyCity, customFont);
            fillFormField(form, 'Kod pocztowy_3', data.proxyPostalCode, customFont);
            fillFormField(form, 'Poczta_3', data.proxyPostOffice, customFont);
            fillFormField(form, 'Adres skrzynki ePUAP2_2', data.proxyEpuap, customFont);

            // Sekcja 4: Dane Nieruchomości (4 pola)
            fillFormField(form, 'fill_38', data.propertyVoivodeship, customFont);
            fillFormField(form, 'fill_39', data.propertyCounty, customFont);
            fillFormField(form, '5 NAZWA ZAMIERZENIA BUDOWLANEGO1', data.investmentName1, customFont);
            fillFormField(form, '5 NAZWA ZAMIERZENIA BUDOWLANEGO2', data.investmentName2, customFont);

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
