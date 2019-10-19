import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from "@storybook/react"
import { Welcome } from '@storybook/react/demo';

const note = require('./note-welcome.md')

storiesOf("Samples", module)
  .add(
    "ようこそ",
    () => (
      <Welcome showApp={linkTo('Samples','Button')} />
    ),
    {
      notes: note,
      info: "このテキストは`Storybook Info Addon`を使用して表示しています。*マークダウン*も使用できます"
    }
  );