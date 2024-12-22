// SnowsParticles.tsx

import React, { useEffect } from 'react';
import { tsParticles } from "tsparticles-engine";
import { loadSnowPreset } from "tsparticles-preset-snow";
import { NextPage } from 'next';

const SnowParticles: NextPage = () => {
    useEffect(() => {
        const initParticles = async () => {
            // Load the snow preset
            await loadSnowPreset(tsParticles);

            // Load the snow particles with the preset settings
            tsParticles.load("tsparticles", {
                preset: "snow", // Use the snow preset directly
                background: {
                    color: {
                        value: "#0c0c0c",
                    },
                },
                particles: {
                    number: {
                        value: 50, // Adjust number of particles (if needed)
                    },
                },
            });
        };

        initParticles();

        // No cleanup needed
    }, []);

    return (
        <div id="tsparticles" >
            {/* The fireworks particles will render here */}
        </div>
    );
};

export default SnowParticles;
