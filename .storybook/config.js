
import { configure, addDecorator } from '@storybook/react'
import { configureActions } from '@storybook/addon-actions'
import { withInfo } from "@storybook/addon-info"
import { withKnobs } from "@storybook/addon-knobs"

configure(require.context('../src/components', true, /\.stories\.tsx$/), module);