/**
 * This interface defines the properties of a Data
 */
export interface DataSample {
  id: number;
  x: number;
  y: number;
}

export class Matrix {

  private value: number[][];

  public constructor(rows: number, columns: number);
  public constructor(value: number[][]);
  constructor(...args: any[]) {
    if (args.length == 2) this.value = zeros(args[0], args[1]);
    else if (args.length == 1) this.value = args[0];
    else this.value = zeros(1, 1);
  }

  public getValue(): number[][] {
    return this.value;
  }
}

export function zeros(rows: number, columns: number): number[][] {
  let output: number[][] = [];

  for (let i = 0; i < rows; i++) {
    output.push([0]);
    for (let j = 1; j < columns; j++) {
      output[i].push(0);
    }
  }

  return output;
}

export function matMul(m1: number[][], m2: number[][]): number[][] {
  let output: number[][] = [[0]];
  
  if (m1[0].length !== m2.length) {
    output = [[0]];
  }

  return output;
}

console.log(zeros(3, 3));