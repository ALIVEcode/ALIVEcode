import {Matrix} from "../AIUtils";

/**
 * Simplify test logging
 */

const unknownTypeMessage: string = "Error: Value(T) got unknown T type.";

class TestValue<T> {
  public readonly value: T;
  public readonly equals: (other: TestValue<T>) => boolean;
  public readonly display: () => void;

  public constructor(value: T) {
    this.value = value;
    if (typeof value == "object") {
      if (value instanceof Matrix) {
        this.equals = this.matEquals;
        this.display = this.matDisplay;
      } else {
        let needToThrow: boolean = false;

        try {
          // @ts-ignore
          const elem = value[0];
          if (elem instanceof Matrix) {
            this.equals = this.matArrayEquals;
            this.display = this.matArrayDisplay;
          } else {
            needToThrow = true;
          }
        } catch (TypeError) {
          needToThrow = true;
        }

        if (needToThrow) {
          throw new Error(unknownTypeMessage)
        }
      }
    } else {
      this.equals = this.normalEquals;
      this.display = this.normalDisplay;
    }
  }

  // Equals

  public normalEquals(other: TestValue<T>): boolean {
    return this.value === other.value;
  }

  public matEquals(other: TestValue<T>): boolean {
    // @ts-ignore
    return this.value.equals(other.value);
  }

  public matArrayEquals(other: TestValue<T>): boolean {
    // @ts-ignore
    for (let i: number = 0; i < this.value.length; i++) {
      // @ts-ignore
      if (this.value[i].equals(other.value[i])) return false;
    }
    return true;
  }

  // Display

  public normalDisplay(): void {
    console.log(this.value);
  }

  public matDisplay(): void {
    // @ts-ignore
    this.value.display();
  }

  public matArrayDisplay(): void {
    console.log("{");
    // @ts-ignore
    for (let i: number = 0; i < this.value.length; i++) {
      // @ts-ignore
      this.value[i].display();
    }
    console.log("}");
  }
}

export class TestResult {
  public isSuccessful: boolean;
  public failMessage: string;

  constructor(isSuccessful: boolean, failMessage: string = "") {
    this.isSuccessful = isSuccessful;
    this.failMessage = failMessage;
  }
}

const NO_RESULT: number = 0
export {NO_RESULT};

export function testLog<T>(functionName: string, result: T, expectedOrTestResult: T | TestResult): boolean {
  let resultValue: TestValue<T> = new TestValue(result);
  let expectedValue: TestValue<T>;

  const isTestResult = expectedOrTestResult instanceof TestResult;
  let didTestPass: boolean;
  if (isTestResult) {
    didTestPass = expectedOrTestResult.isSuccessful;
  } else {
    expectedValue = new TestValue(expectedOrTestResult);
    didTestPass = resultValue.equals(expectedValue);
  }
  
  let testResultMessage: string = didTestPass ? "PASS" : "FAIL";
  console.log("Test for " + functionName + " function : " + testResultMessage);

  if (!didTestPass) {
    if (isTestResult) {
      console.log("ERROR: " + expectedOrTestResult.failMessage)
    } else {
      console.log("EXPECTED: ");
      // @ts-ignore
      expectedValue.display();
    }

    console.log("RESULT: ");
    // @ts-ignore
    resultValue.display();
  }

  return didTestPass;
}

/**
 * Helper function
 */
export function areAllElementsBetweenRange(matOrMatArray: Matrix | Matrix[], lowerBound: number = 0, upperBound: number = 1): TestResult {
  let result: boolean = true;
  if (matOrMatArray instanceof Matrix) {
    const rawMat: number[][] = matOrMatArray.getValue();
    const rowCount: number = matOrMatArray.getRows();
    const colCount: number = matOrMatArray.getColumns();

    for (let i: number = 0; result && i < rowCount; i++) {
      for (let j: number = 0; result && j < colCount; j++) {
        const value: number = rawMat[i][j]
        if (!(lowerBound <= value && value <= upperBound)) result = false;
      }
    }
  } else {
    for (let i: number = 0; i < matOrMatArray.length; i++) {
      if (!(areAllElementsBetweenRange(matOrMatArray[i]).isSuccessful)) result = false;
    }
  }

  return new TestResult(result, "at least one value was not in the range [" + lowerBound + ", " + upperBound + "]");
}

