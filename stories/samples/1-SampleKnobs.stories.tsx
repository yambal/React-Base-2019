import React from "react"

import { storiesOf } from "@storybook/react"
import { text, boolean, number, color, object, array, select, radios, files, date, button } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"

const note = require('./note-knobs.md')

storiesOf("Samples", module)
  .add(
    'Knobs サンプル',
    () => {
      const handlerButton = () => {
        alert('Knobs Button Clicked')
      }

      return(
        <div>
          <h3>ボタンの例</h3>
          <button
            onClick={action('onClick')}
            disabled={boolean('disabled', false, 'ボタンの例')}
          >
            {text('text', 'ボタン', 'ボタンの例')}
          </button>
          <hr />
          <h3>使用できる設定値</h3>
          参照 : <a href="https://github.com/storybookjs/storybook/tree/next/addons/knobs" target="_blank">Storybook Addon Knobs</a>
          <dl>
            <dt>text</dt><dd>{text('text', 'テキスト', '使用できる設定値')}</dd>
            <dt>boolean</dt><dd>{JSON.stringify(boolean('boolean', false, '使用できる設定値'))}</dd>
            <dt>number</dt><dd>{number('number', 0, {}, '使用できる設定値')}</dd>
            <dt>number (range)</dt><dd>{number('number (range)', 0, { range: true, min: 0, max: 100, step: 10 }, '使用できる設定値')}</dd>
            <dt>color</dt><dd>{color('color', '#FF0000', '使用できる設定値')}</dd>
            <dt>object</dt><dd>{JSON.stringify(object('object', { hoge: 'fuga'}, '使用できる設定値'), null, 2)}</dd>
            <dt>array</dt><dd>{array('array', ['A','B'], ',', '使用できる設定値')}</dd>
            <dt>select</dt><dd>{select('select', { '選択肢 1':'1', '選択肢 2':'2' }, '1', '使用できる設定値')}</dd>
            <dt>radio</dt><dd>{radios('radio', { '選択肢 1':'1', '選択肢 2':'2' }, '1', '使用できる設定値')}</dd>
            <dt>files</dt><dd>{files('files', '.xlsx, .pdf', [], '使用できる設定値')}</dd>
            <dt>date</dt><dd>{date('date', new Date(), '使用できる設定値')}</dd>
            <dt>button</dt><dd>{button('button', handlerButton, '使用できる設定値')}</dd>
          </dl>
          
        </div>
      )
    },
    {
      notes: note,
      info: '## Markdown'
    }
  );