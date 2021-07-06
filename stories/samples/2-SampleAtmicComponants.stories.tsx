import React from "react"

import { storiesOf } from "@storybook/react"
import { text, boolean, number, color, object, array, select, radios, files, date, button } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"

import Button from '../../src/components/atoms/Button'
import ButtonPrimary from '../../src/components/atoms/ButtonPrimary'
import Counter from '../../src/components/organisms/Counter'

storiesOf("Atom", module)
  .add(
    'Button',
    () => {
      return (
        <Button
          disabled={boolean('disabled', false)}
          onClick={action('onClick')}
        >
          {text('text', 'Button')}
        </Button>
      )
    },
    {
      notes: '## Markdown',
      info: '## Markdown'
    }
  )
  .add(
    'ButtonPrimary',
    () => {
      return (
        <ButtonPrimary as="div"
          disabled={boolean('disabled', false)}
          onClick={action('onClick')}
        >
          {text('text', 'Button')}
        </ButtonPrimary>
      )
    },
    {
      notes: '## Markdown',
      info: '## Markdown'
    }
  );

storiesOf("Organisums", module)
  .add(
    'Counter',
    () => {
      return (
        <Counter
          count={number('count', 0)}
          isBusy={boolean('isBusy', false)}
          handleAdd={action('handleAdd')}
          handleSubtract={action('handleSubtract')}
        />
      )
    }
  )