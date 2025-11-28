import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Field mapping helper
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

export default async function handler(req, res) {
    console.log('API endpoint called');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;
        console.log('Received data:', data);

        const templatePath = join(process.cwd(), 'public', 'pb1-template.pdf');
        console.log('Template path:', templatePath);

        if (!existsSync(templatePath)) {
            console.error('Template file not found');
            return res.status(500).json({ error: `Template file not found at ${templatePath}` });
        }

        const templateBytes = readFileSync(templatePath);
        console.log('Template loaded, size:', templateBytes.length);

        const fontPath = join(process.cwd(), 'public', 'fonts', 'Ubuntu-R.ttf');
        const fontBytes = readFileSync(fontPath);

        const pdfDoc = await PDFDocument.load(templateBytes);
        pdfDoc.registerFontkit(fontkit);
        const customFont = await pdfDoc.embedFont(fontBytes);

        const form = pdfDoc.getForm();

        console.log('Filling form fields...');

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
            try { form.getCheckBox('toggle_1').check(); } catch (e) { }
        }
        if (data.isProxyForDelivery) {
            try { form.getCheckBox('toggle_2').check(); } catch (e) { }
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

        const pdfBytes = await pdfDoc.save();
        console.log('PDF generated, size:', pdfBytes.length);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=wniosek-pb1.pdf');
        return res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to generate PDF', details: error.message, stack: error.stack });
    }
}
