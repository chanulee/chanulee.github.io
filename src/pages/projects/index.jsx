import React from "react"
import { graphql, useStaticQuery, withPrefix } from 'gatsby'
import { v4 as uuid } from 'uuid'

import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

import Card from '../../components/Card'


function Projects() {
    const data = useStaticQuery(graphql`
        query ProjectList {
            allMarkdownRemark(
                sort: [{frontmatter: { order: ASC }}]
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
            <Nav/>

            <header className="w-full mt-xxl2 mb-xxl3 px-xxl4 grid grid-cols-2 gap-x-l">
                <h1 className="H1 mb-l col-span-2">
                    Projects
                </h1>
                <p className="Subtitle opacity-50 col-span-1">
                    Trans-Disciplinary, Learning By Doing, Collaborative projects
                </p>
            </header>

            <main className="w-full mb-xxl5 px-xxl4 grid grid-cols-12 gap-x-l gap-y-xxl items-start">
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
            </main>

            <Footer/>
        </>
    )
}

export default Projects
