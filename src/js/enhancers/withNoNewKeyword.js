/**
 * Extends a Pleasant class making it able to be instantiated without the `new` keyword (and thus without `Pleasant.fire`)
 * @param ParentPleasant
 * @returns {NoNewKeywordPleasant}
 */
export function withNoNewKeyword (ParentPleasant) {
  const NoNewKeywordPleasant = function (...args) {
    if (!(this instanceof NoNewKeywordPleasant)) {
      return new NoNewKeywordPleasant(...args)
    }
    Object.getPrototypeOf(NoNewKeywordPleasant).apply(this, args)
  }
  NoNewKeywordPleasant.prototype = Object.assign(
    Object.create(ParentPleasant.prototype),
    { constructor: NoNewKeywordPleasant }
  )
  Object.setPrototypeOf(NoNewKeywordPleasant, ParentPleasant)
  return NoNewKeywordPleasant
}
