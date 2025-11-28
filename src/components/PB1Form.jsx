import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InvestorSection } from './InvestorSection';
import { CorrespondenceSection } from './CorrespondenceSection';
import { ProxySection } from './ProxySection';
import { PropertySection } from './PropertySection';
import { FileText, Download, Loader2 } from 'lucide-react';

export function PB1Form() {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('pb1-form-data');
    const defaultValues = savedData ? JSON.parse(savedData) : {};

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues
    });
    const [loading, setLoading] = useState(false);

    // Watch all fields and save to localStorage
    const allFields = watch();
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem('pb1-form-data', JSON.stringify(allFields));
        }, 500); // Debounce save
        return () => clearTimeout(timeoutId);
    }, [allFields]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch('/api/fill-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to generate PDF');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wniosek-pb1.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error:', error);
            alert('Wystąpił błąd podczas generowania PDF.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-blue-600" />
                    Wniosek PB-1
                </h1>
                <p className="text-gray-600 mt-2">Generator wniosku o pozwolenie na budowę</p>
            </div>

            <InvestorSection register={register} errors={errors} setValue={setValue} />
            <CorrespondenceSection register={register} errors={errors} setValue={setValue} />
            <ProxySection register={register} errors={errors} setValue={setValue} />
            <PropertySection register={register} errors={errors} setValue={setValue} />

            <div className="flex justify-end mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generowanie...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            Pobierz PDF
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
