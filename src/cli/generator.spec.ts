import { assert } from "chai";
import { describe, it } from "mocha";
import { toHeaderString, toBoldString, toItalicString, toParagraphString } from "./generator";

describe('Markdown generation', () => {

  it('returns a HTML header string', () => {
    const headerString = toHeaderString('1', 'some header')
    assert.isString(headerString)
    assert.equal(headerString, '<h1>some header</h1>')
  })

  it('returns a HTML bold string', () => {
    const content = 'this is a bold sentence'
    const bold = toBoldString(content)
    assert.isString(bold)
    assert.equal(bold, `<b>${content}</b>`)
  })

  it('returns a HTML italic string', () => {
    const content = 'this is an italic string'
    const italic = toItalicString(content)
    assert.isString(italic)
    assert.equal(italic, `<em>${content}</em>`)
  })

  it('returns a HTML paragraph', () => {
    const content = 'this is a paragraph'
    const paragraph = toParagraphString(content)
    assert.isString(paragraph)
    assert.equal(paragraph, `<p>${content}</p>`)
  })

})
