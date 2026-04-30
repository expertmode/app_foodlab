'use client';
import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
    const [selectedFilterId, setSelectedFilterId] = useState(0);

    return (
        <FilterContext.Provider value={{ selectedFilterId, setSelectedFilterId }}>
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
