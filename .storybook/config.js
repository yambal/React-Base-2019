import { configure, addDecorator } from '@storybook/react'
import { configureActions } from '@storybook/addon-actions'
import { withInfo } from "@storybook/addon-info"
import { withKnobs } from "@storybook/addon-knobs"

configure(require.context('../stories', true, /\.stories\.(ts|tsx)$/), module);

addDecorator(withInfo);
addDecorator(withKnobs);
configureActions({
    depth: 100,
    // Limit the number of items logged into the actions panel
    limit: 20,
})