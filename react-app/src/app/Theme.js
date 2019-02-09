import { createMuiTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import indigo from '@material-ui/core/colors/indigo'

const Palette = {
  primary: indigo,
  secondary: amber,
}

const DefaultTheme = createMuiTheme({
  palette: Palette,
})
export default DefaultTheme

export const InvertedTheme = createMuiTheme({
  palette: {
    ...Palette,
    type: 'dark',
  },
})
