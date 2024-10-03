import React from 'react';
import { Particles } from '@tsparticles/react';
import { loadFull } from 'tsparticles';

const StarBackground = () => {
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  return (
    <Particles
      id="tsparticles"
      className="star-background"
      init={particlesInit}
      options={{
        background: {
          color: '#000'  // Black background for contrast
        },
        particles: {
          number: {
            value: 800,  // Huge number of stars for visibility
            density: {
              enable: true,
              value_area: 800  // Spread out evenly
            }
          },
          color: {
            value: '#ff0000'  // Bright red stars for clear visibility
          },
          shape: {
            type: 'circle',  // Simple circle shape for stars
          },
          size: {
            value: 15,  // Large size for testing visibility
            random: false,  // All the same size for now
          },
          opacity: {
            value: 1,  // Full opacity for bright stars
          },
          move: {
            enable: true,
            speed: 0.2,  // Slow movement to see twinkling effect
          },
        },
        detectRetina: true,  // Support for high-density screens
      }}
    />
  );
};

export default StarBackground;
