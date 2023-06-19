import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter start value: ", (start) => {
  for (let i = start; i <= parseInt(start) + 69; i++) {
    console.log(i);
  }
  rl.close();
});
