import chai, { assert, use } from "chai";
import chaiHttp from "chai-http";
import { after, suite, test } from "mocha";
import { app } from "../app.js"

use(chaiHttp)

after(() => {
  chai.request(app).get('/api')
})

suite('Functional Tests', () => {
  suite("POST request to /api/translate", () => {
    test("POST with text and locale fields", (done) => {
      const text = "Mangoes are my favorite fruit."
      const locale = "american-to-british"
      const output = {
        text,
        translation: 'Mangoes are my <span class="highlight">favourite</span> fruit.'
      }
      chai.request(app)
        .post('/api/translate')
        .send({ text, locale })
        .end((err, res) => {
          assert.notExists(err)
          assert.strictEqual(res.status, 200)
          assert.deepStrictEqual(res.body, output)
          assert.property(res.body, "text")
          assert.strictEqual(res.body.text, output.text)
          assert.property(res.body, "translation")
          assert.strictEqual(res.body.translation, output.translation)
          done()
        })
    })
    test("POST with text and invalid locale field", (done) => {
      const text = "Mangoes are my favorite fruit."
      const locale = "Russian-to-spanish"
      const output = {
        error: "Invalid value for locale field"
      }
      chai.request(app)
        .post('/api/translate')
        .send({ text, locale })
        .end((err, res) => {
          assert.notExists(err)
          assert.deepStrictEqual(res.body, output)
          assert.property(res.body, "error")
          assert.deepStrictEqual(res.body, output)
          assert.strictEqual(res.body.error, output.error)
          assert.strictEqual(res.status, 500)
          done()
        })
    })
    test("POST with missing text field", (done) => {
      const locale = "american-to-british"
      const output = {
        error: "Required field(s) missing"
      }
      chai.request(app)
        .post('/api/translate')
        .send({ locale })
        .end((err, res) => {
          assert.notExists(err)
          assert.property(res.body, "error")
          assert.deepStrictEqual(res.body, output)
          assert.strictEqual(res.body.error, output.error)
          assert.strictEqual(res.status, 500)
          done()
        })
    })
    test("POST with missing locale field", (done) => {
      const text = "Mangoes are my favorite fruit."
      const output = {
        error: "Required field(s) missing"
      }
      chai.request(app)
        .post('/api/translate')
        .send({ text })
        .end((err, res) => {
          assert.notExists(err)
          assert.property(res.body, "error")
          assert.deepStrictEqual(res.body, output)
          assert.strictEqual(res.status, 500)
          done()
        })
    })
    test("POST with empty text", (done) => {
      const text = ""
      const locale = "american-to-british"
      const output = {
        error: "No text to translate"
      }
      chai.request(app)
      .post('/api/translate')
      .send({ text, locale })
      .end((err, res) => {
          assert.notExists(err)
          assert.strictEqual(res.status, 500)
          assert.property(res.body, "error")
          assert.deepStrictEqual(res.body, output)
          done()
        })
    })
    test("POST with text that needs to translation", (done) => {
      const text = "hello world"
      const locale = "american-to-british"
      const output = {
        text,
        translation: "Everything looks good to me!"
      }
      chai.request(app)
      .post('/api/translate')
      .send({ text, locale })
      .end((err, res) => {
          assert.notExists(err)
          assert.strictEqual(res.status, 200)
          assert.property(res.body, "text")
          assert.property(res.body, "translation")
          assert.deepStrictEqual(res.body, output)
          done()
        })
    })
  })
})
