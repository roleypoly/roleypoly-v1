import * as React from 'react'
import { GoX, GoThumbsup } from 'react-icons/go'
import goodImg from './images/whynoroles-good.png'
import badImg from './images/whynoroles-bad.png'

const WhyNoRoles = (props) => {
  return (
    <>
      <h2>Why don't I see any roles in my editor?</h2>
      <p>
        Roleypoly needs to be a higher role position than other roles in order to assign
        them to anyone.
      </p>
      <h3 className="pages__bad">
        Bad <GoX className="smol-bump" />
      </h3>
      <img src={badImg} className="rp-discord" alt="Bad example" />
      <p>
        In this example, Roleypoly is at the bottom of the list. It can't assign anyone
        any roles above it.
      </p>
      <h3 className="pages__good">
        Good <GoThumbsup className="smol-bump" />
      </h3>
      <img src={goodImg} className="rp-discord" alt="Good example" />
      <p>
        In this example, Roleypoly is above other roles, and will be able to assign them.
      </p>
    </>
  )
}

export default WhyNoRoles
