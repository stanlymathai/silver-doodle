import React from 'react';

export const ReactionView = (count: number) => {
  const emoji = {
    like: 'thumpsup-blue',
    brilliant: 'light-bulb side-margin',
    thoughtful: 'thought-full',
  };
  let label: string = ''

  if (count && count > 0) {
    if (count > 999) {
      label = `${Math.floor(count / 1000)}K`
    } else label = `${count}`
  }
  return (
    <div className={label ? "reaction-group" : "hidden"}>
      {Object.entries(emoji).map((el) => (
        <span key={el[0]} className={el[1]} />
      ))}
      <label className='count'>{label}</label>
    </div>
  );
};
