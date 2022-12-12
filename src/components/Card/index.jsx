import React from 'react'
import { Link as GLink } from 'gatsby'

function Card({ className, href, img, title, desc, caption, children }) {
    console.log(href)
    return (
        <GLink
            className={`flex flex-col justify-center gap-y-xs ${className}`}
            to={href}
        >
            <div className="w-auto h-[240px] flex justify-center items-center rounded-xs overflow-hidden">
                <img className="min-h-[240px] h-auto" src={img} alt={`${title} hero image`}/>
            </div>

            <h4 className="H4">
                { title }
            </h4>

            <p className="body opacity-50">
                { desc }
            </p>

            <p className="minor opacity-30">
                { caption }
            </p>
        </GLink>
    )
}

export default Card