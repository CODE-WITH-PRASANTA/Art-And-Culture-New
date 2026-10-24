import React from 'react'
import HeroSection from '../../Components/HeroSection/HeroSection'
import Collection from '../../Components/Collection/Collection'
import Essence from '../../Components/Essence/Essence'
import Artwork from '../../Components/Artwork/Artwork'
import Endeavor from '../../Components/Endeavor/Endeavor'
import ArtworkCategory from '../../Components/ArtworkCategory/ArtworkCategory'
import SpecialUs from '../../Components/SpecialUs/SpecialUs'
import Testimonial from '../../Components/Testimonial/Testimonial'
import HomeBlog from '../../Components/HomeBlog/HomeBlog'

const Home = () => {
  return (
    <div>
        <HeroSection />
        <Collection />
        <Essence />
        <Artwork />
        <Endeavor />
        <ArtworkCategory />
        <SpecialUs />
        <Testimonial />
        < HomeBlog />
    </div>
  )
}

export default Home