import React from "react"
import { graphql, useStaticQuery } from 'gatsby'
import { v4 as uuid } from 'uuid'

import Nav from '../components/Nav'
import Footer from '../components/Footer'

function ProjectDetails({ data }) {
    const { markdownRemark } = data

    const { frontmatter: values } = markdownRemark

    return (
        <>
            <Nav/>

            <header className="w-full mb-xxl2 px-xxl4 grid grid-cols-12 gap-x-l">
                <img 
                    className="col-span-12 mb-xxl2"
                    src={ values.hero }
                    alt={`${ values.title } hero image`}
                />
                <h2 className="H2 mb-m col-span-9">
                    { values.title }
                </h2>
                <p className="Subtitle opacity-50 col-span-9">
                    { values.desc }
                </p>
            </header>

            <main className="w-full px-xxl4 flex flex-col">
                <div className="w-full mb-xl grid grid-cols-12 gap-x-l">
                    <h4 className="H4 opacity-50 col-span-3">
                        Brief
                    </h4>
                    <p className="Body24 col-span-9">
                        { values?.brief }
                    </p>
                </div>
                <div className="w-full mb-xl grid grid-cols-12 gap-x-l">
                    <h4 className="H4 opacity-50 col-span-3">
                        Context
                    </h4>
                    <p className="Body24 col-span-9">
                        { values?.context }
                    </p>
                </div>
                <div className="w-full mb-xxl2 grid grid-cols-12 gap-x-l">
                    <h4 className="H4 opacity-50 col-span-3">
                        Solution
                    </h4>
                    <p className="Body24 col-span-9">
                        { values?.solution }
                    </p>
                </div>

                <div className="w-full mb-xxl3 grid grid-cols-12 gap-x-l">
                    <div className="col-span-3">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1 opacity-50"/>
                        <p className="mb-m body opacity-50">
                            Skills & Role
                        </p>
                        { values?.skill_role?.split(',').map(line => {
                            const trimed = line.trim()
                            return (
                                <p className="body">
                                    { trimed }
                                </p>
                            )
                        }) }
                    </div>
                    <div className="col-span-3">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1 opacity-50"/>
                        <p className="mb-m body opacity-50">
                            Type
                        </p>
                        { values?.type?.split(',').map(line => {
                            const trimed = line.trim()
                            return (
                                <p className="body">
                                    { trimed }
                                </p>
                            )
                        }) }
                    </div>
                    <div className="col-span-3">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1 opacity-50"/>
                        <p className="mb-m body opacity-50">
                            Timeline
                        </p>
                        <p className="body">
                            {`${values?.timeline} (${values?.duration})`}
                        </p>       
                    </div>
                    <div className="col-span-3">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1 opacity-50"/>
                        <p className="mb-m body opacity-50">
                            Associated with
                        </p>
                        { values?.associations?.split(',').map(line => {
                            const trimed = line.trim()
                            return (
                                <p className="body">
                                    { trimed }
                                </p>
                            )
                        }) }
                    </div>
                </div>

                { values.video && (
                    <div className="w-full mb-xxl3 flex flex-col">
                        <h4 className="H4 mb-m">
                            Video
                        </h4>
                        <iframe 
                            className="w-full"
                            src={values.video}
                            width="100%" 
                            height="auto" 
                            frameborder="0" 
                            allow="fullscreen; picture-in-picture" 
                            allowfullscreen
                        />
                    </div>
                )}

                <div className="w-full mb-xxl3 flex flex-col">
                    <h4 className="H4 mb-m col-span-12">
                        Gallery
                    </h4>
                    <div className="grid grid-cols-12 gap-x-l gap-y-xxl">
                        { values?.gallery?.map((obj, idx) => (
                            <div className="col-span-4" key={uuid()}>
                                <img 
                                    className="w-full mb-xs"
                                    src={obj[1]} 
                                    alt={`project gallery ${idx}`} 
                                />
                                <p className="body opacity-50">
                                    {obj[0]}
                                </p>
                            </div>
                        )) }
                    </div>
                </div>

                <div className="w-full mb-xxl3 flex flex-col">
                    <h4 className="H4 mb-m col-span-12">
                        Process
                    </h4>
                    <div className="grid grid-cols-12 gap-x-l gap-y-xxl">
                        { values?.process?.map((obj, idx) => (
                            <div className="col-span-4" key={uuid()}>
                                <img 
                                    className="w-full mb-xs"
                                    src={obj[1]} 
                                    alt={`project gallery ${idx}`} 
                                />
                                <p className="body opacity-50">
                                    {obj[0]}
                                </p>
                            </div>
                        )) }
                    </div>
                </div>

                <div className="w-full mb-xxl3 grid grid-cols-12 gap-x-l">
                    <div className="col-span-4">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1 opacity-50"/>
                        <p className="mb-m body opacity-50">
                            Collaborated with
                        </p>
                        { values?.collaborators?.split(',').map(line => {
                            const trimed = line.trim()
                            return (
                                <p className="body">
                                    { trimed }
                                </p>
                            )
                        }) }
                    </div>
                    <div className="col-span-4">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1 opacity-50"/>
                        <p className="mb-m body opacity-50">
                            Professor
                        </p>
                        { values?.professor?.split(',').map(line => {
                            const trimed = line.trim()
                            return (
                                <p className="body">
                                    { trimed }
                                </p>
                            )
                        }) }
                    </div>
                    <div className="col-span-4">
                        <hr className="w-full mb-xs stroke-dark-grey stroke-1 opacity-50"/>
                        <p className="mb-m body opacity-50">
                            Links
                        </p>
                        { values?.links?.map(line => (
                            <a className="body block" href={line[1]}>
                                { line[0] }
                            </a>
                        )) }
                    </div>
                </div>
            </main>

            <Footer/>
        </>
    )
}

export default ProjectDetails

export const query = graphql`
    query singleProject ($slug: String) {
        markdownRemark(frontmatter: { slug: { eq: $slug } }) {
            frontmatter {
                hero
                title
                desc
                caption
                brief
                context
                solution
                skill_role
                type
                timeline
                duration
                associations
                video
                gallery
                process
                collaborators
                professor
                links
            }
        }
    }
`
