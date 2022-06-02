import {Matrix} from "../AIUtils";

/**
 * Simplify test logging
 */

export class TestValue<T> {
  private value: T;
  private equalsFunc: (other: TestValue<T>) => boolean;
  private displayFunc: () => void;

  public constructor(value: T) {
    this.value = value;
    if (typeof (value) == "object") {
      if (value instanceof (Matrix)) {
        this.equalsFunc = this.matEquals;
        this.displayFunc = this.matDisplay;
      } else {
        console.log("Error: Value(T) got unknown T type.")
      }
    } else {
      this.equalsFunc = this.normalEquals;
      this.displayFunc = this.normalDisplay;
    }
  }

  public getValue() {
    return this.value;
  }

  // Equals

  public equals(other: TestValue<T>) {
    return this.equalsFunc(other);
  }

  public normalEquals(other: TestValue<T>) {
    return this.value === other.getValue();
  }

  public matEquals(other: TestValue<T>) {
    // @ts-ignore
    return this.value.equals(other.getValue());
  }

  // Display

  public display() {
    this.displayFunc();
  }

  public normalDisplay() {
    console.log(this.value);
  }

  public matDisplay() {
    // @ts-ignore
    this.value.display();
  }
}

export function testLog<T>(functionName: string, _result: T, _expected: T) {
  const result = new TestValue(_result);
  const expected = new TestValue(_expected);
  let same: boolean = result.equals(expected);

  let resultMessage: string = same ? "PASS" : "FAIL";
  console.log("Test for " + functionName + " function : " + resultMessage);

  if (!same) {
    console.log("RESULT: ");
    result.display();
    console.log("EXPECTED: ");
    expected.display();
  }

  return same;
}

