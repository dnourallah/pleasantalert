import { withNoNewKeyword } from '../enhancers'

/**
 * Returns an extended version of `Pleasant` containing `params` as defaults.
 * Useful for reusing Pleasant configuration.
 *
 * For example:
 *
 * Before:
 * const textPromptOptions = { input: 'text', showCancelButton: true }
 * const {value: firstName} = await Pleasant({ ...textPromptOptions, title: 'What is your first name?' })
 * const {value: lastName} = await Pleasant({ ...textPromptOptions, title: 'What is your last name?' })
 *
 * After:
 * const TextPrompt = Pleasant.mixin({ input: 'text', showCancelButton: true })
 * const {value: firstName} = await TextPrompt('What is your first name?')
 * const {value: lastName} = await TextPrompt('What is your last name?')
 *
 * @param mixinParams
 */
export function mixin (mixinParams) {
  const Pleasant = this
  return withNoNewKeyword(
    class MixinPleasant extends Pleasant {
      _main (params) {
        return super._main(Object.assign({}, mixinParams, params))
      }
    }
  )
}
