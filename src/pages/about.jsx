import React from "react"
import { withPrefix } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Nav from '../components/Nav'
import Footer from '../components/Footer'

import Link from '../components/Link'

import Download from '../images/downarrow.svg'

function AboutPage() {
    return (
        <>
            <Nav/>

            <header className="w-full mt-xxl2 mb-xxl3 px-xxl4 flex flex-col">
                <p className="mb-xs Subtitle opacity-50">
                    About
                </p>
                <h1 className="H1">
                    CHANWOO LEE
                </h1>
            </header>

            <main className="w-full mb-xxl3 px-xxl4 grid grid-cols-12 gap-x-l">
                <div className="col-span-8 flex flex-col">
                    <h3 className="H3R mb-xxl3">
                        Chanwoo is a designer, artist and media technologist.<br/>
                        <br/>
                        He spots and solves problems regarding technology and human with imagination, design and engineering.<br/>
                        <br/>
                        He has keen interest in contemporary and emerging technologies such as Web, AI, XR, Robotics and its interaction with human and society.<br/>
                    </h3>

                    <p className="Body24 mb-xxl">
                        He is a research intern at MALer Lab↗, (Dept. of Art & Technology, Graduate School of AI) Sogang University and has been running a multi-disciplinary creative studio Superbloom since 2019.<br/>
                        <br/>
                        Chanwoo's works have been presented at various conferences including Korea Computer Congress '22, HCI Korea ('19 '21), and Festival of Nature ('22, UK). Some of his clients and employers include LG Corp, KT, Gallery Hyundai, MBC and Art Center Nabi.    
                    </p>

                    <Link className="w-fit H4R" href={withPrefix("/approach")}>
                        Approach
                    </Link>
                </div>

                <aside className="col-span-4 flex flex-col">
                    <StaticImage className="w-full rounded-m" src="../images/profile.JPG" alt="profile picture of chanwoo lee"/>
                    <Link href="https://drive.google.com/file/d/1JWyc6PEvfI86qygfqS8mHAzSXstRtHi-/view" blank={true} className="w-fit H4R mt-l" noArrow={true}>
                        Download CV
                        <Download className="ml-xs"/>
                    </Link>
                </aside>
            </main>

            <summary className="w-full px-xxl4 pt-xxl3 pb-xxl4 grid grid-cols-12 gap-x-l bg-grey">
                <aside className="H4 col-span-4">
                    More Info
                </aside>

                <div className="col-span-8 grid grid-cols-8 gap-x-l gap-y-xxl">
                    <div className="col-span-4">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1"/>
                        <p className="mt-xs mb-m body opacity-50">
                            RESEARCH
                        </p>

                        <p className="body">
                            NRF (National Research Foundation)<br/>
                            NIA (National Information Society Agency)<br/>
                            ETRI (Electronics and Telecommunications Research Institute)<br/>
                            <br/>
                            Sogang University<br/>
                            Music and Art Learning Group<br/>
                            BaSE Lab<br/>
                            Lifetyle Media Group
                        </p>
                    </div>

                    <div className="col-span-4">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1"/>
                        <p className="mt-xs mb-m body opacity-50">
                            Funded, Commissioned, Supported by
                        </p>

                        <p className="body">
                            Watershed<br/>
                            British Council<br/>
                            Smilegate<br/>
                            Korea Foundation<br/>
                            Ministry of Education<br/>
                            Ministry of Science and ICT<br/>
                            Platform-L Contemporary Art Center<br/>
                            Art Council Korea (ARKO)
                        </p>
                    </div>

                    <div className="col-span-4">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1"/>
                        <p className="mt-xs mb-m body opacity-50">
                            Worked with
                        </p>

                        <p className="body">
                            LG Corp.<br/>
                            HSAd.<br/>
                            KT Corp.<br/>
                            Gallery Hyundai<br/>
                            MBC<br/>
                            Art Center Nabi<br/>
                            INNODESIGN<br/>
                            ALTAVA Group<br/>
                            Yeemock Gallery<br/>
                        </p>
                    </div>

                    <div className="col-span-4">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1"/>
                        <p className="mt-xs mb-m body opacity-50">
                            Conference / Invited Talk
                        </p>

                        <p className="body">
                            Festival of Nature<br/>
                            Korea Computer Congress<br/>
                            Human-Computer Interaction Korea<br/>
                        </p>
                    </div>

                    <div className="col-span-4">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1"/>
                        <p className="mt-xs mb-m body opacity-50">
                            Featured in
                        </p>

                        <p className="body">
                            Monthly DESIGN<br/>
                            100Film 100Poster @ Jeonju IFF<br/>
                            The British Council Climate Connections Seminar (London and online)<br/>
                            WWF Climate Energy Conference Korea<br/>
                            Talking about Art in the era of Climate Crisis, ARKO & IGT(Institute for Green Transformation)<br/>
                            Global Forum for Culture and Youth, KOCIS<br/>
                        </p>
                    </div>
                </div>

            </summary>

            <Footer/>
        </>
    )
}

export default AboutPage
