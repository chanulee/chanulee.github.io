import React from 'react'
import { withPrefix } from 'gatsby'

import Tag from '../Tag'
import RightArrow from '../../images/rightarrow.svg'

function Link({ className, href, blank=false, noArrow=false, children }) {
    return (
        <a href={href} target={ blank ? '_blank' : '_self'}>
            <Tag className={className}>
                { children }
                { !noArrow && <RightArrow className="ml-xs fill-black"/> }
            </Tag>
        </a>
    )
}

export default Link