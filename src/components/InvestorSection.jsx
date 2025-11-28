import React from 'react';
import { Input } from './Input';
import { Section } from './Section';

export function InvestorSection({ register, errors }) {
    return (
        <Section title="2.1. DANE INWESTORA">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Nazwa (dla firm)"
                    name="investorCompanyName"
                    register={register}
                    error={errors.investorCompanyName}
                    placeholder="np. ABC Sp. z o.o."
                />

                <Input
                    label="Imię i nazwisko"
                    name="investorName"
                    register={register}
                    error={errors.investorName}
                    placeholder="np. Jan Kowalski"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Kraj"
                    name="country"
                    register={register}
                    error={errors.country}
                    placeholder="np. Polska"
                />

                <Input
                    label="Województwo"
                    name="voivodeship"
                    register={register}
                    error={errors.voivodeship}
                    placeholder="np. mazowieckie"
                />

                <Input
                    label="Powiat"
                    name="county"
                    register={register}
                    error={errors.county}
                    placeholder="np. warszawski"
                />
            </div>

            <Input
                label="Gmina"
                name="municipality"
                register={register}
                error={errors.municipality}
                placeholder="np. Warszawa"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Ulica"
                    name="street"
                    register={register}
                    error={errors.street}
                    placeholder="np. Polna"
                    className="md:col-span-2"
                />

                <Input
                    label="Nr domu"
                    name="houseNumber"
                    register={register}
                    error={errors.houseNumber}
                    placeholder="np. 123"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Nr lokalu"
                    name="apartmentNumber"
                    register={register}
                    error={errors.apartmentNumber}
                    placeholder="np. 5"
                />

                <Input
                    label="Miejscowość"
                    name="city"
                    register={register}
                    error={errors.city}
                    placeholder="np. Warszawa"
                />

                <Input
                    label="Kod pocztowy"
                    name="postalCode"
                    register={register}
                    error={errors.postalCode}
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
                name="postOffice"
                register={register}
                error={errors.postOffice}
                placeholder="np. Warszawa 1"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Email (nieobowiązkowe)"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    placeholder="np. jan.kowalski@example.com"
                />

                <Input
                    label="Nr tel. (nieobowiązkowe)"
                    name="phone"
                    register={register}
                    error={errors.phone}
                    placeholder="np. +48 123 456 789"
                />
            </div>
        </Section>
    );
}
