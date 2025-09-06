import React from 'react'
import MaskedDiv from './ui/masked-div'

const MaksedDivCard = () => {
  return (
    <div className="z-9 max-h-screen w-[100%] px-5 py-5 flex justify-center items-center overflow-hidden">
         <MaskedDiv maskType="type-2" className="my-4">
        <video
          className="cursor-pointer transition-all duration-300 hover:scale-105"
          autoPlay
          loop
          muted
        >
          <source
            src="https://videos.pexels.com/video-files/18069232/18069232-uhd_2560_1440_24fps.mp4"
            type="video/mp4"
          />
        </video>
      </MaskedDiv>
    </div>
  )
}

export default MaksedDivCard
