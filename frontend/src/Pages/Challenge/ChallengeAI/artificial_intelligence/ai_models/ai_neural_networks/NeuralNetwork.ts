import { Matrix, randomMatrix, zeros } from '../../AIUtils';
import { NeuralLayer } from './NeuralLayer';
import {
	ActivationFunction,
	Relu,
	Sigmoid,
	Tanh,
} from '../../ai_functions/ActivationFunction';
import { NNHyperparameters, NNModelParams } from '../../AIUtilsInterfaces';
import AIModel, {
	ACTIVATION_FUNCTIONS,
	MODEL_TYPES,
} from '../../../../../../Models/Ai/ai_model.entity';

/**
 * This class represents a whole Neural Network. It contains every layers that
 * composes it, its number of inputs and numebr of outputs.
 *
 * A Neural Network can be used to make predictions based on its parameters, which
 * have a randomized initial value and can be trained with a NNOptimizer to make
 * better predictions on a specific situation.
 */
export class NeuralNetwork extends AIModel {
	// The layers attribute represents the hidden layers plus the output layer.
	// The input layer doesn't need its own object since it doesn't have weights or biases.
	private layers: NeuralLayer[] = [];
	private nbInputs: number;
	private nbOutputs: number;

	public hyperparameters: NNHyperparameters;
	public modelParams: NNModelParams;

	/**
	 * Creates or loads a Neural Network Model, based on the NNModelParams object given
	 * in arguments. If this object contains only an empty array, the constructor
	 * creates a new Model with random parameters. If the layerParams property in
	 * modelParams has values in it, then the constructor creates a Model with the same
	 * parameters as specified in the object.
	 * @param id the identifier of the Model.
	 * @param hyperparameters an object describing all hyperparameters of the Neural Network.
	 * @param modelParams the parameters values of the Neural Network. Its layerParams
	 * property can be empty if we want to create a Neural Network from scratch.
	 */
	constructor(
		id: string | null,
		hyperparameters: NNHyperparameters,
		modelParams?: NNModelParams,
	) {
		super(id, MODEL_TYPES.NEURAL_NETWORK);

		this.hyperparameters = hyperparameters;
		this.modelParams =
			typeof modelParams !== 'undefined'
				? modelParams
				: {
						layerParams: [],
				  };

		// Assinging values to properties
		this.nbInputs = hyperparameters.nbInputs;
		this.nbOutputs = hyperparameters.nbOutputs;

		// Choosing the right method depending if the model already exists
		if (this.modelParams.layerParams.length === 0) this.createModel();
		else this.loadModel();
	}

	protected loadModel() {
		let nbLayers: number = this.layers.length;

		// Hidden layers
		for (let layer: number = 0; layer < nbLayers; layer++) {
			// Initiates the layers if its the first layer
			const activationFunction = ActivationFunction.createActivationFunction(
				this.hyperparameters.activationsByLayer[layer],
			);
			this.layers.push(
				new NeuralLayer(
					this.modelParams.layerParams[layer].biases.length,
					activationFunction,
					new Matrix(this.modelParams.layerParams[layer].weights),
					new Matrix([this.modelParams.layerParams[layer].biases]).transpose(),
				),
			);
		}
	}

	protected createModel() {
		let weights: Matrix;
		let biases: Matrix;
		let previousNbNeurons: number = 0;
		let currentNbNeurons: number = 0;
		let neuronsByLayer = this.hyperparameters.neuronsByLayer;

		const activationFunctions = this.hyperparameters.activationsByLayer.map(a =>
			ActivationFunction.createActivationFunction(a),
		);

		let nbActivations: number = activationFunctions.length;

		// If the number of activation functions is smaller than the number of layers,
		// fills the activation function array until its of the same length as the number of layers.
		if (nbActivations < neuronsByLayer.length + 1) {
			for (let i: number = nbActivations; i < neuronsByLayer.length + 1; i++) {
				activationFunctions.push(activationFunctions[i - 1]);
			}
		}

		// Hidden layers and output layer
		for (let layer: number = 0; layer < nbActivations; layer++) {
			// Number of neurons from the previous layer (can be the input layer)
			previousNbNeurons =
				layer === 0 ? this.nbInputs : neuronsByLayer[layer - 1];
			// NUmber of neurons of the current layer (can be the output layer)
			currentNbNeurons =
				layer === nbActivations - 1 ? this.nbOutputs : neuronsByLayer[layer];
			// Initialization of weights and biases
			weights = randomMatrix(currentNbNeurons, previousNbNeurons);
			biases = new Matrix(zeros(currentNbNeurons, 1));

			// Initiates the layers if its the first layer
			if (layer === 0)
				this.layers = [
					new NeuralLayer(
						currentNbNeurons,
						activationFunctions[layer],
						weights,
						biases,
					),
				];
			// Creates a hidden layer if its another layer
			else
				this.layers.push(
					new NeuralLayer(
						currentNbNeurons,
						activationFunctions[layer],
						weights,
						biases,
					),
				);
		}
	}

	//---- PREDICTION METHODS ----//

	public predict(inputs: Matrix, normalize: boolean): Matrix {
		let output: Matrix[] = this.predictReturnAll(inputs, normalize);
		return output[output.length - 1];
	}

	/**
	 * Predicts outputs based on the corresponding inputs by using the
	 * current weights and biases. Returns an array of Matrices containing the outputs
	 * of all layers in order (each element is the output of one layer).
	 * @param inputs the inputs from which we want to find the outputs.
	 * @param normalize boolean to indicate if we want to normalize the data.
	 * @returns the outputs of all layers of the model.
	 */
	public predictReturnAll(inputs: Matrix, normalize: boolean): Matrix[] {
		let output: Matrix = normalize ? this.normalizeByRow(inputs) : inputs;
		let outputArray: Matrix[] = [];

		// Computes the outputs for each layer.
		for (let i: number = 0; i < this.layers.length; i++) {
			output = this.layers[i].computeLayer(output);
			outputArray.push(output);
		}
		return outputArray;
	}

	//---- WEIGHTS METHODS ----//
	/**
	 * Returns the weights Matrix of a specified layer.
	 * @param layer the layer's index (starting at 0).
	 * @returns the weights Matrix of the layer.
	 */
	public getWeightsByLayer(layer: number): Matrix {
		return this.layers[layer].getWeights();
	}

	/**
	 * Returns the weights from all layers of the neural network in an array
	 * of Matrices.
	 * @returns an array of Matrices with all weights.
	 */
	public getAllWeights(): Matrix[] {
		let allWeights: Matrix[] = [this.layers[0].getWeights()];
		for (let layer: number = 1; layer < this.layers.length; layer++) {
			allWeights.push(this.layers[layer].getWeights());
		}
		return allWeights;
	}

	/**
	 * Sets the current weights of the specified layer to the new
	 * biases given in parameters.
	 * @param layer the layer to set.
	 * @param newWeights the new values for biases.
	 */
	public setWeightsByLayer(layer: number, newWeights: Matrix) {
		this.layers[layer].setWeights(newWeights);
	}

	//---- BIASES BY LAYER ----//
	/**
	 * Returns the biases Matrix of a specified layer.
	 * @param layer the layer's index (starting at 0).
	 * @returns the biases Matrix of the layer.
	 */
	public getBiasesByLayer(layer: number): Matrix {
		return this.layers[layer].getBiases();
	}

	/**
	 * Returns the biases from all layers of the neural network in an array
	 * of Matrices.
	 * @returns an array of Matrices with all biases.
	 */
	public getAllBiases(): Matrix[] {
		let allBiases: Matrix[] = [this.layers[0].getBiases()];
		for (let layer: number = 1; layer < this.layers.length; layer++) {
			allBiases.push(this.layers[layer].getBiases());
		}
		return allBiases;
	}

	/**
	 * Sets the current biases of the specified layer to the new
	 * biases given in parameters.
	 * @param layer the layer to set.
	 * @param newBiases the new values for biases.
	 */
	public setBiasesByLayer(layer: number, newBiases: Matrix) {
		this.layers[layer].setBiases(newBiases);
	}

	/**
	 * Returns all activation functions of hidden layers and the output layer. The output
	 * activation is the last element of the returned array.
	 * @returns an array of activation functions from the neural network.
	 */
	public getAllActivations(): ActivationFunction[] {
		let allActivations: ActivationFunction[] = [];

		for (let layer: number = 0; layer < this.layers.length; layer++) {
			allActivations.push(this.layers[layer].getActivation());
		}
		return allActivations;
	}

	public setNormalization(
		inputMeans: number[],
		inputDeviations: number[],
		outputMean?: number | undefined,
		outputDeviation?: number | undefined,
	): void {
		this.inputMeans = inputMeans;
		this.inputDeviations = inputDeviations;
	}
}
