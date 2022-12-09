import React from "react"

import Nav from '../components/Nav'
import Footer from '../components/Footer'


function ApproachPage() {
    return (
        <>
            <Nav/>

            <header className="w-full mt-xxl2 mb-xxl3 px-xxl4 flex flex-col">
                <h1 className="H1 mb-m">
                    Approach
                </h1>
                <p className="Subtitle opacity-50">
                    1. Imagine a better future<br/>
                    2. Design a future technology<br/>
                    3. Bring it to everyday life<br/>
                </p>
            </header>

            <main className="w-full px-xxl4 flex flex-col">
                <div className="flex flex-col mb-xxl3">
                    <p className="Subtitle opacity-50">
                        Viewpoint on technology
                    </p>
                    <h3 className="H3R">
                        Creativity comes from context
                    </h3>
                    <p className="Body24">
                        The world we live in is constantly changing, and fast paced development of technology is one of the main reasons for it. Technology does not exists solely. It should be handled with its context with its stakeholders - how it was initiated, how it affects society and human behavior.
                    </p>
                </div>

                <div className="flex flex-col mb-xxl3">
                    <p className="Subtitle opacity-50">
                        Design Approach
                    </p>
                    <h3 className="H3R">
                        Art as a research, Design and Engineering as a practice.
                    </h3>
                    <p className="Body24">
                        New Media art is a free space, kind of a lab, for all kinds of experiments with technology for me. While making an artwork, I conduct research about the technology - how it ‘actually’ works, its impact on our everyday life, essence of the technology. Through this process, it is possible to spot the essence of the technology. It’s character, pros and cons, how it can be used in ~
                    </p>
                </div>

                <div className="flex flex-col mb-xxl3">
                    <p className="Subtitle opacity-50">
                        Mindset to design a better future
                    </p>
                    <h3 className="H3R">
                        Positivity: Better Future and Witty Expression
                    </h3>
                    <p className="Body24">
                        Try not to forget that I’m dealing with technology - it’s powerful and impactful. It might be used as a kind of bomb if it is not handled with care.<br/>
                        On the humaniy and society side, there are lots of problems as the society is getting more and more complex. Climate Crisis, for instance, is really a complex and hard problem it seems.<br/>
                        With this kind of responsibility and depressing situation, it’s quite easy to become overwhelmed. I try not to forget that I design to solve problem for better future, better life. NEVER BE DEPRESSED, DON’T LOSE HOPE.
                    </p>
                </div>

                <div className="flex flex-col mb-xxl3">
                    <p className="Subtitle opacity-50">
                        How I learn and improve
                    </p>
                    <h3 className="H3R">
                        Learning By Doing
                    </h3>
                    <p className="Body24">
                        One thing about technology and society these days - things chnage really drastically. Technology and technique learned today might not be useful in several years. Important part is to know how to learn new technology and
                    </p>
                </div>

            </main>

            <Footer/>
        </>
    )
}

export default ApproachPage
