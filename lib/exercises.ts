export interface Exercise {
  id: number
  title: string
  prompt: string
  difficulty: "beginner" | "intermediate"
  concepts: string[]
  starterHint: string
}

export const EXERCISES: Exercise[] = [
  {
    id: 1,
    title: "Palindrome Checker",
    prompt:
      "Write a function that checks if a given string is a palindrome (reads the same forwards and backwards).",
    difficulty: "beginner",
    concepts: ["strings", "loops", "edge cases"],
    starterHint:
      "Think about what should happen with spaces, capitalization, and special characters.",
  },
  {
    id: 2,
    title: "FizzBuzz",
    prompt:
      "Write a function that takes a number n and returns an array of strings from 1 to n. For multiples of 3 use 'Fizz', for multiples of 5 use 'Buzz', and for multiples of both use 'FizzBuzz'.",
    difficulty: "beginner",
    concepts: ["conditionals", "modular arithmetic", "arrays"],
    starterHint:
      "Consider the order of your conditions carefully. What happens when a number is divisible by both 3 and 5?",
  },
  {
    id: 3,
    title: "Array Deduplication",
    prompt:
      "Write a function that removes duplicate values from an array while preserving the original order of first appearances.",
    difficulty: "beginner",
    concepts: ["arrays", "sets", "uniqueness"],
    starterHint:
      "Think about how you would track which values you have already seen. What data structure is ideal for fast lookups?",
  },
  {
    id: 4,
    title: "Caesar Cipher",
    prompt:
      "Write a function that encrypts a string using a Caesar cipher with a given shift value. It should handle both uppercase and lowercase letters and leave non-alphabetic characters unchanged.",
    difficulty: "intermediate",
    concepts: ["string manipulation", "ASCII", "wrapping logic"],
    starterHint:
      "Consider how character codes work. What happens when you shift 'z' by 1? How do you wrap around the alphabet?",
  },
  {
    id: 5,
    title: "Flatten Nested Array",
    prompt:
      "Write a function that takes a deeply nested array of values and returns a single flat array containing all values in order.",
    difficulty: "intermediate",
    concepts: ["recursion", "nested structures", "type checking"],
    starterHint:
      "You will need to check if each element is itself an array. Think about how recursion can handle arbitrarily deep nesting.",
  },
]

export function getExercise(id: number): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id)
}
