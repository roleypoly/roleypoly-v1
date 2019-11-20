import React from 'react';
import moment from 'moment';
import Typist from 'react-typist';
import './typing.sass';

const Typing = () => (
  <div className="demo__discord rp-discord">
    <div className="discord__chat">
      <span className="timestamp">{moment().format('LT')}</span>
      <span className="username">Kata カタ</span>
      <span className="text">Hey, I want some roles!</span>
    </div>
    <div className="discord__textarea">
      <Typist cursor={{ blink: true }}>
        <span>.iam a cute role ♡</span>
        <Typist.Backspace count={30} delay={1500} />
        <span>.iam a vanity role ♡</span>
        <Typist.Backspace count={30} delay={1500} />
        <span>.iam a brave role ♡</span>
        <Typist.Backspace count={30} delay={1500} />
        <span>.iam a proud role ♡</span>
        <Typist.Backspace count={30} delay={1500} />
        <span>.iam a wonderful role ♡</span>
        <Typist.Backspace count={30} delay={1500} />
        <span>i have too many roles.</span>
      </Typist>
    </div>
  </div>
);

export default Typing;
