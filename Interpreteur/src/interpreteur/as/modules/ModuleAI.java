package interpreteur.as.modules;

import interpreteur.as.lang.ASFonctionModule;
import interpreteur.as.lang.datatype.*;
import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.lang.ASTypeBuiltin;
import interpreteur.as.modules.core.ASModule;
import interpreteur.data_manager.Data;
import interpreteur.executeur.Executeur;

import java.util.Arrays;
import java.util.stream.DoubleStream;
import java.util.stream.Stream;


/**
 * Module containing all methods related to artificial intelligence.
 *
 * @author Felix Jobin
 */
public class ModuleAI {

    //Data used for the first AI course. These next constants are temporary.
    public static final Double[] DATA_X = {
            22.9, 26.3, 33.0, 38.7, 30.0, 28.8, 20.5, 25.4, 27.4, 27.2, 35.0, 34.4, 31.7,
            31.6, 30.6, 25.8, 24.7, 20.9, 38.6, 27.1, 33.5, 39.0, 37.7, 25.2, 31.4,
            44.8, 41.5, 40.7, 36.9, 37.6, 38.2, 41.9, 39.6, 35.4, 39.2, 38.3, 38.6,
            38.5, 37.5, 37.6, 33.3, 40.4, 36.9, 44.5, 49.6, 43.3, 30.4, 44.4, 41.0,
            38.5, 60.0, 61.7, 48.2, 51.5, 55.4, 48.1, 48.9, 55.2, 52.8, 46.7, 40.8,
            40.3, 43.7, 49.1, 55.6, 58.6, 55.8, 48.4, 51.3, 58.0, 52.0, 54.8, 56.6,
            57.6, 46.5, 75.2, 77.7, 71.4, 65.1, 62.4, 68.8, 69.6, 66.9, 74.8, 71.8,
            66.5, 58.4, 73.7, 71.0, 71.5, 68.0, 60.4, 59.5, 72.0, 79.0, 71.0, 72.5, 68.7, 68.8, 66.5
    };
    public static final Double[] DATA_Y = {
            202.0, 181.0, 225.0, 177.0, 198.0, 201.0, 198.0, 252.0, 208.0, 202.0, 200.0, 170.0, 187.0, 189.0, 202.0,
            184.0, 182.0, 235.0, 194.0, 214.0, 195.0, 214.0, 199.0, 238.0, 215.0, 300.0, 276.0, 321.0, 326.0, 310.0,
            355.0, 331.0, 303.0, 272.0, 280.0, 344.0, 292.0, 263.0, 257.0, 317.0, 309.0, 304.0, 327.0, 329.0, 331.0,
            261.0, 307.0, 279.0, 287.0, 349.0, 403.0, 399.0, 424.0, 383.0, 409.0, 395.0, 390.0, 407.0, 462.0, 397.0,
            449.0, 392.0, 410.0, 435.0, 395.0, 420.0, 431.0, 444.0, 418.0, 369.0, 419.0, 425.0, 385.0, 436.0, 353.0,
            495.0, 479.0, 507.0, 466.0, 488.0, 498.0, 507.0, 477.0, 483.0, 460.0, 489.0, 499.0, 459.0, 541.0, 526.0,
            518.0, 509.0, 507.0, 504.0, 534.0, 446.0, 477.0, 537.0, 566.0, 539.0
    };
    //Sets how many numbers are after the coma when rounding, depending on the amount of zeroes.
    private static final double ROUNDING_FACTOR = 100.0;

    /**
     * Finds the mean of all the elements in the <b>data</b> array.
     * If the array is empty, throws an error message.
     *
     * @param data The array of values in which we want to find the mean.
     * @return The mean of the array values.
     * @throws NoDataException if the array is empty.
     */
    public static double mean(Double[] data) throws NoDataException {
        //General case
        double mean = summation(data) / (double) data.length;
        return Math.round(mean * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }

    /**
     * Finds the sum of all values inside the <b>data</b> array.
     * If the array is empty, throws an error message.
     *
     * @param data The array of values in which we want to find the sum.
     * @return The sum of the array values.
     * @throws NoDataException if the array is empty.
     */
    public static double summation(Double[] data) throws NoDataException {
        //Case where data.length == 0
        double sum = 0;
        if (data.length == 0)
            throw new DifferentArrayLengthException("Erreur sommation() : la liste de données est vide");
        //General case
        for (Double datum : data) {
            sum += datum;
        }
        return sum;
    }

    /**
     * Finds the standard deviation of all values inside the <b>data</b> array.
     * If the array is empty, throws an error message.
     *
     * @param data The array of values in which we want to find the standard deviation.
     * @return The standard deviation of the array values.
     * @throws NoDataException if the array is empty.
     */
    public static double standardDeviation(Double[] data) throws NoDataException {
        double strdDev = 0;
        double mean = mean(data);

        //Case where data.length == 0
        if (data.length == 0) throw new NoDataException("Erreur ecartType() : la liste de données est vide");
        Double[] differences = new Double[data.length];

        //General case
        for (int i = 0; i < differences.length; i++) {
            differences[i] = Math.pow(data[i] - mean, 2);
        }
        strdDev = Math.sqrt(summation(differences) / (double) differences.length);
        return Math.round(strdDev * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }

    /**
     * <p>
     * Calculates the <b>coefficient of correlation</b>, which describes the linear relationship between two variables.
     * It takes two double arrays of <u>the same length</u> as arguments. The first is for the independent variable
     * (<b>x</b>), and the second for the dependent variable (<b>y</b>).
     * </p>
     *
     * <p>
     * If the returned value is > 0, the two variables increase most-likely together. If it is < 0,
     * when the first variable increases, the second one most-likely decreases.
     * If the result is near 0, it means that there is no strong relationship between the two variables.
     * </p>
     *
     * <p>
     * If the arrays does not have the same length, sends an error message to the user (IN THE CONSOLE FOR NOW, NOT FINISHED).
     * If one of the arrays is empty, throws an error message.
     * </p>
     *
     * @param x The values of the independent variable.
     * @param y The values of the dependent variable.
     * @return The correlation coefficient (<b>r</b>).
     * @throws DifferentArrayLengthException if the two arrays are not the same length.
     * @throws NoDataException               if one of the arrays is empty.
     */
    public static double correlationCoefficient(Double[] x, Double[] y) throws DifferentArrayLengthException, NoDataException {
        double r = 0;
        int n = 0;

        //Cases where an array is empty
        if (x.length == 0)
            throw new NoDataException("Erreur coefficientCorrelation() des données x : la liste de données x est vide");
        if (y.length == 0)
            throw new NoDataException("Erreur coefficientCorrelation() des données y : la liste de données y est vide");

        //Case where x data and y data are not the same amount
        if (x.length == y.length) n = x.length;
        else {
            throw new DifferentArrayLengthException("Erreur coefficientCorrelation() : les deux listes ne sont pas de la même longueur.");
        }

        //Calculating the x*y array
        Double[] xy = new Double[n];
        for (int i = 0; i < n; i++) {
            xy[i] = x[i] * y[i];
        }

        //Calculating the x*x array
        Double[] x2 = new Double[n];
        for (int i = 0; i < n; i++) {
            x2[i] = x[i] * x[i];
        }

        //Calculating the y*y array
        Double[] y2 = new Double[n];
        for (int i = 0; i < n; i++) {
            y2[i] = y[i] * y[i];
        }

        //Calculating the r value
        double numerator = n * summation(xy) - (summation(x) * summation(y));
        double denominator = (n * summation(x2) - Math.pow(summation(x), 2)) * (n * summation(y2) - Math.pow(summation(y), 2));

        r = numerator / Math.sqrt(denominator);

        return Math.round(r * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }

    /**
     * <p>
     * Calculates the coefficient of determination, which describes the relationship between two variables in general.
     * This value is always between 0 and 1. It takes two double arrays of <u>the same length</u> as arguments.
     * The first is for the independent variable (<b>x</b>), and the second for the dependent variable (<b>y</b>).
     * </p>
     *
     * <p>
     * If the returned value is near 0, there is no strong relationship between the two variables.
     * If the returned value is near 1, there is a strong relationship between the two variables.
     * </p>
     *
     * <p>
     * If the arrays does not have the same length, sends an error message to the user (IN THE CONSOLE FOR NOW, NOT FINISHED).
     * If one of the arrays is empty, throws an error message.
     * </p>
     *
     * @param x The values of the independent variable.
     * @param y The values of the dependent variable.
     * @return The determination coefficient (<b>R<sup>2</sup></b>).
     * @throws DifferentArrayLengthException if the two arrays are not the same length.
     * @throws NoDataException               if one of the arrays is empty.
     */
    public static double determinationCoefficient(Double[] x, Double[] y) throws DifferentArrayLengthException, NoDataException {
        double r2 = 0;

        r2 = Math.pow(correlationCoefficient(x, y), 2);

        return Math.round(r2 * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }

    /**
     * Evaluates the cost function with the predicted values from a model and the real values from a data
     * distribution. It uses the <u>Mean Absolute Error</u> method to calculate the cost function.
     *
     * @param predictedValues the predicted values from the model.
     * @param realValues      the real values from the dataset.
     * @return the mean absolute error according to the data.
     * @throws NoDataException               if one of the arrays is empty.
     * @throws DifferentArrayLengthException if the two arrays are not the same length.
     */
    public static double evaluateCostFunction(Double[] predictedValues, Double[] realValues) throws NoDataException, DifferentArrayLengthException {
        if (predictedValues.length == 0)
            throw new NoDataException("Erreur optimiserFonction() : la liste de données prédites est vide");
        if (realValues.length == 0)
            throw new NoDataException("Erreur optimiserFonction() : la liste de données y est vide");
        if (predictedValues.length != realValues.length)
            throw new DifferentArrayLengthException("Erreur optimiserFonction() : les deux listes ne sont pas de la même longueur.");

        Double[] errors = new Double[realValues.length];
        for (int i = 0; i < errors.length; i++) {
            errors[i] = Math.abs(predictedValues[i] - realValues[i]); //error calculated
        }
        double mean = mean(errors);

        return Math.round(mean * ROUNDING_FACTOR) / ROUNDING_FACTOR;
    }

    /**
     * Returns the rounding factor of the class.
     *
     * @return the rounding factor.
     */
    public static double getRoundingFactor() {
        return ROUNDING_FACTOR;
    }

    static ASModule charger(Executeur executeurInstance) {
        return new ASModule(new ASFonctionModule[]{
                /*
                 Calculates the mean of a list of numbers.
                */
                new ASFonctionModule("moyenne",
                        new ASFonctionModule.Parametre[]{
                                new ASFonctionModule.Parametre(
                                        ASTypeBuiltin.liste.asType(),
                                        "lst",
                                        null
                                )
                        },
                        ASTypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASListe liste = (ASListe) this.getValeurParam("lst");
                        var doubles = liste.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                        return new ASDecimal(mean(doubles));
                    }
                },

                /*
                  Calculates the standart deviation of a list of numbers.
                */
                new ASFonctionModule("ecartType", new ASFonctionModule.Parametre[]{
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.liste.asType(),
                                "lst",
                                null
                        )
                }, ASTypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASListe liste = (ASListe) this.getValeurParam("lst");
                        Double[] doubles;
                        //liste.getValue().stream().map(Object::toString).allMatch(Nombre::estNumerique);
                        try {
                            doubles = liste.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                        } catch (ClassCastException err) {
                            throw new ASErreur.ErreurType("La fonction ecartType prend une liste de nombre, mais la liste pass\u00E9e en param\u00E8tre n'est pas compos\u00E9e que de nombres.");
                        }
                        return new ASDecimal(standardDeviation(doubles));
                    }
                },

                /*
                  Calculates the correlation coefficient of two list of numbers which together are representing
                  coordinates. The first list contains all X values for each point while the second list
                  contains all Y values for each point.

                  If both lists are not the same length, an error will be generated.
                */
                new ASFonctionModule("coefficientCorrelation", new ASFonctionModule.Parametre[]{
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.liste.asType(),
                                "lst1",
                                null
                        ),
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.liste.asType(),
                                "lst2",
                                null
                        )
                }, ASTypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASListe lst1 = (ASListe) this.getValeurParam("lst1");
                        ASListe lst2 = (ASListe) this.getValeurParam("lst2");
                        Double[] x;
                        Double[] y;
                        try {
                            x = lst1.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                            y = lst2.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                        } catch (ClassCastException err) {
                            throw new ASErreur.ErreurType("La fonction ecartType prend une liste de nombre, mais la liste pass\u00E9e en param\u00E8tre n'est pas compos\u00E9e que de nombres.");
                        }
                        return new ASDecimal(correlationCoefficient(x, y));
                    }
                },

                /*
                  Calculates the determination coefficient of two list of numbers which together are representing
                  coordinates. The first list contains all X values for each point while the second list
                  contains all Y values for each point.

                  If both lists are not the same length, an error will be generated.
                */
                new ASFonctionModule("coefficientDetermination", new ASFonctionModule.Parametre[]{
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.liste.asType(),
                                "lst1",
                                null
                        ),
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.liste.asType(),
                                "lst2",
                                null
                        )
                }, ASTypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        ASListe lst1 = (ASListe) this.getValeurParam("lst1");
                        ASListe lst2 = (ASListe) this.getValeurParam("lst2");
                        Double[] x;
                        Double[] y;
                        try {
                            x = lst1.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                            y = lst2.getValue().stream().map(e -> ((Number) e.getValue()).doubleValue()).toArray(Double[]::new);
                        } catch (ClassCastException err) {
                            throw new ASErreur.ErreurType("La fonction ecartType prend une liste de nombre, mais la liste pass\u00E9e en param\u00E8tre n'est pas compos\u00E9e que de nombres.");
                        }
                        return new ASDecimal(determinationCoefficient(x, y));
                    }
                },

                /*
                  Returns the values of the specified column. (ONLY TAKES THE SAME DATASET FOR NOW, WILL BE CHANGED)
                */
                new ASFonctionModule("valeursColonne", new ASFonctionModule.Parametre[]{
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.texte.asType(),
                                "col",
                                null
                        )
                }, ASTypeBuiltin.liste.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        String col = this.getValeurParam("col").getValue().toString();
                        ASListe liste = new ASListe();

                        if (!(col.equalsIgnoreCase("x") || col.equalsIgnoreCase("y"))) {
                            throw new ASErreur.ErreurInputOutput("La fonction valeursColonne() prend en param\u00E8tre le caract\u00E8re \"x\" ou \"y\" seulement.");
                        }
                        System.out.println(col);
                        if (col.contains("x")) {
                            for (Double el : DATA_X) {
                                liste.ajouterElement(new ASDecimal(el));
                            }
                        } else {
                            for (Double el : DATA_Y) {
                                liste.ajouterElement(new ASDecimal(el));
                            }
                        }
                        return liste;

                        //  A TERMINER
                    }
                },
                /*
                    Shows the data on the graph as a scatter plot.
                 */
                new ASFonctionModule("afficherNuage", new ASFonctionModule.Parametre[]{
                }, ASTypeBuiltin.nulType.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        executeurInstance.addData(new Data(Data.Id.AFFICHER_NUAGE));
                        return new ASNul();
                    }
                },
                /*
                    Creates a new regression and shows it on the graph,
                 */
                new ASFonctionModule("creerRegression", new ASFonctionModule.Parametre[]{
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.nombre.asType(), "a", null),
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.nombre.asType(), "b", null),
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.nombre.asType(), "c", null),
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.nombre.asType(), "d", null)
                }, ASTypeBuiltin.nulType.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        double a = ((Number) this.getValeurParam("a").getValue()).doubleValue();
                        double b = ((Number) this.getValeurParam("b").getValue()).doubleValue();
                        double c = ((Number) this.getValeurParam("c").getValue()).doubleValue();
                        double d = ((Number) this.getValeurParam("d").getValue()).doubleValue();
                        executeurInstance.addData(new Data(Data.Id.CREER_REGRESSION)
                                .addParam(a).addParam(b).addParam(c).addParam(d));
                        return new ASNul();
                    }
                },
                /*
                    Applies an algorithm to optimize the regression with the data.
                 */
                new ASFonctionModule("optimiserRegression", new ASFonctionModule.Parametre[]{
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.nombre.asType(), "lr", null),
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.nombre.asType(), "epoch", null)
                }, ASTypeBuiltin.nulType.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        double lr = ((Number) this.getValeurParam("lr").getValue()).doubleValue();
                        double epoch = ((Number) this.getValeurParam("epoch").getValue()).doubleValue();
                        executeurInstance.addData(new Data(Data.Id.OPTIMISER_REGRESSION).addParam(lr).addParam(epoch));
                        return new ASNul();
                    }
                },
                /*
                    Evaluates the regression on the graph at a specific x value.
                 */
                new ASFonctionModule("evaluer", new ASFonctionModule.Parametre[]{
                        new ASFonctionModule.Parametre(
                                ASTypeBuiltin.nombre.asType(), "x", null)
                }, ASTypeBuiltin.nombre.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        double x = ((Number) this.getValeurParam("x").getValue()).doubleValue();
                        return ASNombre.cast((Number) executeurInstance.getDataResponseOrAsk("evaluer", x));
                    }
                },
                /*
                    Evaluates the cost function for the regression on the screen.
                 */
                new ASFonctionModule("fonctionCout", new ASFonctionModule.Parametre[]{
                }, ASTypeBuiltin.nulType.asType()) {
                    @Override
                    public ASObjet<?> executer() {
                        executeurInstance.addData(new Data(Data.Id.FONCTION_COUT));
                        return new ASNul();
                    }
                }
        });
    }

    private static class NoDataException extends ASErreur.ErreurAliveScript {
        public NoDataException(String message) {
            super(message, "ErreurAucuneDonnee");
        }
    }

    private static class DifferentArrayLengthException extends ASErreur.ErreurAliveScript {
        public DifferentArrayLengthException(String message) {
            super(message, "ErreurTailleDeListeIncompatible");
        }
    }
}




















