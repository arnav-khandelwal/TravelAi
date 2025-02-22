import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = () => {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().enableZoom = false;
      globeEl.current.controls().enablePan = false;
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().minPolarAngle = Math.PI / 2;
      globeEl.current.controls().maxPolarAngle = Math.PI / 2;
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      backgroundColor="rgba(0,0,0,0)"
      width={600}
      height={600}
      atmosphereColor="#ffffff"
      atmosphereAltitude={0.1}
    />
  );
};

export default GlobeComponent;