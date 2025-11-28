import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';

export function AddressAutocomplete({ onSelect, label = "Wyszukaj adres (automatyczne uzupełnianie)" }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                // Nominatim API search
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&countrycodes=pl&limit=5`
                );
                const data = await response.json();
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error('Address search failed:', error);
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (item) => {
        const addr = item.address;

        // Map OSM address fields to our form structure
        const mappedAddress = {
            street: addr.road || addr.pedestrian || addr.street || '',
            houseNumber: addr.house_number || '',
            city: addr.city || addr.town || addr.village || '',
            postalCode: addr.postcode || '',
            voivodeship: addr.state ? addr.state.replace('województwo ', '').toLowerCase() : '',
            county: addr.county ? addr.county.replace('powiat ', '') : '',
            municipality: addr.municipality || addr.city || addr.town || '',
            country: 'Polska'
        };

        onSelect(mappedAddress);
        setQuery(item.display_name);
        setIsOpen(false);
    };

    return (
        <div className="mb-6 relative z-50" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Search className="w-4 h-4" />
                {label}
            </label>
            <div className="relative">
                <div className="flex items-center w-full border border-blue-300 rounded-md shadow-sm bg-blue-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <div className="pl-3 text-blue-500">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        placeholder="Wpisz adres (np. Marszałkowska 1, Warszawa)"
                        className="w-full px-3 py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                    />
                </div>

                {isOpen && results.length > 0 && (
                    <ul
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-60 overflow-auto divide-y divide-gray-100"
                        style={{ backgroundColor: 'white' }}
                    >
                        {results.map((item) => (
                            <li
                                key={item.place_id}
                                onClick={() => handleSelect(item)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex flex-col transition-colors duration-150"
                            >
                                <span className="font-medium text-gray-900">
                                    {item.address.road} {item.address.house_number}
                                </span>
                                <span className="text-gray-500 text-xs">
                                    {item.address.postcode} {item.address.city || item.address.town || item.address.village}, {item.address.state}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            );
}
