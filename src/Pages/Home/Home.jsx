import React from 'react';
import Banner from './Banner';
import BestWorker from './BestWorker';
import Testimonial from './Testimonial';
import ExtraSections from './ExtraSections ';

const Home = () => {
    return (
        <div>
            <title>Work Hive || Home</title>
            {/* banner */}
            <section className=''>
                <Banner></Banner>
            </section>
            {/* best worker */}
            <section>
                <BestWorker></BestWorker>
            </section>
            {/* testimonial */}
            <section>
                <Testimonial></Testimonial>
            </section>
            {/* extrasections */}
            <section>
                <ExtraSections></ExtraSections>
            </section>
        </div>
    );
};

export default Home;