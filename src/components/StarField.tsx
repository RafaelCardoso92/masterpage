"use client";

import { useEffect, useState, useMemo, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  twinkleDuration: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
}

interface CosmicObject {
  id: number;
  type: "nebula" | "planet" | "blackhole" | "galaxy";
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
  spinSpeed?: number;
  driftDirection?: { x: number; y: number };
  planetType?: "rocky" | "gas" | "ice" | "ringed" | "volcanic" | "oceanic" | "desert";
  hasRings?: boolean;
  hasMoons?: boolean;
  ringColor?: string;
  planetSpinSpeed?: number;
  moonOrbitSpeed?: number;
  texturePattern?: number;
  moonCount?: number;
  moonSizes?: number[];
  moonOrbits?: number[];
  moonTextures?: number[];
}

const StarField = () => {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [cosmicObjects, setCosmicObjects] = useState<CosmicObject[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [distortionFrame, setDistortionFrame] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const stars = useMemo(() => {
    const generated: Star[] = [];
    const starCount = 300;

    for (let i = 0; i < starCount; i++) {
      generated.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleDelay: Math.random() * 8,
        twinkleDuration: Math.random() * 3 + 3,
        driftX: (Math.random() - 0.5) * 30,
        driftY: (Math.random() - 0.5) * 20,
        driftDuration: Math.random() * 60 + 80,
      });
    }
    return generated;
  }, []);

  useEffect(() => {
    const spawnShootingStar = () => {
      const star: ShootingStar = {
        id: Date.now() + Math.random(),
        x: Math.random() * 70 + 10,
        y: Math.random() * 30,
        angle: Math.random() * 40 + 10,
        length: Math.random() * 80 + 60,
      };

      setShootingStars((prev) => [...prev, star]);

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== star.id));
      }, 1200);
    };

    const scheduleNext = () => {
      const delay = Math.random() * 10000 + 6000;
      return setTimeout(() => {
        spawnShootingStar();
        scheduleNext();
      }, delay);
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    let isActive = true;

    const nebulaColors = [
      "rgba(139, 92, 246, 0.15)",
      "rgba(244, 63, 94, 0.12)",
      "rgba(59, 130, 246, 0.14)",
      "rgba(168, 85, 247, 0.10)",
    ];

    const planetTypes: Array<{
      type: CosmicObject["planetType"];
      colors: string[];
      hasRings: boolean;
      ringColors: string[];
    }> = [
      {
        type: "rocky",
        colors: ["#4a5568", "#744210", "#5b3a29", "#2d3748", "#8b4513"],
        hasRings: false,
        ringColors: [],
      },
      {
        type: "gas",
        colors: ["#c9a961", "#daa520", "#f4a460", "#d2691e", "#b8860b"],
        hasRings: true,
        ringColors: ["rgba(210, 180, 140, 0.4)", "rgba(245, 222, 179, 0.3)", "rgba(238, 232, 170, 0.35)"],
      },
      {
        type: "ice",
        colors: ["#87ceeb", "#b0e0e6", "#add8e6", "#e0ffff", "#afeeee"],
        hasRings: true,
        ringColors: ["rgba(176, 224, 230, 0.3)", "rgba(173, 216, 230, 0.25)"],
      },
      {
        type: "volcanic",
        colors: ["#8b0000", "#a52a2a", "#b22222", "#cd5c5c", "#dc143c"],
        hasRings: false,
        ringColors: [],
      },
      {
        type: "oceanic",
        colors: ["#4682b4", "#1e90ff", "#4169e1", "#6495ed", "#00bfff"],
        hasRings: false,
        ringColors: [],
      },
      {
        type: "desert",
        colors: ["#cd853f", "#deb887", "#d2b48c", "#f5deb3", "#ffe4b5"],
        hasRings: false,
        ringColors: [],
      },
      {
        type: "ringed",
        colors: ["#6b5b95", "#9370db", "#8a2be2", "#9932cc", "#ba55d3"],
        hasRings: true,
        ringColors: ["rgba(147, 112, 219, 0.4)", "rgba(138, 43, 226, 0.3)", "rgba(186, 85, 211, 0.35)"],
      },
    ];

    const galaxyColors = [
      "rgba(196, 181, 253, 0.20)",
      "rgba(251, 207, 232, 0.18)",
      "rgba(147, 197, 253, 0.19)",
    ];

    const spawnCosmicObject = () => {
      if (!isActive) return;

      const types: CosmicObject["type"][] = ["nebula", "planet", "blackhole", "galaxy"];
      const type = types[Math.floor(Math.random() * types.length)];

      let obj: CosmicObject = {
        id: Date.now() + Math.random(),
        type,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        size: 0,
        rotation: Math.random() * 360,
        color: "",
        opacity: 0,
      };

      switch (type) {
        case "nebula":
          obj.size = Math.random() * 200 + 150;
          obj.color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
          obj.opacity = Math.random() * 0.4 + 0.2;
          break;
        case "planet":
          obj.size = Math.random() * 100 + 80;
          const selectedPlanetType = planetTypes[Math.floor(Math.random() * planetTypes.length)];
          obj.planetType = selectedPlanetType.type;
          obj.color = selectedPlanetType.colors[Math.floor(Math.random() * selectedPlanetType.colors.length)];
          obj.opacity = Math.random() * 0.2 + 0.7;
          obj.hasRings = selectedPlanetType.hasRings && Math.random() > 0.3;
          obj.hasMoons = Math.random() > 0.5;
          obj.planetSpinSpeed = Math.random() * 40 + 20;
          obj.texturePattern = Math.floor(Math.random() * 1000);
          if (obj.hasRings && selectedPlanetType.ringColors.length > 0) {
            obj.ringColor = selectedPlanetType.ringColors[Math.floor(Math.random() * selectedPlanetType.ringColors.length)];
          }
          if (obj.hasMoons) {
            obj.moonCount = Math.floor(Math.random() * 3) + 1;
            obj.moonOrbitSpeed = Math.random() * 15 + 8;
            obj.moonSizes = [];
            obj.moonOrbits = [];
            obj.moonTextures = [];
            for (let m = 0; m < obj.moonCount; m++) {
              obj.moonSizes.push(Math.random() * 0.12 + 0.08);
              obj.moonOrbits.push(1.3 + m * 0.4 + Math.random() * 0.2);
              obj.moonTextures.push(Math.floor(Math.random() * 100));
            }
          }
          const driftAngle = Math.random() * Math.PI * 2;
          const driftSpeed = Math.random() * 0.3 + 0.1;
          obj.driftDirection = {
            x: Math.cos(driftAngle) * driftSpeed,
            y: Math.sin(driftAngle) * driftSpeed,
          };
          break;
        case "blackhole":
          obj.size = Math.random() * 120 + 100;
          obj.color = "#000";
          obj.opacity = Math.random() * 0.7 + 0.3;
          obj.spinSpeed = Math.random() * 20 + 15;
          break;
        case "galaxy":
          obj.size = Math.random() * 150 + 100;
          obj.color = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
          obj.opacity = Math.random() * 0.3 + 0.15;
          obj.rotation = Math.random() * 180;
          break;
      }

      setCosmicObjects((prev) => [...prev, obj]);

      const lifetime = type === "planet" ? 46000 : Math.random() * 20000 + 25000;
      const removeTimeout = setTimeout(() => {
        setCosmicObjects((prev) => prev.filter((o) => o.id !== obj.id));
      }, lifetime);
      timeouts.push(removeTimeout);
    };

    const scheduleCosmicSpawn = () => {
      if (!isActive) return;
      const delay = Math.random() * 6000 + 4000;
      const timeout = setTimeout(() => {
        spawnCosmicObject();
        scheduleCosmicSpawn();
      }, delay);
      timeouts.push(timeout);
    };

    spawnCosmicObject();
    const secondSpawn = setTimeout(() => spawnCosmicObject(), 1000);
    const thirdSpawn = setTimeout(() => spawnCosmicObject(), 2000);
    const fourthSpawn = setTimeout(() => {
      spawnCosmicObject();
      scheduleCosmicSpawn();
    }, 3000);
    timeouts.push(secondSpawn);
    timeouts.push(thirdSpawn);
    timeouts.push(fourthSpawn);

    return () => {
      isActive = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
    <div className="fixed inset-0 z-5 overflow-hidden pointer-events-none will-change-transform">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animation: `drift ${star.driftDuration}s linear infinite alternate`,
            ["--drift-x" as string]: `${star.driftX}vw`,
            ["--drift-y" as string]: `${star.driftY}vh`,
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: `${star.size * 8}px`,
              height: `${star.size}px`,
              left: `-${star.size * 4}px`,
              top: "0",
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,${star.opacity * 0.15}), transparent)`,
              opacity: 0.5,
              filter: "blur(2px)",
              transform: `rotate(${Math.atan2(star.driftY, star.driftX) * (180 / Math.PI)}deg)`,
            }}
          />
          <div
            className="absolute rounded-full bg-white"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              transform: "translateZ(0)",
              animation: `twinkle ${star.twinkleDuration}s ease-in-out ${star.twinkleDelay}s infinite`,
              boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px rgba(255,255,255,0.3)` : "none",
            }}
          />
        </div>
      ))}

      {cosmicObjects.map((obj) => {
        if (obj.type === "nebula") {
          return (
            <div
              key={obj.id}
              className="absolute rounded-full will-change-[opacity,transform]"
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                width: `${obj.size}px`,
                height: `${obj.size}px`,
                background: `radial-gradient(ellipse at center, ${obj.color} 0%, transparent 70%)`,
                transform: `rotate(${obj.rotation}deg) translateZ(0)`,
                filter: `blur(${obj.size / 4}px)`,
                animation: "cosmicFade 8s ease-in-out forwards",
              }}
            />
          );
        }

        if (obj.type === "planet") {
          const driftX = obj.driftDirection ? obj.driftDirection.x * 150 : 0;
          const driftY = obj.driftDirection ? obj.driftDirection.y * 150 : 0;

          return (
            <div
              key={obj.id}
              className="absolute will-change-[opacity,transform]"
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                width: `${obj.size}px`,
                height: `${obj.size}px`,
                transform: "translateZ(0)",
                animation: `planetDrift 45s linear forwards`,
                ["--drift-x" as string]: `${driftX}vw`,
                ["--drift-y" as string]: `${driftY}vh`,
              }}
            >
              {obj.hasRings && (
                <div
                  className="absolute"
                  style={{
                    left: "-40%",
                    top: "35%",
                    width: "180%",
                    height: "30%",
                    background: `linear-gradient(90deg,
                      transparent 0%,
                      ${obj.ringColor || "rgba(200, 180, 160, 0.3)"} 20%,
                      transparent 35%,
                      ${obj.ringColor || "rgba(200, 180, 160, 0.25)"} 45%,
                      transparent 55%,
                      ${obj.ringColor || "rgba(200, 180, 160, 0.3)"} 65%,
                      transparent 80%,
                      transparent 100%)`,
                    borderRadius: "50%",
                    transform: "rotateX(75deg)",
                    filter: "blur(1px)",
                    zIndex: -1,
                  }}
                />
              )}
              <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  boxShadow: `
                    inset -${obj.size / 3}px -${obj.size / 3}px ${obj.size / 2}px rgba(0,0,0,0.9),
                    0 0 ${obj.size / 3}px rgba(255,255,255,0.1)
                  `,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      obj.planetType === "gas"
                        ? `linear-gradient(180deg,
                            ${obj.color}ee 0%,
                            ${obj.color} 20%,
                            ${obj.color}cc 40%,
                            ${obj.color}dd 60%,
                            ${obj.color}bb 80%,
                            ${obj.color}99 100%)`
                        : obj.planetType === "volcanic"
                          ? `radial-gradient(circle at 35% 35%,
                              ${obj.color} 0%,
                              ${obj.color}dd 30%,
                              #ff4500 45%,
                              ${obj.color}99 60%,
                              #000 100%)`
                          : obj.planetType === "oceanic"
                            ? `radial-gradient(circle at 35% 35%,
                                #ffffff44 0%,
                                ${obj.color} 15%,
                                ${obj.color}dd 40%,
                                #1e3a5f 70%,
                                #000 100%)`
                            : `radial-gradient(circle at 35% 35%,
                                ${obj.color} 0%,
                                ${obj.color}dd 40%,
                                ${obj.color}99 70%,
                                #000 100%)`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    animation: `planetTextureSpin ${obj.planetSpinSpeed || 30}s linear infinite`,
                    opacity: 0.6,
                  }}
                >
                  {obj.planetType === "rocky" && Array.from({ length: 15 }).map((_, idx) => {
                    const seed = (obj.texturePattern || 0) + idx * 137;
                    const x = ((seed * 13) % 90) + 5;
                    const y = ((seed * 17) % 90) + 5;
                    const size = ((seed * 11) % 25) + 8;
                    const opacity = ((seed * 7) % 30) / 100 + 0.15;
                    const isCrater = idx % 3 === 0;
                    return (
                      <div
                        key={idx}
                        className="absolute rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${size}%`,
                          height: `${size}%`,
                          background: isCrater
                            ? "rgba(0,0,0,0.4)"
                            : `rgba(${80 + (seed % 40)}, ${60 + (seed % 30)}, ${40 + (seed % 20)}, 0.3)`,
                          filter: `blur(${isCrater ? size / 6 : size / 3}px)`,
                          boxShadow: isCrater ? "inset 0 2px 4px rgba(0,0,0,0.5)" : "none",
                          opacity,
                        }}
                      />
                    );
                  })}
                  {obj.planetType === "oceanic" && Array.from({ length: 12 }).map((_, idx) => {
                    const seed = (obj.texturePattern || 0) + idx * 157;
                    const x = ((seed * 19) % 85) + 5;
                    const y = ((seed * 23) % 85) + 5;
                    const width = ((seed * 29) % 35) + 15;
                    const height = ((seed * 31) % 20) + 10;
                    const isCloud = idx % 4 === 0;
                    return (
                      <div
                        key={idx}
                        className="absolute"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${width}%`,
                          height: `${height}%`,
                          background: isCloud
                            ? "rgba(255,255,255,0.35)"
                            : "rgba(80,120,60,0.4)",
                          filter: `blur(${isCloud ? 3 : 2}px)`,
                          borderRadius: isCloud ? "40%" : "30%",
                          opacity: 0.6,
                        }}
                      />
                    );
                  })}
                  {obj.planetType === "ice" && Array.from({ length: 10 }).map((_, idx) => {
                    const seed = (obj.texturePattern || 0) + idx * 147;
                    const x = ((seed * 17) % 85) + 5;
                    const y = ((seed * 19) % 85) + 5;
                    const size = ((seed * 13) % 30) + 10;
                    const isCrack = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        className="absolute"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: isCrack ? `${size * 1.5}%` : `${size}%`,
                          height: isCrack ? `${size * 0.3}%` : `${size}%`,
                          background: isCrack
                            ? "rgba(150,180,210,0.5)"
                            : "rgba(220,240,255,0.4)",
                          filter: `blur(${isCrack ? 1 : 2}px)`,
                          borderRadius: isCrack ? "50%" : "40%",
                          transform: isCrack ? `rotate(${(seed * 11) % 90}deg)` : "none",
                          opacity: 0.5,
                        }}
                      />
                    );
                  })}
                  {(obj.planetType === "desert" || obj.planetType === "ringed") && Array.from({ length: 12 }).map((_, idx) => {
                    const seed = (obj.texturePattern || 0) + idx * 127;
                    const x = ((seed * 13) % 85) + 5;
                    const y = ((seed * 17) % 85) + 5;
                    const width = ((seed * 19) % 40) + 20;
                    const height = ((seed * 23) % 15) + 8;
                    return (
                      <div
                        key={idx}
                        className="absolute"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${width}%`,
                          height: `${height}%`,
                          background: `rgba(${200 + (seed % 30)}, ${180 + (seed % 25)}, ${140 + (seed % 20)}, 0.25)`,
                          filter: "blur(2px)",
                          borderRadius: "40%",
                          opacity: 0.4,
                        }}
                      />
                    );
                  })}
                  {obj.planetType === "volcanic" && Array.from({ length: 10 }).map((_, idx) => {
                    const seed = (obj.texturePattern || 0) + idx * 167;
                    const x = ((seed * 17) % 85) + 5;
                    const y = ((seed * 19) % 85) + 5;
                    const size = ((seed * 13) % 20) + 10;
                    const isLava = idx % 3 === 0;
                    return (
                      <div
                        key={idx}
                        className="absolute rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${size}%`,
                          height: `${size}%`,
                          background: isLava
                            ? "rgba(255,100,0,0.6)"
                            : "rgba(40,20,10,0.4)",
                          filter: `blur(${isLava ? 3 : 2}px)`,
                          boxShadow: isLava ? `0 0 ${size}px rgba(255,80,0,0.4)` : "none",
                          opacity: isLava ? 0.7 : 0.5,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              {obj.planetType === "gas" && (
                <div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    opacity: 0.3,
                    animation: `planetTextureSpin ${(obj.planetSpinSpeed || 30) * 0.8}s linear infinite`,
                  }}
                >
                  <div
                    className="absolute w-full"
                    style={{
                      top: `${20 + ((obj.texturePattern || 0) % 10)}%`,
                      height: "8%",
                      background: "rgba(255,255,255,0.3)",
                      filter: "blur(2px)",
                    }}
                  />
                  <div
                    className="absolute w-full"
                    style={{
                      top: `${50 + ((obj.texturePattern || 0) % 15)}%`,
                      height: "12%",
                      background: "rgba(0,0,0,0.4)",
                      filter: "blur(3px)",
                    }}
                  />
                  <div
                    className="absolute w-full"
                    style={{
                      top: `${35 + ((obj.texturePattern || 0) % 8)}%`,
                      height: "6%",
                      background: "rgba(255,200,150,0.2)",
                      filter: "blur(2px)",
                    }}
                  />
                </div>
              )}
              {obj.planetType === "volcanic" && (
                <div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    animation: `planetTextureSpin ${(obj.planetSpinSpeed || 30) * 1.2}s linear infinite`,
                  }}
                >
                  <div
                    className="absolute"
                    style={{
                      left: `${15 + ((obj.texturePattern || 0) % 20)}%`,
                      top: `${25 + ((obj.texturePattern || 0) % 15)}%`,
                      width: "18%",
                      height: "28%",
                      background: "radial-gradient(circle, #ff6600 0%, transparent 70%)",
                      filter: "blur(3px)",
                      opacity: 0.8,
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      left: `${55 + ((obj.texturePattern || 0) % 15)}%`,
                      top: `${45 + ((obj.texturePattern || 0) % 20)}%`,
                      width: "12%",
                      height: "18%",
                      background: "radial-gradient(circle, #ff4400 0%, transparent 70%)",
                      filter: "blur(2px)",
                      opacity: 0.6,
                    }}
                  />
                </div>
              )}
              {obj.planetType === "ice" && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at ${55 + ((obj.texturePattern || 0) % 20)}% ${35 + ((obj.texturePattern || 0) % 20)}%, rgba(255,255,255,0.4) 0%, transparent 30%)`,
                    filter: "blur(4px)",
                  }}
                />
              )}
              <div
                className="absolute rounded-full"
                style={{
                  inset: `-${obj.size * 0.1}px`,
                  background:
                    obj.planetType === "volcanic"
                      ? `radial-gradient(circle at center,
                          transparent 70%,
                          rgba(255,100,50,0.2) 85%,
                          rgba(255,50,0,0.1) 95%,
                          transparent 100%)`
                      : obj.planetType === "ice"
                        ? `radial-gradient(circle at center,
                            transparent 70%,
                            rgba(200,230,255,0.2) 85%,
                            rgba(150,200,255,0.1) 95%,
                            transparent 100%)`
                        : `radial-gradient(circle at center,
                            transparent 70%,
                            rgba(100,150,255,0.15) 85%,
                            rgba(100,150,255,0.05) 95%,
                            transparent 100%)`,
                  filter: "blur(2px)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  left: "15%",
                  top: "15%",
                  width: "30%",
                  height: "30%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
                  filter: "blur(3px)",
                }}
              />
              {obj.hasMoons && obj.moonCount && obj.moonSizes && obj.moonOrbits && obj.moonTextures && (
                <>
                  {Array.from({ length: obj.moonCount }).map((_, moonIdx) => {
                    const moonSize = obj.moonSizes![moonIdx] * obj.size;
                    const orbitRadiusPixels = obj.moonOrbits![moonIdx] * (obj.size / 2);
                    const moonTexture = obj.moonTextures![moonIdx];
                    const orbitDuration = (obj.moonOrbitSpeed || 15) * (1 + moonIdx * 0.3);
                    const startAngle = (moonTexture * 37) % 360;

                    return (
                      <div
                        key={`moon-${moonIdx}`}
                        className="absolute"
                        style={{
                          left: "50%",
                          top: "50%",
                          width: `${orbitRadiusPixels * 2}px`,
                          height: `${orbitRadiusPixels * 2}px`,
                          marginLeft: `-${orbitRadiusPixels}px`,
                          marginTop: `-${orbitRadiusPixels}px`,
                          animation: `moonOrbit ${orbitDuration}s linear infinite`,
                          transform: `rotate(${startAngle}deg)`,
                        }}
                      >
                        <div
                          className="absolute rounded-full overflow-hidden"
                          style={{
                            width: `${moonSize}px`,
                            height: `${moonSize}px`,
                            left: "50%",
                            top: "0",
                            marginLeft: `-${moonSize / 2}px`,
                            marginTop: `-${moonSize / 2}px`,
                            boxShadow: `inset -${moonSize / 4}px -${moonSize / 4}px ${moonSize / 2}px rgba(0,0,0,0.8)`,
                          }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `radial-gradient(circle at 30% 30%,
                                ${moonTexture % 3 === 0 ? "#999" : moonTexture % 3 === 1 ? "#777" : "#aaa"} 0%,
                                ${moonTexture % 3 === 0 ? "#444" : moonTexture % 3 === 1 ? "#333" : "#555"} 100%)`,
                            }}
                          />
                          <div className="absolute inset-0">
                            {Array.from({ length: 4 }).map((_, craterIdx) => {
                              const craterSeed = moonTexture + craterIdx * 23;
                              const cx = ((craterSeed * 19) % 60) + 20;
                              const cy = ((craterSeed * 31) % 60) + 20;
                              const csize = ((craterSeed * 13) % 20) + 8;
                              return (
                                <div
                                  key={craterIdx}
                                  className="absolute rounded-full"
                                  style={{
                                    left: `${cx}%`,
                                    top: `${cy}%`,
                                    width: `${csize}%`,
                                    height: `${csize}%`,
                                    background: "rgba(0,0,0,0.3)",
                                    boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.1)",
                                    filter: "blur(0.5px)",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        }

        if (obj.type === "blackhole") {
          return (
            <div
              key={obj.id}
              className="absolute will-change-[opacity,transform]"
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                width: `${obj.size * 2}px`,
                height: `${obj.size * 2}px`,
                animation: "blackholeCollapse 10s ease-in-out forwards",
              }}
            >
              <div
                className="absolute inset-[-20%] rounded-full"
                style={{
                  background: `conic-gradient(
                    from ${obj.rotation}deg,
                    transparent 0deg,
                    rgba(255,200,150,0.03) 60deg,
                    transparent 120deg,
                    rgba(200,180,255,0.04) 180deg,
                    transparent 240deg,
                    rgba(255,220,180,0.03) 300deg,
                    transparent 360deg
                  )`,
                  animation: `blackholeSpin ${(obj.spinSpeed || 25) * 2}s linear infinite reverse`,
                  filter: "blur(8px)",
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at center,
                    transparent 0%,
                    transparent 30%,
                    rgba(255,255,255,0.08) 35%,
                    rgba(200,180,255,0.12) 40%,
                    rgba(255,200,150,0.10) 45%,
                    transparent 50%,
                    transparent 100%)`,
                  animation: `blackholeSpin ${(obj.spinSpeed || 25) * 1.5}s linear infinite`,
                  filter: "blur(2px)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  left: "20%",
                  top: "20%",
                  width: "60%",
                  height: "60%",
                  background: `conic-gradient(
                    from ${obj.rotation}deg,
                    rgba(255,100,50,0.15) 0deg,
                    rgba(255,180,100,0.25) 90deg,
                    rgba(255,220,150,0.3) 180deg,
                    rgba(255,180,100,0.25) 270deg,
                    rgba(255,100,50,0.15) 360deg
                  )`,
                  animation: `blackholeSpin ${obj.spinSpeed || 25}s linear infinite`,
                  filter: "blur(6px)",
                  opacity: 0.6,
                }}
              />
              <div
                className="absolute"
                style={{
                  left: "15%",
                  top: "35%",
                  width: "70%",
                  height: "30%",
                  transform: "rotateX(75deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(
                      from 0deg at 50% 50%,
                      transparent 0deg,
                      rgba(255,120,80,0.4) 30deg,
                      rgba(255,180,120,0.6) 90deg,
                      rgba(255,220,160,0.7) 150deg,
                      rgba(255,180,120,0.6) 210deg,
                      rgba(255,120,80,0.4) 270deg,
                      transparent 330deg,
                      transparent 360deg
                    )`,
                    animation: `blackholeSpin ${obj.spinSpeed || 25}s linear infinite`,
                    filter: "blur(4px)",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div
                className="absolute rounded-full"
                style={{
                  left: "35%",
                  top: "35%",
                  width: "30%",
                  height: "30%",
                  background: "radial-gradient(circle, #000 0%, #000 80%, transparent 100%)",
                  boxShadow: "0 0 30px 15px rgba(0,0,0,0.95), inset 0 0 20px 10px rgba(0,0,0,1)",
                }}
              />
              <div
                className="absolute"
                style={{
                  left: "10%",
                  top: "30%",
                  width: "80%",
                  height: "40%",
                  transform: "rotateX(75deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, rgba(255,200,150,0.3) 0%, transparent 30%, transparent 70%, rgba(150,180,255,0.15) 100%)",
                    animation: `blackholeSpin ${obj.spinSpeed || 25}s linear infinite`,
                    filter: "blur(5px)",
                  }}
                />
              </div>
            </div>
          );
        }

        if (obj.type === "galaxy") {
          return (
            <div
              key={obj.id}
              className="absolute will-change-[opacity,transform]"
              style={{
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                width: `${obj.size}px`,
                height: `${obj.size * 0.4}px`,
                background: `radial-gradient(ellipse at center, ${obj.color} 0%, transparent 70%)`,
                transform: `rotate(${obj.rotation}deg) translateZ(0)`,
                filter: `blur(${obj.size / 8}px)`,
                borderRadius: "50%",
                animation: "cosmicFade 8s ease-in-out forwards",
              }}
            />
          );
        }

        return null;
      })}

      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute will-change-transform"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            transform: `rotate(${star.angle}deg) translateZ(0)`,
            animation: "shoot 0.9s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
          }}
        >
          <div
            className="h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-white/20 rounded-full"
            style={{
              width: `${star.length}px`,
              boxShadow: "0 0 6px rgba(255,255,255,0.5)",
            }}
          />
        </div>
      ))}

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: var(--star-opacity, 0.5);
            transform: scale(1) translateZ(0);
          }
          50% {
            opacity: calc(var(--star-opacity, 0.5) * 1.5);
            transform: scale(1.2) translateZ(0);
          }
        }

        @keyframes drift {
          0% {
            transform: translate(0, 0) translateZ(0);
          }
          100% {
            transform: translate(var(--drift-x, 0), var(--drift-y, 0)) translateZ(0);
          }
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(var(--angle)) translateZ(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(250px) translateY(150px) rotate(var(--angle)) translateZ(0);
            opacity: 0;
          }
        }

        @keyframes cosmicFade {
          0% {
            opacity: 0;
            transform: scale(0.8) translateZ(0);
          }
          15% {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
          85% {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.1) translateZ(0);
          }
        }

        @keyframes blackholeSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes blackholeCollapse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3) translateZ(0);
            filter: blur(10px);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) translateZ(0);
            filter: blur(0px);
          }
          75% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) translateZ(0);
            filter: blur(0px);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.15) translateZ(0);
            filter: blur(0px);
          }
          92% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(0.4) translateZ(0);
            filter: blur(2px);
          }
          96% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(0.15) translateZ(0);
            filter: blur(4px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) translateZ(0);
            filter: blur(8px);
          }
        }

        @keyframes planetDrift {
          0% {
            transform: translate(0, 0) translateZ(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--drift-x, 0), var(--drift-y, 0)) translateZ(0);
            opacity: 0;
          }
        }

        @keyframes planetTextureSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes moonOrbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default StarField;
