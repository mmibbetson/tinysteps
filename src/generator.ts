import { Chord, ChordExtension, Progression } from "./models.js";
import { db } from "./index.js";

/*
    What does the generator need to do?

    1. Take in root, quality, extension, length

    2. Create a suitable pattern:
        - Should end on Tonic
        - Should be exactly correct size
        - Should move between chords according to function

    3. Populate the pattern:
        - Acquire the applicable chords via SQL query
        - Pick candidates for each position and build new array

    4. Return the progression body array
*/

// Generate the body field, which is an array of chords
export async function generateProgressionBody(
  root: string = "C",
  quality: string = "major",
  extension: string = "triad",
  length: number = 4
): Promise<Progression["body"]> {
  const pattern = createPattern(length);

  try {
    const chords = await acquireChords(root, quality, extension);
    const body = populateBody(pattern, chords);

    return body;
  } catch (error) {
    console.error(error);

    return [
      // TODO: Change this to a more appropriate error response
      {
        root: "C",
        suffix: "maj",
        function: "tonic",
        extension: "triad",
      },
    ];
  }
}

// Will generate a pattern to then be populated by chords whose functions match
function createPattern(len: number): string[] {
  let pattern: string[] = ["tonic"];

  for (let i = 1; i < len; i++) {
    pattern.unshift(getPrevFunction(pattern[i - 1]));
  }

  return pattern;
}

// TODO: Refactor this, not very DRY
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

async function acquireChords(
  root: string,
  quality: string,
  extension: string
): Promise<Chord[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT root, suffix, function, extension FROM chord WHERE music_key_id IN (SELECT id FROM music_key WHERE root = ? AND quality = ?)",
      root,
      quality,
      (err: any, rows: Chord[]) => {
        if (err) {
          console.error("Query failure:", err);
          reject(err);
        }

        const outputChords = filterChords(
          rows,
          ChordExtension[extension as keyof typeof ChordExtension]
        );

        resolve(outputChords);
      }
    );
  });
}

// TODO: Fix this, seems to only be returning triads
// Filters chords to only include candidates whose extension is at the requested level or lower
function filterChords(chords: Chord[], ext: ChordExtension): Chord[] {
  return chords.filter((chord: Chord) => {
    const chordEnumValue =
      ChordExtension[chord.extension as keyof typeof ChordExtension];
    return chordEnumValue <= ext;
  });
}

function populateBody(pattern: string[], chords: Chord[]): Chord[] {
  // declare a variable to hold the output chord array
  let body: Chord[] = [];
  // iterate over the pattern to populate each position
  pattern.forEach((func) => {
    // select a random chord from the chords array whose function matches the current pattern position
    const chord = selectRandomChord(chords, func);
    // add the chord to the output array
    body.push(chord);
  });
  // return populated body
  return body;
}

function selectRandomChord(chords: Chord[], func: string): Chord {
  // filter down to only those chords whose functions match func
  chords = chords.filter((chord) => chord.function === func);
  // randomly select a chord from that array
  const randIndex = Math.floor(Math.random() * chords.length);
  const chord = chords[randIndex];
  // return said chord
  return chord;
}
