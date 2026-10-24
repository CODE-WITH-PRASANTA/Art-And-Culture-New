import React from 'react'
import AboutMain from '../../Components/AboutMain/AboutMain'
import AboutMainArtistic from '../../Components/AboutMainArtistic/AboutMainArtistic'
import AboutStory from '../../Components/AboutStory/AboutStory'
import AboutSpecial from '../../Components/AboutSpecial/AboutSpecial'
import AboutClient from '../../Components/AboutClient/AboutClient'

const AboutUs = () => {
  return (
    <div>
        <AboutMain/>
        <AboutMainArtistic/>
        <AboutStory/>
        <AboutSpecial/>
        <AboutClient/>
    </div>
  )
}

export default AboutUs