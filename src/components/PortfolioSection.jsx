import React from 'react';
import DraggableRow from './DraggableRow';
import MusicCard from './MusicCard';
import AnimateOnScroll from './AnimateOnScroll';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';  // ถ้าต้องการ free mode (เลื่อนอิสระ) และ mousewheel

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/mousewheel';

export default function PortfolioSection({ playerState, onTrackSelect, portfolioData }) {
    return (
        <section id="portfolio" className="section">
            <div className="container">
                <AnimateOnScroll><h2 className="section-title fade-up">Works</h2></AnimateOnScroll>
                {portfolioData.map((categoryData, index) => (
                    <div key={index} className="mb-5">
                        <AnimateOnScroll>
                            <h3 className="category-title fade-up" style={{transitionDelay: `${index * 100}ms`}}>{categoryData.category}</h3>
                        </AnimateOnScroll>
                        <AnimateOnScroll className="stagger-in">
                            <Swiper
                                modules={[FreeMode, Mousewheel]}  // เพิ่ม modules ที่ต้องการ
                                spaceBetween={8}  // ช่องว่างระหว่างการ์ด (เหมือน gap: 8px ใน DraggableRow)
                                
                                freeMode={{  // ทำให้เลื่อนอิสระ เหมือน DraggableRow
                                    enabled: true,
                                    momentum: true,  // เพิ่ม momentum สำหรับการเลื่อนแบบ inertia
                                    momentumRatio: 1,
                                    momentumBounce: true,  // overscroll bounce effect
                                    momentumBounceRatio: 0.35,  // ปรับ bounce ให้คล้าย overscroll ใน DraggableRow
                                    sticky: true,  // เลื่อนแบบติดหนึบ
                                }}
                                    mousewheel={{  // รองรับ mouse wheel สำหรับเลื่อนด้วย trackpad/mouse
                                    enabled: true,
                                    forceToAxis: true,  // เลื่อนเฉพาะแนวนอน
                                }}
                                grabCursor={true}  // เปลี่ยน cursor เป็น grab เมื่อ hover
                                touchRatio={1.2}  // ปรับความไว touch (คล้าย factor ใน DraggableRow)
                                breakpoints={{  // Responsive: ปรับจำนวนการ์ดตามขนาดหน้าจอ
                                    0: { slidesPerView: 1.5 },  // มือถือ: แสดง ~1-2 การ์ด
                                    768: { slidesPerView: 3 },   // Tablet: 3 การ์ด
                                    1200: { slidesPerView: 4 },  // Desktop: 4 การ์ด
                                }}
                                onSlideChange={() => console.log('slide changed')}  // Optional: event handler ถ้าต้องการ track
                            >
                                {categoryData.items.map(item => (
                                    <SwiperSlide key={item.id}>
                                        <MusicCard 
                                            item={item} 
                                            playerState={playerState}
                                            onTrackSelect={onTrackSelect}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </AnimateOnScroll>
                    </div>
                ))}
            </div>
        </section>
    );
}

