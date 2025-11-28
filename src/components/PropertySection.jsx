import React from 'react';
import { Input } from './Input';
import { Section } from './Section';
import { AddressAutocomplete } from './AddressAutocomplete';

export function PropertySection({ register, errors, setValue }) {
    const handleAddressSelect = (address) => {
        if (address.voivodeship) setValue('propertyVoivodeship', address.voivodeship);
        if (address.county) setValue('propertyCounty', address.county);
        // Property section is specific, we might want to put street/city into investment name or just leave it
    };

    return (
        <Section title="4. DANE NIERUCHOMOŚCI">
            <AddressAutocomplete onSelect={handleAddressSelect} label="Wyszukaj lokalizację nieruchomości" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Województwo"
                    name="propertyVoivodeship"
                    register={register}
                    error={errors.propertyVoivodeship}
                    placeholder="np. mazowieckie"
                />

                <Input
                    label="Powiat"
                    name="propertyCounty"
                    register={register}
                    error={errors.propertyCounty}
                    placeholder="np. warszawski"
                />
            </div>

            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa zamierzenia budowlanego
                </label>
                <div className="space-y-2">
                    <Input
                        label="Linia 1"
                        name="investmentName1"
                        register={register}
                        error={errors.investmentName1}
                        placeholder="np. Budowa budynku mieszkalnego jednorodzinnego"
                    />
                    <Input
                        label="Linia 2"
                        name="investmentName2"
                        register={register}
                        error={errors.investmentName2}
                        placeholder="ciąg dalszy nazwy..."
                    />
                </div>
            </div>
        </Section>
    );
}
