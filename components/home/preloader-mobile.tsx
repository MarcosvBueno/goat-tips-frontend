"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [isComplete, setIsComplete] = useState(false)
  const [isScaling, setIsScaling] = useState(false)

  useEffect(() => {
    const scaleTimer = setTimeout(() => {
      setIsScaling(true)
    }, 3000)

    const completeTimer = setTimeout(() => {
      setIsComplete(true)
      onComplete?.()
    }, 3800)

    return () => {
      clearTimeout(scaleTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300 ${
        isComplete ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <svg
        viewBox="0 0 511.8 531"
        className={`h-40 w-40 md:h-56 md:w-56 transition-all duration-700 ease-in-out ${
          isScaling ? "scale-[15] opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ enableBackground: "new 0 0 511.8 531" } as CSSProperties}
      >
        {/* Primeiro path - parte superior */}
        <path
          className="animate-draw-1"
          d="M362.8,160.2c0.7,1.4,2.2,2.3,3.8,2.3H405c1,0,2-0.4,2.8-1l59.5-51.1c3-2.6,1.2-7.5-2.8-7.5H340.8
            c-3.2,0-5.2,3.3-3.8,6.2L362.8,160.2z"
          fill="none"
          stroke="#012AFE"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Segundo path - corpo principal */}
        <path
          className="animate-draw-2"
          d="M510,312.9l-82.3-82.3c-3.4-3.4-9.2-1.6-10,3.2l-11.9,68.7c-0.5,2.9-3,5-5.9,4.9l-173-2.7
            c-3.7-0.1-6.4-3.4-5.7-7l11.9-62.9c0.9-4.7,6.6-6.5,10-3.1l20.1,19.7l-2.6,24.4c-0.4,4.6,1,3.8,2.9,1.4c2.9-3,6.2-4.9,9.9-6.2
            c1.3-0.4,2.5,0.6,2.4,2l0,0c-0.7,4.6-0.7,4.3,3,1.6c3.7-2.7,1.9-1.4,2.9-1.9c1.3-0.7,2.9-0.4,3.9,0.6l1.9,1.9
            c1.8,1.7,4.5,2.2,6.7,1.1l7.5-3.6l79.4-37.7c2.8-1.3,4-4.7,2.6-7.5L319.9,98.7c-0.4-0.8-0.6-1.7-0.6-2.6V28.7c0-0.9-0.4-1.8-1-2.4
            L273.9,0.5l-4.8,0l-66.4,56.4c-9.4,7.9-9.3,7.9,3,5.7c12.3-2.2,53.8-6.9,53.8-6.9c2.1-0.4,4,1.2,4,3.3v23.6c0,3.3-2.7,6-6,5.9
            l-70.7-0.5c-3.3,0-5.9-2.7-5.9-5.9c0,0,0.4-56.7,0-55.6c-0.4,1.1,0,0,0,0C166.8,16.2,135.5,0,135.5,0l-4.8,0
            c0,0-61.5,52.8-70.1,60.6s-11.7,8.8,3,5.7c15.4-2.5,55-10.6,55-10.6c2.1-0.4,4,1.2,4,3.3v37.4c0,3.3-2.7,5.9-5.9,5.9H7.6
            c-5.3,0-7.9,6.4-4.2,10.1l61.2,61.1c1.2,1.2,2.8,1.9,4.5,1.9l48.7-0.3c5,0,8.1,5.4,5.4,9.7L52.9,298.5c-2.4,3.9,0.4,9,5,9.1
            l30.8,0.2c5.3,0,7.9,6.4,4.1,10.1l-45.4,45.4c-1.8,1.8-2.3,4.7-1,7l83.8,157.6c2.1,4,7.8,4.2,10.3,0.4l62-98.6
            c2.5-4,8.4-3.6,10.4,0.6l44.4,93.3c2,4.2,7.8,4.6,10.3,0.7l56.6-86.4c2.6-3.9,8.5-3.5,10.4,0.8l39.1,87.9c1.9,4.4,8,4.8,10.5,0.7
            l126.7-207C512.3,317.9,512,314.8,510,312.9z M211.1,178.5c-0.5-0.4-1-0.9-1.4-1.4c-15.8-22,8.6-46.4,30.6-30.6
            c0.5,0.4,1,0.9,1.4,1.4C257.5,169.9,233.2,194.3,211.1,178.5z"
          fill="none"
          stroke="#012AFE"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Primeiro path - fill após animação */}
        <path
          className="animate-fill-1"
          d="M362.8,160.2c0.7,1.4,2.2,2.3,3.8,2.3H405c1,0,2-0.4,2.8-1l59.5-51.1c3-2.6,1.2-7.5-2.8-7.5H340.8
            c-3.2,0-5.2,3.3-3.8,6.2L362.8,160.2z"
          fill="#012AFE"
        />
        {/* Segundo path - fill após animação */}
        <path
          className="animate-fill-2"
          d="M510,312.9l-82.3-82.3c-3.4-3.4-9.2-1.6-10,3.2l-11.9,68.7c-0.5,2.9-3,5-5.9,4.9l-173-2.7
            c-3.7-0.1-6.4-3.4-5.7-7l11.9-62.9c0.9-4.7,6.6-6.5,10-3.1l20.1,19.7l-2.6,24.4c-0.4,4.6,1,3.8,2.9,1.4c2.9-3,6.2-4.9,9.9-6.2
            c1.3-0.4,2.5,0.6,2.4,2l0,0c-0.7,4.6-0.7,4.3,3,1.6c3.7-2.7,1.9-1.4,2.9-1.9c1.3-0.7,2.9-0.4,3.9,0.6l1.9,1.9
            c1.8,1.7,4.5,2.2,6.7,1.1l7.5-3.6l79.4-37.7c2.8-1.3,4-4.7,2.6-7.5L319.9,98.7c-0.4-0.8-0.6-1.7-0.6-2.6V28.7c0-0.9-0.4-1.8-1-2.4
            L273.9,0.5l-4.8,0l-66.4,56.4c-9.4,7.9-9.3,7.9,3,5.7c12.3-2.2,53.8-6.9,53.8-6.9c2.1-0.4,4,1.2,4,3.3v23.6c0,3.3-2.7,6-6,5.9
            l-70.7-0.5c-3.3,0-5.9-2.7-5.9-5.9c0,0,0.4-56.7,0-55.6c-0.4,1.1,0,0,0,0C166.8,16.2,135.5,0,135.5,0l-4.8,0
            c0,0-61.5,52.8-70.1,60.6s-11.7,8.8,3,5.7c15.4-2.5,55-10.6,55-10.6c2.1-0.4,4,1.2,4,3.3v37.4c0,3.3-2.7,5.9-5.9,5.9H7.6
            c-5.3,0-7.9,6.4-4.2,10.1l61.2,61.1c1.2,1.2,2.8,1.9,4.5,1.9l48.7-0.3c5,0,8.1,5.4,5.4,9.7L52.9,298.5c-2.4,3.9,0.4,9,5,9.1
            l30.8,0.2c5.3,0,7.9,6.4,4.1,10.1l-45.4,45.4c-1.8,1.8-2.3,4.7-1,7l83.8,157.6c2.1,4,7.8,4.2,10.3,0.4l62-98.6
            c2.5-4,8.4-3.6,10.4,0.6l44.4,93.3c2,4.2,7.8,4.6,10.3,0.7l56.6-86.4c2.6-3.9,8.5-3.5,10.4,0.8l39.1,87.9c1.9,4.4,8,4.8,10.5,0.7
            l126.7-207C512.3,317.9,512,314.8,510,312.9z M211.1,178.5c-0.5-0.4-1-0.9-1.4-1.4c-15.8-22,8.6-46.4,30.6-30.6
            c0.5,0.4,1,0.9,1.4,1.4C257.5,169.9,233.2,194.3,211.1,178.5z"
          fill="#012AFE"
        />
      </svg>

      <style jsx>{`
        .animate-draw-1 {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          animation: draw 1s ease-out forwards;
        }

        .animate-draw-2 {
          stroke-dasharray: 4000;
          stroke-dashoffset: 4000;
          animation: draw-main 2s ease-out forwards;
          animation-delay: 0.5s;
        }

        .animate-fill-1 {
          opacity: 0;
          animation: fill-in 0.3s ease-out forwards;
          animation-delay: 1s;
        }

        .animate-fill-2 {
          opacity: 0;
          animation: fill-in 0.5s ease-out forwards;
          animation-delay: 2.5s;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-main {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fill-in {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
