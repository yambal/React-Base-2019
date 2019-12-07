import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from "@storybook/react"
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";

const note = require('./note-welcome.md')

export default {
  title: "Addons",
  decorators: [withKnobs]
};

export const withAButton = () => (
  <button disabled={boolean("Disabled", false)} onClick={action('Hello')}>
    {text("Label", "Hello Storybook")}
  </button>
);

/*
export const link_to = () => {
  const handler = () => {
    console.log(22)
    action('click')
    linkTo('Addons', 'withAButton')
  }
  return(
    <div onClick={handler}>linkTo</div>
  )
};
*/

export const asDynamicVariables = () => {
  const name = text("Name", "Arunoda Susiripala");
  const age = number("Age", 89);

  const content = `I am ${name} and I'm ${age} years old.`;
  return <div>{content}</div>;
};