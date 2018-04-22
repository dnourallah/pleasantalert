import PleasantAlert from './PleasantAlertCore'
import { withGlobalDefaults, withNoNewKeyword } from './enhancers'

const Pleasant = withNoNewKeyword(withGlobalDefaults(PleasantAlert))

Pleasant.default = Pleasant

export default Pleasant
