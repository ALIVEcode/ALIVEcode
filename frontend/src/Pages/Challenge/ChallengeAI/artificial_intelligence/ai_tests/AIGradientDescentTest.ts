import {GradientDescent} from "../ai_optimizers/ai_nn_optimizers/GradientDescent"
import {Matrix} from "../AIUtils";
import {testLog, TestResult, NO_RESULT, areAllElementsBetweenRange} from "./AITestLogging";
import {nn} from "./AINeuralNetworkTest";
import {mat1} from "./AIUtilsTest";

export function mainAIGradientDescentTest() {
  gdOptimizeOneEpochTest();
}

let gd: GradientDescent = new GradientDescent(nn);

function gdOptimizeOneEpochTest() {
  gd.optimizeOneEpoch(mat1, nn.predictReturnAll(mat1), new Matrix([[4, 7, 10]]));

  testLog("GradientDescent.optimizeOneEpoch", NO_RESULT, new TestResult(true));
}
