'use client';
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [selectedPicto, setSelectedPicto] = useState('');

    return (
        <FilterContext.Provider value={{ selectedPicto, setSelectedPicto }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter deve ser usado dentro de FilterProvider');
    }
    return context;
}
