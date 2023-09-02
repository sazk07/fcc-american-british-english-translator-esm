import americanOnly from "./american-only.js";
import americanToBritishSpelling from "./american-to-british-spelling.js";
import americanToBritishTitles from "./american-to-british-titles.js";
import britishOnly from "./british-only.js";

class Translator {
  static #adjustCase(inputText) {
    // match first letter and return it as uppercased
    const substituteTextMatch = new RegExp("^[a-z]", "gi")
    const upperCasedCharFn = (char) => char.toUpperCase()
    const uppercasedText = inputText.replace(substituteTextMatch, upperCasedCharFn)
    return uppercasedText
  }
  static #highlightAndReplace(_ignore, replacement, shouldHighlight = false, needsAdjustment = false) {
    if (needsAdjustment) {
      // call upper casing function
      replacement = Translator.#adjustCase(replacement)
    }
    return () => {
      // replace whitespace with null character
      const newStrWithNullChar = replacement.replace(/\s/g, "\0")
      return shouldHighlight ? `<span class="highlight">${newStrWithNullChar}</span>` : `~${newStrWithNullChar}~`
    }
  }
  static translateAmericanToBritish(input, isHighlighted = false) {
    // replace phrases
    for (const [american, british] of Object.entries(americanOnly)) {
      // catch american word bounded on both sides
      const americanCapture = new RegExp(`\\b${american}\\b`, "gi")
      const compressedBritishSubstitute = Translator.#highlightAndReplace(american, british, isHighlighted)
      input = input.replace(americanCapture, compressedBritishSubstitute)
    }

    // translate spellings
    for (const [american, british] of Object.entries(americanToBritishSpelling)) {
      const americanCapture = new RegExp(`\\b${american}\\b`, "gi")
      const compressedBritishSubstitute = Translator.#highlightAndReplace(american, british, isHighlighted)
      input = input.replace(americanCapture, compressedBritishSubstitute)
    }

    // translate titles
    for (const [american, british] of Object.entries(americanToBritishTitles)) {
      const modifiedAmericanEntry = american.replace('.', '\\.')
      const americanCapture = new RegExp(`${modifiedAmericanEntry}`, "gi")
      const compressedBritishSubstitute = Translator.#highlightAndReplace(modifiedAmericanEntry, british, isHighlighted, true)
      input = input.replace(americanCapture, compressedBritishSubstitute);
    }

    // convert colon to dot
    const colonCapture = new RegExp(/(\d{1,2}):(\d{1,2})/, "gi")
    isHighlighted ? input = input.replace(colonCapture, `<span class="highlight">$1.$2</span>`)
      : input = input.replace(colonCapture, `$1.$2`)

    const tildeCapture = new RegExp(/~/, "g")
    const strWthRemovedTilde = input.replace(tildeCapture, "")
    const nullCapture = new RegExp(/\0/, "g")
    const strWithWhitespaces = strWthRemovedTilde.replace(nullCapture, " ");
    return strWithWhitespaces
  }

  static translateBritishToAmerican(input, isHighlighted = false) {
    // phrases
    for (const [british, american] of Object.entries(britishOnly)) {
      const britishCapture = new RegExp(`\\b${british}\\b`, "gi")
      const americanSubstitute = Translator.#highlightAndReplace(british, american, isHighlighted)
      input = input.replace(britishCapture, americanSubstitute);
    }

    // spellings
    for (const [american, british] of Object.entries(americanToBritishSpelling)) {
      const britishCapture = new RegExp(`\\b${british}\\b`, "gi")
      const americanSubstitute = Translator.#highlightAndReplace(british, american, isHighlighted)
      input = input.replace(britishCapture, americanSubstitute);
    }

    // titles
    for (const [american, british] of Object.entries(americanToBritishTitles)) {
      const britishCapture = new RegExp(`${british}\\b`, "gi")
      const americanSubstitute = Translator.#highlightAndReplace(british, american, isHighlighted, true)
      input = input.replace(britishCapture, americanSubstitute);
    }

    // convert dot time to colon time
    const britishCapture = new RegExp(/(\d{1,2}).(\d{1,2})/, "gi")
    isHighlighted ? input = input.replace(britishCapture, `<span class="highlight">$1:$2</span>`)
      : input = input.replace(britishCapture, `$1:$2`);

    const tildeCapture = new RegExp(/~/, "gi")
    const strWithRemovedTilde = input.replace(tildeCapture, "");
    const nullCapture = new RegExp(/\0/, "gi")
    const strWithWhitespaces = strWithRemovedTilde.replace(nullCapture, " ");
    return strWithWhitespaces
  }
}

export {
  Translator
}
