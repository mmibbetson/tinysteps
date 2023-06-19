import { error } from "console";
import { Progression } from "./models.js";

/*
    What does the generator need to do?

    1. Take in root, quality, extension, length

    2. Create a suitable pattern:
        - Should end on Tonic
        - Should be exactly correct size
        - Should move between chords according to function
*/

export function generateProgressionBody(
  root: string = "C",
  quality: string = "major",
  extension: string = "third",
  length: number = 4
): Progression["body"] {
  const pattern = createPattern(length);

  return [];
}

function createPattern(len: number): string[] {
  let pattern: string[] = ["tonic"];

  for (let i = 1; i < len; i++) {
    pattern.unshift(getPrevFunction(pattern[i - 1]));
  }

  return pattern;
}

// Use weighted random generation to select which chord function should have
// come before the current one
function getPrevFunction(func: string): string {
  switch (func) {
    case "tonic":
      var weights = [3, 2, 5]; // tonic, subdominant, dominant
      var totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      var randVal = Math.floor(Math.random() * totalWeight);

      // Make sure to check lowest cases first so we don't return on the wrong case
      return randVal < 2 ? "subdominant" : randVal < 3 ? "tonic" : "dominant";
    case "subdominant":
      var weights = [5, 3, 2]; // tonic, subdominant, dominant
      var totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      var randVal = Math.floor(Math.random() * totalWeight);

      // Make sure to check lowest cases first so we don't return on the wrong case
      return randVal < 2 ? "dominant" : randVal < 3 ? "subdominant" : "tonic";
    case "dominant":
      var weights = [4, 5, 2]; // tonic, subdominant, dominant
      var totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      var randVal = Math.floor(Math.random() * totalWeight);

      // Make sure to check lowest cases first so we don't return on the wrong case
      return randVal < 2 ? "dominant" : randVal < 3 ? "tonic" : "subdominant";
    default:
      throw new Error("Unexpected error generating pattern");
  }
}