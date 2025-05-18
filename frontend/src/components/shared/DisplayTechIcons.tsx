"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<{ tech: string; url: string }[]>(
    []
  );

  useEffect(() => {
    const fetchLogos = async () => {
      const logos = await getTechLogos(techStack);
      setTechIcons(logos);
    };

    fetchLogos();
  }, [techStack]);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          {/* Tooltip */}
          <div className="absolute z-10 px-2 py-1 mb-2 text-xs text-white transition -translate-x-1/2 bg-black rounded opacity-0 pointer-events-none bottom-full left-1/2 whitespace-nowrap group-hover:opacity-100">
            {tech}
          </div>

          <Image
            src={url}
            alt={tech}
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
