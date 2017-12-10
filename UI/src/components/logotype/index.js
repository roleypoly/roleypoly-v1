import React from 'react'

const Logotype = ({fill = 'var(--c-7)', width, height, circleFill, typeFill, style, className}) => (
  <svg style={style} className={className} viewBox='0 0 1566 298' version='1.1' xmlns='http://www.w3.org/2000/svg'>
    <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <text id='Roleypoly' fontFamily='HelveticaNeue-Medium, Helvetica Neue' fontSize='288' fontWeight='400' fill={typeFill || fill}>
        <tspan x='249' y='238'>Roleypoly</tspan>
      </text>
      <defs>
        <path d='M86.5351562,318.050781 C171.587008,318.050781 240.535156,249.102633 240.535156,164.050781 C240.535156,78.9989298 163.535156,10.0507812 86.5351562,10.0507812 L86.5351562,318.050781 Z M86.5351563,280.050781 C150.600187,280.050781 202.535156,227.668097 202.535156,163.050781 C202.535156,98.4334655 144.535156,46.0507812 86.5351563,46.0507812 C86.5351562,96.9058949 86.5351563,230.260095 86.5351563,280.050781 Z' id='path-1' />
      </defs>
      <mask id='mask-2' fill='white'>
        <use href='#path-1' />
      </mask>
      <use id='Oval' fill={circleFill || fill} transform='translate(163.535156, 164.050781) rotate(45.000000) translate(-163.535156, -164.050781) ' href='#path-1' />
    </g>
  </svg>
)

export default Logotype
