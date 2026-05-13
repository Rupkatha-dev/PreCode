import { DifficultyLevel } from "./types"

export interface ExerciseVariation {
  prompt: string
  starterHint: string
}

export interface Exercise {
  id: number
  title: string
  description: string
  concepts: string[]
  levels: Record<DifficultyLevel, ExerciseVariation>
}

export const EXERCISES: Exercise[] = [
  {
    id: 1,
    title: "Palindrome Checker",
    description: "Write a function that checks if a given string is a palindrome.",
    concepts: ["strings", "loops", "edge cases"],
    levels: {
      beginner: {
        prompt: "Write a function that checks if a single word is a palindrome. Assume the input is always a lowercase string with no spaces or punctuation.",
        starterHint: "A simple loop comparing the start and end characters, or splitting and reversing the string will work here.",
      },
      intermediate: {
        prompt: "Write a function that checks if a given phrase is a palindrome. Your function must ignore spaces and be case-insensitive.",
        starterHint: "Think about how you can normalize the string first. Converting to lowercase and removing spaces is a good start.",
      },
      expert: {
        prompt: "Write a function that checks if a string is a palindrome. It must ignore spaces, punctuation, special characters, and be case-insensitive. Additionally, optimize it to run in O(n) time with O(1) extra space.",
        starterHint: "Using two pointers (one at the start, one at the end) allows you to check in place without allocating a new string.",
      }
    }
  },
  {
    id: 2,
    title: "FizzBuzz",
    description: "Write a function that returns an array of strings from 1 to n with FizzBuzz rules.",
    concepts: ["conditionals", "modular arithmetic", "arrays"],
    levels: {
      beginner: {
        prompt: "Write a function that takes a number n and prints the numbers from 1 to n. For multiples of 3, print 'Fizz' instead. For multiples of 5, print 'Buzz'. For multiples of both, print 'FizzBuzz'.",
        starterHint: "You can use a simple loop and if/else statements. Remember to check for multiples of both 3 and 5 first!",
      },
      intermediate: {
        prompt: "Write a function that takes a number n and returns an array of strings. Multiples of 3 should be 'Fizz', multiples of 5 'Buzz', and multiples of both 'FizzBuzz'. Other numbers should be strings.",
        starterHint: "Instead of printing, push the results to an array. Be careful to return strings for numbers, like '4'.",
      },
      expert: {
        prompt: "Write a FizzBuzz function that takes a number n, but instead of hardcoding 3 and 5, it takes a dictionary of {number: string} mappings and applies them dynamically in ascending order.",
        starterHint: "You will need to iterate through the dictionary keys for each number and concatenate the strings if the modulo is 0.",
      }
    }
  },
  {
    id: 3,
    title: "Array Deduplication",
    description: "Write a function that removes duplicate values from an array.",
    concepts: ["arrays", "sets", "uniqueness"],
    levels: {
      beginner: {
        prompt: "Write a function that takes an array of numbers and returns a new array with all duplicates removed.",
        starterHint: "A Set is a great data structure for ensuring uniqueness.",
      },
      intermediate: {
        prompt: "Write a function that takes an array of primitive values (strings, numbers, booleans) and returns an array with duplicates removed, preserving the original order.",
        starterHint: "While a Set works, think about how to maintain order if you were doing this manually. An array filter combined with indexOf could also work.",
      },
      expert: {
        prompt: "Write a function that deduplicates an array of complex objects based on a specific 'id' property. If objects have the same id, keep the first one and discard the rest. Preserve the original order.",
        starterHint: "A Set won't work out of the box for objects. Consider using a Map or an object to track which ids you've already seen.",
      }
    }
  },
  {
    id: 4,
    title: "Caesar Cipher",
    description: "Write a function that encrypts a string using a Caesar cipher with a given shift value.",
    concepts: ["string manipulation", "ASCII", "wrapping logic"],
    levels: {
      beginner: {
        prompt: "Write a function that shifts every lowercase letter in a string forward by 1 in the alphabet. Leave spaces as they are.",
        starterHint: "You can get the character code of a string, add 1, and convert it back to a character.",
      },
      intermediate: {
        prompt: "Write a function that encrypts a string using a Caesar cipher with a variable shift value. It should handle lowercase letters and wrap around from 'z' back to 'a'. Leave spaces unchanged.",
        starterHint: "Consider how the modulo operator (%) can help you wrap around the alphabet.",
      },
      expert: {
        prompt: "Write a function that encrypts a string using a Caesar cipher. It must support both positive and negative shifts, handle both uppercase and lowercase letters, and preserve all non-alphabetic characters perfectly.",
        starterHint: "You'll need separate ASCII boundaries for uppercase (65-90) and lowercase (97-122). Make sure negative shifts wrap correctly.",
      }
    }
  },
  {
    id: 5,
    title: "Flatten Nested Array",
    description: "Write a function that takes a nested array and flattens it.",
    concepts: ["recursion", "nested structures", "type checking"],
    levels: {
      beginner: {
        prompt: "Write a function that takes an array containing numbers and other arrays of numbers (only 1 level deep), and returns a single flat array of numbers.",
        starterHint: "You can iterate through the main array, check if an item is an array, and push its elements, otherwise push the number directly.",
      },
      intermediate: {
        prompt: "Write a function that takes a deeply nested array of values and returns a single flat array containing all values in order.",
        starterHint: "Recursion is the best approach here. If an element is an array, call flatten on it.",
      },
      expert: {
        prompt: "Write a function that flattens an array up to a specified 'depth' parameter. If no depth is provided, flatten by 1 level. Handle edge cases like cyclic references.",
        starterHint: "You will need to track the current depth in your recursive calls and decrement it.",
      }
    }
  }
]

export function getExercise(id: number): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id)
}
