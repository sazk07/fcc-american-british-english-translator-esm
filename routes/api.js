import { Translator } from '../components/translator.js'
import asyncHandler from 'express-async-handler'
import { Router } from 'express'

const router = Router()

const translateFn = async (req, res, next) => {
  const { text, locale } = req.body
  const isTextPropPresent = req.body.hasOwnProperty("text")
  if (!isTextPropPresent || !locale) {
    return next(new Error("Required field(s) missing"))
  }
  if (!text) {
    return next(new Error("No text to translate"))
  }

  let translation
  switch (locale) {
    case "american-to-british":
      translation = Translator.translateAmericanToBritish(text, true)
      break;
    case "british-to-american":
      translation = Translator.translateBritishToAmerican(text, true)
      break;
    default:
      throw next(new Error("Invalid value for locale field"))
  }
  if (translation.toUpperCase() === text.toUpperCase()) {
    translation = "Everything looks good to me!"
  }
  return res.json({
    text, translation
  })
}
router.post('/translate', asyncHandler(translateFn))

export {
  router as apiRoutes
}
