import React from "react"
import { graphql, useStaticQuery, withPrefix } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { v4 as uuid } from 'uuid'

import Nav from '../components/Nav'
import Footer from '../components/Footer'

import Card from '../components/Card'
import Link from '../components/Link'
import Tag from '../components/Tag'

function IndexPage() {
    const data = useStaticQuery(graphql`
        query ProjectSix {
            allMarkdownRemark(
                sort: [{frontmatter: { order: ASC }}], 
                limit: 6
            ) {
                nodes {
                    frontmatter {
                        title
                        desc
                        caption
                        hero
                        slug
                    }
                }
            }
        }
    `)

    const projects = data.allMarkdownRemark.nodes

    return (
        <>
            <header className="w-full">
                <Nav className="absolute top-0 z-10" transparent={true}/>
                <div className="w-full h-[524px] px-xxl4 pt-[175px] relative">

                    <div className="w-full h-full flex justify-center items-center absolute top-0 left-0 overflow-hidden -z-10">
                        <StaticImage 
                            className="w-full"
                            src='../images/landing.jpeg'
                            alt="wearable device"
                        />
                    </div>
                    
                    <h1 className="H1 text-white">
                        Positive Impact of<br/>
                        Technology on the real<br/> 
                        world via Design  
                    </h1>
                </div>
            </header>

            <main className="w-full px-xxl4 pt-xxl3 pb-xxl5">
                <div className="w-full mb-xxl4 grid grid-cols-12 gap-x-l">
                    <p className="col-span-2 body">
                        introduction
                    </p>

                    <h3 className="col-span-8 mb-xl H3R">
                        Hi, I'm Chanwoo Lee - <br/>
                        designer, artist and engineer.<br/>
                        <br/>
                        My passion is to make positive impacts on the real world by designing technology.<br/>
                        <br/>
                        I spot and solve problems regarding technology and society for a better future.
                    </h3>

                    <div className="col-start-3 col-end-5 flex gap-x-m">
                        <Link className="H4R" href={withPrefix("/about")}>
                            About
                        </Link>

                        <Link className="H4R" href={withPrefix("/approach")}>
                            Approach
                        </Link>
                    </div>
                </div>

                <div className="w-full mb-xxl4 grid grid-cols-12 gap-x-l">
                    <p className="col-span-2 body">
                        Keywords of Interest
                    </p>

                    <div className="col-span-6 flex flex-wrap gap-x-m gap-y-l">
                        {
                            ['Human-Computer Interaction', 'Better Future', 'STEM', 'Research', 'AI', 'XR', 'Web', 'Sustainability', 'Creative Community'].map((word, idx) => (
                                <Tag 
                                    className="H4R" 
                                    primary={idx < 1 ? true : false}
                                    key={uuid()}
                                > 
                                    { word } 
                                </Tag>
                            ))
                        }
                    </div>
                </div>

                <div className="w-full mb-xxl3 flex flex-col">
                    <div className="mb-xl flex items-center">
                        <div className="w-l h-l mr-m rounded-full bg-black"/>
                        <h4 className="H3">
                            Projects
                        </h4>
                    </div>

                    <div className="w-full mb-xxl grid grid-cols-12 gap-x-l gap-y-xxl2 items-start">
                        {
                            projects.map(obj => {

                                const { title, desc, caption, slug, hero } = obj.frontmatter

                                return (
                                    <Card
                                        className="col-span-4"
                                        href={`/projects/${slug}`}
                                        img={hero}
                                        title={title}
                                        desc={desc}
                                        caption={caption}
                                        key={uuid()}
                                    />
                                )
                            })
                        }
                    </div>

                    <Link 
                        className="w-fit H4R"
                        href={withPrefix('/projects')} 
                        noArrow={true}
                    >
                        + More
                    </Link>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default IndexPage
