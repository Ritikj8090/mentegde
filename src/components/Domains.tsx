"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Programming languages with their names and colors
const languages = [
  { name: "JavaScript", color: "" },
  { name: "Python", color: "" },
  { name: "Java", color: "" },
  { name: "C++", color: "" },
  { name: "C#", color: "" },
  { name: "PHP", color: "" },
  { name: "Ruby", color: "" },
  { name: "Swift", color: "" },
  { name: "Go", color: "" },
  { name: "Rust", color: "" },
  { name: "TypeScript", color: "" },
  { name: "Kotlin", color: "" },
]

const Domain = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(6)
  const [itemWidth, setItemWidth] = useState(0)

  // Update items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1)
      } else if (window.innerWidth < 768) {
        setItemsToShow(2)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(4)
      } else {
        setItemsToShow(6)
      }

      // Calculate item width based on container width
      const containerWidth = document.querySelector(".carousel-container")?.clientWidth || 0
      const gap = 16 // 4 in Tailwind = 16px
      const newItemWidth = (containerWidth - gap * (itemsToShow - 1)) / itemsToShow
      setItemWidth(newItemWidth)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [itemsToShow])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? languages.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === languages.length - 1 ? 0 : prevIndex + 1))
  }

  // Create a duplicated array for infinite scrolling effect
  const duplicatedLanguages = [...languages, ...languages]

  // Calculate the transform value for smooth scrolling
  const transformValue = -currentIndex * (itemWidth + 16) // 16px is the gap

  return (
    <div className="relative w-full mx-auto mb-4">

      <div className="flex items-center justify-between gap-4">
        {/* Left navigation button */}
        <Button variant="outline" size="icon" className="flex-shrink-0 rounded-full z-10" onClick={handlePrevious}>
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>

        {/* Carousel content */}
        <div className="flex-1 overflow-hidden carousel-container">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${transformValue}px)`,
              width: `${duplicatedLanguages.length * (itemWidth + 16) - 16}px`,
            }}
          >
            {duplicatedLanguages.map((language, index) => (
              <Button
                key={`${language.name}-${index}`}
                className={cn(" font-medium transition-all transform hover:scale-105", language.color)}
                style={{
                  width: `${itemWidth}px`,
                  flexShrink: 0,
                  flexGrow: 0,
                }}
                variant={'outline'}
              >
                {language.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Right navigation button */}
        <Button variant="outline" size="icon" className="flex-shrink-0 rounded-full z-10" onClick={handleNext}>
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}

export default Domain