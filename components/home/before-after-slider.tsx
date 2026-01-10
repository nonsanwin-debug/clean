"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { ChevronsLeftRight } from "lucide-react"

export default function BeforeAfterSlider() {
    const [sliderPosition, setSliderPosition] = React.useState(50)
    const [isDragging, setIsDragging] = React.useState(false)

    const containerRef = React.useRef<HTMLDivElement>(null)

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
        if (!containerRef.current) return

        const { width, left } = containerRef.current.getBoundingClientRect()
        // info.point.x is the absolute x coordinate
        // We can also use clientX if available, but framer-motion info is convenient if we used drag controls.
        // However, since we are implementing a custom slider logic often, let's stick to simple mouse move or use a range input approach.
        // Actually, a simpler way with Framer Motion logic:

        // Let's use a standard range input styled or a custom drag implementation.
        // Custom drag implementation gives smoother feel.
    }

    // Simpler approach: Use a standard event handler for mouse/touch move
    const handleMove = (clientX: number) => {
        if (!containerRef.current) return
        const { left, width } = containerRef.current.getBoundingClientRect()
        const position = ((clientX - left) / width) * 100
        setSliderPosition(Math.min(100, Math.max(0, position)))
    }

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        if (isDragging) handleMove(e.touches[0].clientX)
    }

    const handleInteractionStart = () => setIsDragging(true)
    const handleInteractionEnd = () => setIsDragging(false)

    return (
        <div
            className="relative w-full h-[500px] overflow-hidden rounded-xl select-none cursor-ew-resize group"
            ref={containerRef}
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onMouseMove={onMouseMove}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onTouchMove={onTouchMove}
        >
            {/* After Image (Background) - Clean */}
            <div className="absolute inset-0">
                <Image
                    src="/images/after.png"
                    alt="After Cleaning"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    After
                </div>
            </div>

            {/* Before Image (Foreground) - Dirty - Clipped */}
            <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
                initial={false}
            >
                <div className="absolute inset-0 w-full h-full"> {/* Inner container to maintain aspect ratio/position */}
                    {/* Note: We need to make sure the image effectively acts as if it's full width but cropped. 
                 Next.js Image with fill inside a flex width container will resize. 
                 To crop, we need a fixed width equal to parent inside.
             */}
                    <div className="relative w-[100vw] max-w-[1280px] h-full h-[500px]">
                        {/* This width calc is tricky because parent width is dynamic. 
                   Better approach: Use the same dimensions as parent.
               */}
                        <Image
                            src="/images/before.png"
                            alt="Before Cleaning"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Fix for the clipping issue above: 
            The easiest pure CSS way is to having the image be full width of the CONTAINER, not the clipped div.
            But the clipped div constrains the view. 
        */}
            </motion.div>

            {/* Logic Retry for Image Positioning */}
            <div
                className="absolute inset-0 overflow-hidden border-r-4 border-white"
                style={{ width: `${sliderPosition}%` }}
            >
                <Image
                    src="/images/before.png"
                    alt="Before Cleaning"
                    fill
                    className="object-cover object-left"
                    priority
                />
                <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Before
                </div>
            </div>

            {/* Slider Handle */}
            {/* 
          The previous div acts as the clipper. 
          The `object-left` on the image ensures that as the width shrinks, 
          the left side (start) of the image stays anchored, creating the wipe effect.
          Wait, `object-cover` + `width: %` on container might shrink the image itself if not careful.
          Actually, `object-cover` tries to fill the container. If the container shrinks, the image shrinks or re-aspects?
          No, `Next/Image` with `fill` and `object-cover` will try to cover the available space.
          
          CORRECT CSS TRICK:
          The Inner Image needs to be the width of the PARENT, not the clipped container.
          So, we shouldn't use `fill` directly on a shrinking container without setting a fixed width on the image element?
          
          Let's use a standard `img` tag or set width explicitly to the parent's generic width.
          OR, use `clip-path`? `clip-path` is much cleaner for this.
      */}
        </div>
    )
}

// Rewriting for Clip-Path consistency
export function BeforeAfterSliderRevised() {
    const [sliderPosition, setSliderPosition] = React.useState(50)
    const [isDragging, setIsDragging] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return
        const { left, width } = containerRef.current.getBoundingClientRect()
        const position = ((clientX - left) / width) * 100
        setSliderPosition(Math.min(100, Math.max(0, position)))
    }

    const onMouseMove = (e: React.MouseEvent) => { if (isDragging) handleMove(e.clientX) }
    const onTouchMove = (e: React.TouchEvent) => { if (isDragging) handleMove(e.touches[0].clientX) }

    return (
        <div
            className="relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-2xl cursor-col-resize select-none shadow-2xl"
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={onMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={onTouchMove}
        >
            {/* Background (After - Clean) */}
            <Image
                src="/images/after.png"
                alt="After"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute top-6 right-6 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg z-10">
                After
            </div>

            {/* Foreground (Before - Dirty) - Clipped */}
            <div
                className="absolute inset-0"
                style={{
                    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                }}
            >
                <Image
                    src="/images/before.png"
                    alt="Before"
                    fill
                    className="object-cover" // This works because the div itself is full width/height, only visibility is clipped!
                    priority
                />
                <div className="absolute top-6 left-6 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                    Before
                </div>
            </div>

            {/* Handle Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg text-primary">
                    <ChevronsLeftRight size={24} />
                </div>
            </div>
        </div>
    )
}
