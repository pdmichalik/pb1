import React from 'react';
import { Input } from './Input';
import { Section } from './Section';
import { AddressAutocomplete } from './AddressAutocomplete';

export function CorrespondenceSection({ register, errors, setValue }) {
    const handleAddressSelect = (address) => {
        if (address.street) setValue('corrStreet', address.street);
        if (address.houseNumber) setValue('corrHouseNumber', address.houseNumber);
        if (address.city) setValue('corrCity', address.city);
        if (address.postalCode) setValue('corrPostalCode', address.postalCode);
        if (address.voivodeship) setValue('corrVoivodeship', address.voivodeship);
        if (address.county) setValue('corrCounty', address.county);
        if (address.municipality) setValue('corrMunicipality', address.municipality);
        if (address.country) setValue('corrCountry', address.country);
    };

    return (
        <Section title="2.2. DANE DO KORESPONDENCJI">
            <p className="text-sm text-gray-500 mb-4">Wypełnij tylko jeśli jest inny niż adres inwestora</p>

            <AddressAutocomplete onSelect={handleAddressSelect} label="Wyszukaj adres do korespondencji" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Kraj"
                    name="corrCountry"
                    register={register}
                    error={errors.corrCountry}
                    placeholder="np. Polska"
                />

                <Input
                    label="Województwo"
                    name="corrVoivodeship"
                    register={register}
                    error={errors.corrVoivodeship}
                    placeholder="np. mazowieckie"
                />

                <Input
                    label="Powiat"
                    name="corrCounty"
                    register={register}
                    error={errors.corrCounty}
                    placeholder="np. warszawski"
                />
            </div>

            <Input
                label="Gmina"
                name="corrMunicipality"
                register={register}
                error={errors.corrMunicipality}
                placeholder="np. Warszawa"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Ulica"
                    name="corrStreet"
                    register={register}
                    error={errors.corrStreet}
                    placeholder="np. Polna"
                    className="md:col-span-2"
                />

                <Input
                    label="Nr domu"
                    name="corrHouseNumber"
                    register={register}
                    error={errors.corrHouseNumber}
                    placeholder="np. 123"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Nr lokalu"
                    name="corrApartmentNumber"
                    register={register}
                    error={errors.corrApartmentNumber}
                    placeholder="np. 5"
                />

                <Input
                    label="Miejscowość"
                    name="corrCity"
                    register={register}
                    error={errors.corrCity}
                    placeholder="np. Warszawa"
                />

                <Input
                    label="Kod pocztowy"
                    name="corrPostalCode"
                    register={register}
                    error={errors.corrPostalCode}
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
                name="corrPostOffice"
                register={register}
                error={errors.corrPostOffice}
                placeholder="np. Warszawa 1"
            />

            <Input
                label="Adres skrzynki ePUAP"
                name="corrEpuap"
                register={register}
                error={errors.corrEpuap}
                placeholder="np. /login/skrytka"
            />

            <div className="mt-4 space-y-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isProxy"
                        {...register("isProxy")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isProxy" className="ml-2 block text-sm text-gray-900">
                        Działa przez pełnomocnika
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isProxyForDelivery"
                        {...register("isProxyForDelivery")}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isProxyForDelivery" className="ml-2 block text-sm text-gray-900">
                        Pełnomocnik do doręczeń
                    </label>
                </div>
            </div>
        </Section>
    );
}
