import { useState, useEffect } from 'react';

const useBreakpoint = () => {
    const [width, setWidth] = useState(window.innerWidth);

    const updateWidth = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    return width;
};

export default useBreakpoint;

// ! 768px for md