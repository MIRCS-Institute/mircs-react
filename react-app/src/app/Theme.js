import { createTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import indigo from '@material-ui/core/colors/indigo'

const Palette = {
  primary: indigo,
  secondary: amber,
}

const DefaultTheme = createTheme({
  palette: Palette,
})
export default DefaultTheme

export const InvertedTheme = createTheme({
  palette: {
    ...Palette,
    type: 'dark',
  },
})
