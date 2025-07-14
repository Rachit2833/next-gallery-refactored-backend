"use client";
import React, { useRef, useState } from "react";
import NotFoundCard from "./_MyComponents/NotFoundCard";


   const translations= [
    { language: "English", text: "Not Found (404)" },
    { language: "Spanish", text: "No encontrado (404)" },
    { language: "French", text: "Non trouvé (404)" },
    { language: "Arabic", text: "غير موجود (404)" },
    { language: "Mandarin Chinese (Simplified)", text: "未找到 (404)" },
    { language: "Russian", text: "Не найдено (404)" },
    { language: "Portuguese", text: "Não encontrado (404)" },
    { language: "German", text: "Nicht gefunden (404)" },
    { language: "Japanese", text: "見つかりません (404)" },
    { language: "Italian", text: "Non trovato (404)" },
    { language: "Korean", text: "찾을 수 없음 (404)" },
    { language: "Turkish", text: "Bulunamadı (404)" },
    { language: "Dutch", text: "Niet gevonden (404)" },
    { language: "Persian (Farsi)", text: "یافت نشد (404)" },
    { language: "Swahili", text: "Haikupatikana (404)" },
    { language: "Malay/Indonesian", text: "Tidak ditemukan (404)" },
    { language: "Hebrew", text: "לא נמצא (404)" },
    { language: "Greek", text: "Δεν βρέθηκε (404)" },
    { language: "Thai", text: "ไม่พบ (404)" },
    { language: "Ukrainian", text: "Не знайдено (404)" },
  ]
 

export default function NotFound() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const slides = Array.from(container.querySelectorAll(".snap-slide"));
    const centerY = container.scrollTop + container.clientHeight / 2;

    const closest = slides.reduce(
      (acc, el, idx) => {
        const box = el.getBoundingClientRect();
        const elCenter = box.top + box.height / 2;
        const offset = Math.abs(elCenter - container.clientHeight / 2);
        return offset < acc.offset ? { idx, offset } : acc;
      },
      { idx: 0, offset: Infinity }
    );

    setActiveIndex(closest.idx);
  };

  return (
    <div className="relative h-screen w-screen bg-[#E2DEE9] font-extrabold overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-dot-pattern" />

      {/* 404 Badge on Left */}
      <div className="absolute top-8 left-8 z-10">
        <div className="relative p-1 border-4 border-dotted border-white w-fit rounded-xl">
          <div className="absolute w-2 h-2 bg-white rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-2 h-2 bg-white rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-2 h-2 bg-white rounded-full bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
          <div className="absolute w-2 h-2 bg-white rounded-full bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
          <div className="bg-white w-32 py-4 rounded-xl text-center">
            <h1 className="text-[2.5rem] text-black leading-none font-black">
              404
            </h1>
          </div>
        </div>
      </div>

      {/* Carousel Scroll Area */}
      <div
        ref={containerRef}
        onScroll={() => {
          clearTimeout(containerRef.current._scrollTimeout);
          containerRef.current._scrollTimeout = setTimeout(handleScroll, 80);
        }}
        className="absolute top-0 right-0 h-full w-[70%] overflow-y-scroll scroll-smooth snap-y snap-mandatory py-[15vh]"
      >
        <div className="flex flex-col items-center gap-y-2">
          {translations.map((i, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                data-index={index}
                className="snap-slide snap-center flex justify-center transition-all duration-500 ease-in-out"
                style={{
                  height: "70vh",
                  transform: isActive ? "scale(1.03)" : "scale(0.93)",
                  opacity: isActive ? 1 : 0.4,
                  filter: isActive ? "none" : "blur(1px)",
                }}
              >
                <NotFoundCard text={i} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}