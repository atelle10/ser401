import React, { useEffect, useRef } from 'react';
import { createSwapy } from 'swapy'

const TestDash = () => {
  const swapyRef = useRef(null)

  useEffect(() => {
    const swapy = createSwapy(swapyRef.current)
    // Optional: handle swap events
    swapy.onSwap((event) => {
      console.log(event.data.object)
    })
  }, [])

  return (
    <div ref={swapyRef} className="grid grid-cols-2 gap-4">
      <div data-swapy-slot="foo" className="p-4 bg-gray-100 col-span-2">
        <div data-swapy-item="a" className="p-4 bg-blue-500 text-white col-span-2">Item A</div>
      </div>
      <div data-swapy-slot="bar" className="p-4 bg-gray-100 col-span-2">
        <div data-swapy-item="b" className="p-4 bg-green-500 text-white col-span-1">Item B</div>
      </div>
    </div>
  )
}

export default TestDash