import React from 'react';

function addZero(num){
  return num > 9 ? num : "0" + num;
}

function DisplayComponent(props) {
  return (
    <div>
      <span>{addZero(Math.floor(props.time / 3600))}</span>&nbsp;:&nbsp;
      <span>{addZero(Math.floor((props.time / 60) % 3600))}</span>&nbsp;:&nbsp;
      <span>{addZero(props.time % 60)}</span>
    </div>
  );
}

export default DisplayComponent;
