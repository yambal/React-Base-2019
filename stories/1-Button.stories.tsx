import React from "react"

import { storiesOf } from "@storybook/react"
import { text, boolean } from "@storybook/addon-knobs"
import { action } from "@storybook/addon-actions"

storiesOf("サンプル", module)
  .add(
    "サンプル",
    () => (
      <button
        disabled={boolean("Disabled", false)}
        onClick={action('onClick')}
      >
        {text("テキスト", "ボタン")}
      </button>
    ),
    {
      notes: '## Markdown',
      info: '## Markdown'
    }
  );