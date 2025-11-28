import React from 'react';
import { Input } from './Input';
import { Section } from './Section';

export function ProxySection({ register, errors }) {
    return (
        <Section title="3. DANE PEŁNOMOCNIKA">
            <Input
                label="Imię i nazwisko"
                name="proxyName"
                register={register}
                error={errors.proxyName}
                placeholder="np. Jan Kowalski"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Kraj"
                    name="proxyCountry"
                    register={register}
                    error={errors.proxyCountry}
                    placeholder="np. Polska"
                />

                <Input
                    label="Województwo"
                    name="proxyVoivodeship"
                    register={register}
                    error={errors.proxyVoivodeship}
                    placeholder="np. mazowieckie"
                />

                <Input
                    label="Powiat"
                    name="proxyCounty"
                    register={register}
                    error={errors.proxyCounty}
                    placeholder="np. warszawski"
                />
            </div>

            <Input
                label="Gmina"
                name="proxyMunicipality"
                register={register}
                error={errors.proxyMunicipality}
                placeholder="np. Warszawa"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Ulica"
                    name="proxyStreet"
                    register={register}
                    error={errors.proxyStreet}
                    placeholder="np. Polna"
                    className="md:col-span-2"
                />

                <Input
                    label="Nr domu"
                    name="proxyHouseNumber"
                    register={register}
                    error={errors.proxyHouseNumber}
                    placeholder="np. 123"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Nr lokalu"
                    name="proxyApartmentNumber"
                    register={register}
                    error={errors.proxyApartmentNumber}
                    placeholder="np. 5"
                />

                <Input
                    label="Miejscowość"
                    name="proxyCity"
                    register={register}
                    error={errors.proxyCity}
                    placeholder="np. Warszawa"
                />

                <Input
                    label="Kod pocztowy"
                    name="proxyPostalCode"
                    register={register}
                    error={errors.proxyPostalCode}
                    placeholder="np. 00-001"
                    validation={{
                        pattern: {
                            value: /^\d{2}-\d{3}$/,
                            message: "Format: XX-XXX (np. 00-001)"
                        }
                    }}
                />
            </div>

            <Input
                label="Poczta"
                name="proxyPostOffice"
                register={register}
                error={errors.proxyPostOffice}
                placeholder="np. Warszawa 1"
            />

            <Input
                label="Adres skrzynki ePUAP"
                name="proxyEpuap"
                register={register}
                error={errors.proxyEpuap}
                placeholder="np. /login/skrytka"
            />
        </Section>
    );
}
