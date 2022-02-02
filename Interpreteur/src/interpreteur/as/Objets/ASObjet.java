package interpreteur.as.Objets;


import interpreteur.as.erreurs.ASErreur;
import interpreteur.as.erreurs.ASErreur.*;
import interpreteur.ast.buildingBlocs.expressions.Type;
import interpreteur.executeur.Coordonnee;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

//import interpreteur.ast.buildingBlocs.expressions.Type;


/**
 * Les explications vont être rajouté quand j'aurai la motivation de les écrire XD
 *
 * @author Mathis Laroche
 */


public interface ASObjet<T> {

    T getValue();

    boolean boolValue();

    String obtenirNomType();

    enum TypeBuiltin {
        tout,
        entier,
        decimal,
        nombre(TypeBuiltin.entier, TypeBuiltin.decimal),
        texte,
        liste,
        dict,
        iterable(TypeBuiltin.texte, TypeBuiltin.liste, TypeBuiltin.dict),
        booleen,
        nulType,
        rien,
        paire,
        fonctionType;

        private final TypeBuiltin[] aliases;

        TypeBuiltin() {
            this.aliases = null;
        }

        TypeBuiltin(TypeBuiltin... alias) {
            this.aliases = alias;
        }

        public TypeBuiltin[] getAliases() {
            return aliases;
        }

        public Type asType() {
            return new Type(toString());
        }

        /* previous toString
        @Override
        public String toString() {
            return aliases == null ? super.toString() : ArraysUtils.join("|", aliases);
        }
        */
    }

    interface Iterable<T> extends ASObjet<T> {
        boolean contient(ASObjet<?> element);

        Iterable<T> sousSection(int debut, int fin);

        ASObjet<?> get(int index);

        int taille();

        Iterator<ASObjet<?>> iter();

        default int idxRelatif(List<?> valeur, int idx) {
            if (Math.abs(idx) > valeur.size()) {
                throw new ErreurIndex("l'index est trop grand");
            }
            idx = (idx < 0) ? valeur.size() + idx : idx;
            return idx;
        }

        @Override
        default String obtenirNomType() {
            return "iterable";
        }
    }


    class Variable implements ASObjet<Object> {
        private final String nom;
        private final Type type;
        private ASObjet<?> valeur;
        private boolean readOnly = false;

        private Supplier<ASObjet<?>> getter = null;
        private Function<ASObjet<?>, ASObjet<?>> setter = null;


        public Variable(String nom, ASObjet<?> valeur, Type type) {
            this.type = type == null ? new Type("tout") : type;
            this.nom = FonctionManager.ajouterDansStructure(nom);
            this.valeur = valeur instanceof Variable var ? var.getValeurApresGetter() : valeur;
        }

        private boolean nouvelleValeurValide(ASObjet<?> nouvelleValeur) {
            if (getType().noMatch(nouvelleValeur.obtenirNomType())) {
                throw new ErreurAssignement("La variable '" +
                        nom +
                        "' est de type *" +
                        obtenirNomType() +
                        "*. Elle ne peut pas prendre une valeur de type *" +
                        nouvelleValeur.obtenirNomType() +
                        "*.");
            }
            return true;
        }

        /**
         * applique le setter
         *
         * @param valeur
         */
        public void changerValeur(ASObjet<?> valeur) {
            if (nouvelleValeurValide(valeur)) {
                if (this.setter != null) {
                    this.valeur = this.setter.apply(valeur);
                } else {
                    this.valeur = valeur;
                }
            }
        }

        @Override
        public Variable clone() {
            return new Variable(nom, this.valeur, this.type).setGetter(this.getter).setSetter(this.setter);
        }

        public String obtenirNom() {
            return this.nom;
        }

        public Type getType() {
            return type;
        }

        public boolean pasInitialisee() {
            return this.valeur == null;
        }

        public Variable setGetter(Supplier<ASObjet<?>> getter) {
            this.getter = getter;
            return this;
        }

        public Variable setSetter(Function<ASObjet<?>, ASObjet<?>> setter) {
            this.setter = setter;
            return this;
        }

        public Variable setReadOnly() {
            this.setter = (valeur) -> {
                throw new ErreurAssignement("Cette variable est en lecture seule: elle ne peut pas \u00EAtre modifi\u00E9e");
            };
            this.readOnly = true;
            return this;
        }

        public boolean isReadOnly() {
            return readOnly;
        }

        @Override
        public String toString() {
            return "Variable{" +
                    "nom='" + nom + '\'' +
                    ", type='" + type + '\'' +
                    ", valeur=" + valeur +
                    ", getter=" + getter +
                    ", setter=" + setter +
                    '}';
        }

        /* différentes manières de get la valeur stockée dans la variable */
        public ASObjet<?> getValeur() {
            return this.valeur;
        }

        /**
         * by pass the setter
         *
         * @param valeur
         */
        public void setValeur(ASObjet<?> valeur) {
            if (nouvelleValeurValide(valeur))
                this.valeur = valeur;
        }

        public ASObjet<?> getValeurApresGetter() {
            if (this.valeur == null) {
                throw new ErreurAssignement("La variable '" + nom + "' est utilis\u00E9e avant d'\u00EAtre d\u00E9clar\u00E9e");
            }
            if (this.getter != null) {
                return this.getter.get();
            }
            return this.valeur;
        }

        @Override
        public Object getValue() {
            if (this.valeur == null) {
                throw new ErreurAssignement("La variable '" + nom + "' est utilis\u00E9e avant d'\u00EAtre d\u00E9clar\u00E9e");
            }
            if (this.getter != null) {
                return this.getter.get().getValue();
            }
            return this.valeur.getValue();
        }

        @Override
        public boolean boolValue() {
            return this.valeur.boolValue();
        }

        @Override
        public String obtenirNomType() {
            return this.type.getNom();
        }
    }

    class Constante extends Variable {

        public Constante(String nom, ASObjet<?> valeur) {
            super(nom, valeur, new Type("tout"));
        }

        @Override
        public Variable clone() {
            return new Constante(obtenirNom(), this.getValeur());
        }

        @Override
        public Variable setSetter(Function<ASObjet<?>, ASObjet<?>> setter) {
            throw new ErreurAssignement("Les constantes ne peuvent pas avoir de setter");
        }

        @Override
        public Variable setGetter(Supplier<ASObjet<?>> getter) {
            throw new ErreurAssignement("Les constantes ne peuvent pas avoir de getter");
        }

        @Override
        public void changerValeur(ASObjet<?> valeur) {
            if (this.getValeur() != null)
                throw new ErreurAssignement("Il est impossible de changer la valeur d'une constante");
            super.changerValeur(valeur);
        }
    }

    class FonctionManager {

        private static String structure = "";

        // met la fonction dans le dictionnaire de fonction et cree enregistre la fonction dans une Variable
        // pour que le code puisse la retrouver plus tard
        public static void ajouterFonction(Fonction fonction) {
            Scope.getCurrentScope().declarerVariable(new Variable(fonction.getNom(), fonction, new Type(fonction.obtenirNomType())));
            //VariableManager.ajouterConstante(new Constante(fonction.getNom(), fonction));
            //fonction.nom = ajouterDansStructure(fonction.getNom());
        }

        public static String obtenirStructure() {
            return structure;
        }

        public static String ajouterDansStructure(String element) {
            return (structure.isBlank() ? "" : structure + ".") + element;
        }

        public static void ajouterStructure(String nomStruct) {
            if (nomStruct == null) return;
            structure += (structure.isBlank() ? "" : ".") + nomStruct;
        }

        public static void retirerStructure() {
            structure = structure.contains(".") ? structure.substring(0, structure.lastIndexOf(".")) : "";

        }

        public static void reset() {
            structure = "";
        }
    }

    abstract class Fonction implements ASObjet<Object> {
        private final Type typeRetour;
        private final Parametre[] parametres; //String[] de forme {nomDuParam�tre, typeDuParam�tre (ou null s'il n'en poss�de pas)}
        private final String nom;
        private final Coordonnee coordReprise = null;
        private Hashtable<String, ASObjet<?>> parametres_appel = new Hashtable<>();  // Object[][] de forme {{nom_param, valeur}, {nom_param2, valeur2}}
        private String scopeName;

        /**
         * @param nom        <li>
         *                   Nom de la fonction
         *                   </li>
         * @param typeRetour <li>
         *                   Nom du type de retour de la fonction (ex: <i>entier</i>, <i>texte</i>, <i>liste</i>, ect.)
         *                   </li>
         *                   <li>
         *                   le type du retour peut avoir plusieurs types
         *                   -> separer chaque type par un <b>|</b> (les espaces sont ignores)
         *                   <br> (ex: <i>texte | liste</i>, <i>entier | decimal</i>)
         *                   </li>
         *                   <li>
         *                   Mettre <b>null</b> si le type du retour n'a pas de type forcee
         *                   </li>
         */
        public Fonction(String nom, Type typeRetour) {
            this.nom = nom;
            this.scopeName = "fonc_";
            this.typeRetour = typeRetour;
            this.parametres = new Parametre[0];
        }

        /**
         * @param nom        <li>
         *                   Nom de la fonction
         *                   </li>
         * @param parametres
         * @param typeRetour <li>
         *                   Nom du type de retour de la fonction (ex: <i>entier</i>, <i>texte</i>, <i>liste</i>, ect.)
         *                   </li>
         *                   <li>
         *                   le type du retour peut avoir plusieurs types
         *                   -> separer chaque type par un <b>|</b> (les espaces sont ignores)
         *                   <br> (ex: <i>texte | liste</i>, <i>entier | decimal</i>)
         *                   </li>
         *                   <li>
         *                   Mettre <b>null</b> si le type du retour n'a pas de type forcee
         *                   </li>
         */
        public Fonction(String nom, Parametre[] parametres, Type typeRetour) {
            this.nom = nom;
            this.scopeName = "fonc_";
            this.parametres = parametres;
            this.typeRetour = typeRetour;
        }

        public String getNom() {
            return nom;
        }

        public Type getTypeRetour() {
            return this.typeRetour;
        }

        public Parametre[] getParams() {
            return this.parametres;
        }

        public Hashtable<String, ASObjet<?>> getParamsValeursDict() {
            return this.parametres_appel;
        }

        public ASObjet<?> getValeurParam(String nomParametre) {
            return this.parametres_appel.get(nomParametre);
        }

        /**
         * @return true -> si les parametres sont initialisees <br> false -> s'il n'y a pas de parametres
         * @throws Error une erreur si un des tests n'est pas passe
         */
        public boolean testParams(ArrayList<?> paramsValeurs) {
            if (this.parametres.length == 0 && paramsValeurs.size() == 0) return false;

            int nonDefaultParams = (int) Arrays.stream(parametres).filter(param -> param.getValeurParDefaut() == null).count();

            if (paramsValeurs.size() < nonDefaultParams || paramsValeurs.size() > this.parametres.length) {
                if (nonDefaultParams == this.parametres.length) {
                    throw new ASErreur.ErreurAppelFonction(this.nom, "Le nombre de param\u00E8tres donn\u00E9s est '" + paramsValeurs.size() +
                            "' alors que la fonction en prend '" + this.parametres.length + "'");
                } else {
                    throw new ASErreur.ErreurAppelFonction(this.nom, "Le nombre de param\u00E8tres donn\u00E9s est '" + paramsValeurs.size() +
                            "' alors que la fonction en prend entre '" + nonDefaultParams + "' et '" + this.parametres.length + "'");
                }

            }
            for (int i = 0; i < paramsValeurs.size(); i++) {
                Fonction.Parametre parametre = this.parametres[i];
                if (parametre.getType().noMatch(((ASObjet<?>) paramsValeurs.get(i)).obtenirNomType())) {
                    throw new ASErreur.ErreurType("Le param\u00E8tres '" + parametre.getNom() + "' est de type '" + parametre.getType().nom() +
                            "', mais l'argument pass\u00E9 est de type '" + ((ASObjet<?>) paramsValeurs.get(i)).obtenirNomType() + "'.");
                }
            }
            return true;

            /*
             * grandement am�liorer les tests ici
             * test � ajouter:
             * 	1. tous les param = valeur sont apr�s les params sans val_defaut
             *
             */
        }

        //		public void afficherParams() {
//			System.out.println("Fonction: " + this.nom);
//			for (Object[] param: this.parametres) {
//				String message = "Param�tre " + param[0] + ": {";
//				for (String m : param) {
//					message += ((m == null || m.equals("null")) ? "tout" : m) + ", ";
//				}
//				System.out.println(message.substring(0, message.length()-2) + "}");
//			};
//		}

        public ASObjet<?> setParamPuisExecute(ArrayList<ASObjet<?>> paramsValeurs) {
            this.parametres_appel = new Hashtable<>();

            if (testParams(paramsValeurs)) {
                /*
                 * Défini la valeur de chaque argument passé explicitement par nom dans l'appel de la fonction
                 * ex: foo(param1=vrai)
                 */
                for (ASObjet<?> param : paramsValeurs) {
                    if (param instanceof Parametre parametre) {
                        if (Arrays.stream(parametres).noneMatch(p -> p.getNom().equals(parametre.getNom()))) {
                            throw new ErreurAppelFonction("l'argument: " + parametre.getNom() + " pass\u00E9 en param\u00E8tre" +
                                    " ne correspond \u00E0 aucun param\u00E8tre d\u00E9fini dans la fonction '" + this.nom + "'");
                        }
                        this.parametres_appel.put(parametre.getNom(), parametre.getValeurParDefaut());
                    }
                }

                for (int i = 0; i < this.parametres.length; i++) {
                    Parametre param = this.parametres[i];
                    if (i < paramsValeurs.size()) {
                        this.parametres_appel.putIfAbsent(param.getNom(), paramsValeurs.get(i));

                    } else {
                        if (param.getValeurParDefaut() == null) {
                            throw new ErreurAppelFonction(this.nom, "l'argument: " + param.getNom() + " n'a pas reçu de valeur" +
                                    "et ne poss\u00E8de aucune valeur par d\u00E9faut");
                        }
                        this.parametres_appel.putIfAbsent(param.getNom(), param.getValeurParDefaut());
                    }
                }

                for (Parametre param : this.parametres) {
                    this.parametres_appel.computeIfAbsent(param.getNom(), (val) -> {
                        if (param.getValeurParDefaut() == null) {
                            throw new ErreurAppelFonction(this.nom, "l'argument: " + param.getNom() + " n'a pas reçu de valeur" +
                                    "et ne poss\u00E8de aucune valeur par d\u00E9faut");
                        }
                        return param.getValeurParDefaut();
                    });
                }
            }
            return this.executer();
        }

        abstract public ASObjet<?> executer();

        public void setScopeName(String scopeName) {
            this.scopeName = scopeName;
        }

        @Override
        public String toString() {
            return this.nom + "(" +
                    String.join(", ", Arrays.stream(this.parametres).map(p -> p.getNom() + ": " + p.obtenirNomType())
                            .toArray(String[]::new)) +
                    ") " +
                    "\u2192 " + this.typeRetour.nom();
        }

        @Override
        public Object getValue() {
            return this;
        }

        @Override
        public boolean boolValue() {
            return true;
        }

        @Override
        public String obtenirNomType() {
            return TypeBuiltin.fonctionType.toString();
        }

        /**
         * Classe responsable de definir les proprietes des parametres des fonctions
         */
        public record Parametre(Type type, String nom,
                                ASObjet<?> valeurParDefaut) implements ASObjet<Object> {
            /**
             * @param type            <li>
             *                        Nom du type du parametre (ex: <i>entier</i>, <i>texte</i>, <i>liste</i>, ect.)
             *                        </li>
             *                        <li>
             *                        le parametre peut avoir plusieurs types
             *                        -> separer chaque type par un <b>|</b> (les espaces sont ignores)
             *                        <br> (ex: <i>texte | liste</i>, <i>entier | decimal</i>)
             *                        </li>
             *                        <li>
             *                        Mettre <b>null</b> si le parametre n'a pas de type forcee
             *                        </li>
             * @param nom             <li>
             *                        Nom du parametre
             *                        </li>
             * @param valeurParDefaut <li>
             *                        Valeur de type ASObjet qui sera assigne au parametre s'il ne recoit aucune valeur lors de l'appel de la fonction
             *                        </li>
             *                        <li>
             *                        Mettre <b>null</b> pour rendre ce parametre obligatoire lors de l'appel de la fonction
             *                        </li>
             */
            public Parametre(Type type, String nom, ASObjet<?> valeurParDefaut) {
                this.nom = nom;
                this.type = type == null ? ASObjet.TypeBuiltin.tout.asType() : type;
                this.valeurParDefaut = valeurParDefaut;
            }

            public String getNom() {
                return nom;
            }

            public Type getType() {
                return type;
            }

            public ASObjet<?> getValeurParDefaut() {
                return valeurParDefaut;
            }

            @Override
            public Object getValue() {
                return null;
            }

            @Override
            public boolean boolValue() {
                return false;
            }

            @Override
            public String obtenirNomType() {
                return this.type.nom();
            }

            @Override
            public String toString() {
                return "Parametre{" +
                        "nom='" + nom + '\'' +
                        ", type=" + type +
                        ", valeurParDefaut=" + valeurParDefaut +
                        '}';
            }

        }
    }

    class Entier implements Nombre {
        private final int valeur;

        public Entier(Token valeur) {
            try {
                this.valeur = Integer.parseInt(valeur.obtenirValeur());
            } catch (NumberFormatException e) {
                throw new ErreurEntierInvalide("Les nombres entiers doivent avoir une valeur entre "
                        + Integer.MIN_VALUE + " et " + Integer.MAX_VALUE);
            }
        }

        public Entier(Number valeur) {
            try {
                this.valeur = valeur.intValue();
            } catch (NumberFormatException e) {
                throw new ErreurEntierInvalide("Les nombres entiers doivent avoir une valeur entre "
                        + Integer.MIN_VALUE + " et " + Integer.MAX_VALUE);
            }
        }

        public Entier(String valeur) {
            try {
                this.valeur = Integer.parseInt(valeur);
            } catch (NumberFormatException err) {
                throw new ErreurType("La valeur " + valeur + " ne peut pas \u00EAtre convertie en nombre entier.");
            }
        }


        @Override
        public String toString() {
            return this.getValue().toString();
        }

        @Override
        public Integer getValue() {
            return valeur;
        }

        @Override
        public boolean boolValue() {
            return this.valeur != 0;
        }

        @Override
        public String obtenirNomType() {
            return "entier";
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Entier entier)) return false;
            return valeur == entier.valeur;
        }

        @Override
        public int hashCode() {
            return Objects.hash(valeur);
        }
    }

    class Decimal implements Nombre {
        private final double valeur;

        public Decimal(Token valeur) {
            String val = valeur.obtenirValeur();
            if (val.startsWith(".")) val = "0" + val;
            else if (val.endsWith(".")) val += "0";
            this.valeur = Double.parseDouble(val);
        }

        public Decimal(Number valeur) {
            this.valeur = valeur.doubleValue();
        }

        public Decimal(String valeur) {
            try {
                this.valeur = Double.parseDouble(valeur);
            } catch (NumberFormatException err) {
                throw new ErreurType("La valeur " + valeur + " ne peut pas \u00EAtre convertie en nombre d\u00E9cimal.");
            }
        }

        @Override
        public String toString() {
            return this.getValue().toString();
        }

        @Override
        public Double getValue() {
            return valeur;
        }

        @Override
        public boolean boolValue() {
            return this.valeur != 0;
        }

        @Override
        public String obtenirNomType() {
            return "decimal";
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Decimal decimal)) return false;
            return Double.compare(decimal.valeur, valeur) == 0;
        }

        @Override
        public int hashCode() {
            return Objects.hash(valeur);
        }
    }

    class Booleen implements ASObjet<Boolean> {
        private final boolean valeur;

        public Booleen(Token valeur) {
            this.valeur = valeur.obtenirValeur().equals("vrai");
        }

        public Booleen(ASObjet<?> valeur) {
            this.valeur = Boolean.parseBoolean(valeur.getValue().toString());
        }

        public Booleen(Boolean valeur) {
            this.valeur = valeur;
        }

        public Booleen(String valeur) {
            this.valeur = switch (valeur) {
                case "vrai" -> true;
                case "faux" -> false;
                default -> throw new ErreurType("La valeur " + valeur + " ne peut pas \u00EAtre convertie en bool\u00E9en.");
            };
        }

        public static boolean estBooleen(String txt) {
            return txt.equals("vrai") || txt.equals("faux");
        }

        @Override
        public String toString() {
            return valeur ? "vrai" : "faux";
        }

        @Override
        public Boolean getValue() {
            return valeur;
        }

        @Override
        public boolean boolValue() {
            return this.getValue();
        }

        @Override
        public String obtenirNomType() {
            return "booleen";
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Booleen booleen)) return false;
            return valeur == booleen.valeur;
        }

        @Override
        public int hashCode() {
            return Objects.hash(valeur);
        }
    }

    class Nul implements ASObjet<NullType> {

        public Nul() {
        }

        @Override
        public String toString() {
            return "nul";
        }

        @Override
        public NullType getValue() {
            return null;
        }

        @Override
        public boolean boolValue() {
            return false;
        }

        @Override
        public String obtenirNomType() {
            return "nulType";
        }

        @Override
        public boolean equals(Object obj) {
            return obj instanceof ASObjet<?> arrObj && arrObj.getValue() == null;
        }
    }

    class Texte implements Iterable<String> {
        private final String valeur;

        public Texte(Token valeur) {
            this.valeur = valeur.obtenirValeur().substring(1, valeur.obtenirValeur().length() - 1);
        }

        public Texte(Object valeur) {
            this.valeur = String.valueOf(valeur);
        }

        public Texte[] arrayDeLettres() {
            Texte[] array = new Texte[this.getValue().length()];
            int i = 0;
            for (char lettre : this.getValue().toCharArray()) {
                array[i] = new Texte(lettre);
                i++;
            }
            return array;
        }

        @Override
        public String toString() {
            return this.getValue();
        }

        @Override
        public String getValue() {
            return valeur;
        }

        @Override
        public boolean boolValue() {
            return !this.valeur.isEmpty();
        }

        @Override
        public boolean contient(ASObjet<?> element) {
            if (element.getValue() instanceof String s) {
                return this.valeur.contains(s);
            } else {
                return false;
            }
        }

        @Override
        public Iterable<String> sousSection(int debut, int fin) {
            return new Texte(this.valeur.substring(debut, idxRelatif(Arrays.asList(this.arrayDeLettres()), fin)));
        }

        @Override
        public ASObjet<?> get(int index) {
            return new Texte(this.valeur.charAt(idxRelatif(Arrays.asList(this.arrayDeLettres()), index)));
        }

        @Override
        public int taille() {
            return this.valeur.length();
        }

        @Override
        public Iterator<ASObjet<?>> iter() {
            return Arrays.asList((ASObjet<?>[]) this.arrayDeLettres()).iterator();
        }

        @Override
        public String obtenirNomType() {
            return TypeBuiltin.texte.toString();
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Texte texte)) return false;
            return Objects.equals(valeur, texte.valeur);
        }

        @Override
        public int hashCode() {
            return Objects.hash(valeur);
        }
    }

    class Liste implements Iterable<Object> {
        private ArrayList<ASObjet<?>> valeur = new ArrayList<>();

        public Liste() {
        }

        public Liste(ASObjet<?>... valeurs) {
            this.valeur = new ArrayList<>(Arrays.asList(valeurs));
            aucuneClefDuplique();
        }

        public void ajouterElement(ASObjet<?> element) {
            clefValideOrThrow(element);
            this.valeur.add(element);
        }

        public Liste ajouterTout(Liste elements) {
            elements.getValue().forEach(this::clefValideOrThrow);
            this.valeur.addAll(elements.getValue());
            return this;
        }

        public boolean estDict() {
            return valeur.stream().allMatch(ASPaire.class::isInstance);
        }

        public void clefValideOrThrow(ASObjet<?> nouvelElement) {
            if (!(nouvelElement instanceof ASPaire nouvellePaire))
                return;
            if (valeur.stream().anyMatch(val -> val instanceof ASPaire paire && paire.clef().equals(nouvellePaire.clef()))) {
                throw new ErreurClefDupliquee("La clef " + nouvellePaire.clef() + " existe d\u00E9j\u00e0 dans le dictionnaire ou la liste");
            }
        }

        public void aucuneClefDuplique() {
            var clefs = valeur.stream()
                    .map(val -> val instanceof ASPaire paire ? paire.clef().getValue() : null)
                    .filter(Objects::nonNull).toList();
            if (clefs.stream().distinct().count() != clefs.size()) {
                throw new ErreurClefDupliquee("Il y a au moins une clef dupliqu\u00E9e dans le dictionnaire ou la liste");
            }
        }

        public void retirerElement(int idx) {
            ASObjet<?> element = this.valeur.remove(idxRelatif(this.valeur, idx));
        }

        public Liste remplacer(int idx, ASObjet<?> valeur) {
            this.valeur.set(idxRelatif(this.valeur, idx), valeur);
            aucuneClefDuplique();
            return this;
        }

        public Liste remplacer(ASObjet<?> valeur, ASObjet<?> remplacement) {
            this.valeur.replaceAll(v -> v.equals(valeur) ? remplacement : v);
            aucuneClefDuplique();
            return this;
        }

        public Liste remplacerRange(int debut, int fin, Liste remplacement) {
            debut = idxRelatif(valeur, debut);
            fin = idxRelatif(valeur, fin);
            this.valeur = this.sousSection(0, debut).ajouterTout(remplacement).ajouterTout(this.sousSection(fin, this.taille())).getValue();
            aucuneClefDuplique();
            return this;
        }

        public ArrayList<?> map(Function<ASObjet<?>, ?> mappingFunction) {
            var result = this.valeur.stream().map(mappingFunction).collect(Collectors.toCollection(ArrayList::new));
            aucuneClefDuplique();
            return result;
        }

        public ASObjet<?> get(Texte texte) {
            return valeur.stream()
                    .filter(val -> val instanceof ASPaire pair && pair.clef().equals(texte))
                    .findFirst()
                    .orElse(new Nul());
        }

        @Override
        public ASObjet<?> get(int idx) {
            return this.valeur.get(idxRelatif(this.valeur, idx));
        }

        @Override
        public int taille() {
            return this.valeur.size();
        }

        @Override
        public Iterator<ASObjet<?>> iter() {
            return this.valeur.iterator();
        }

        @Override
        public boolean contient(ASObjet<?> element) {
            return this.valeur.contains(element)
                    ||
                    (element instanceof Texte texte && this.valeur.stream().anyMatch(val -> val instanceof ASPaire pair && pair.clef().equals(texte)));
        }

        @Override
        public SousListe sousSection(int debut, int fin) {
            return new SousListe(this, debut, idxRelatif(this.valeur, fin));
        }

        @Override
        public String toString() {
            AtomicInteger nbPair = new AtomicInteger(0);

            String toString = String.join(", ", this.valeur
                    .stream()
                    .map(e -> {
                        if (e instanceof Texte) return "\"" + e + "\"";
                        else if (e instanceof ASPaire) nbPair.set(nbPair.get() + 1);
                        return e.toString();
                    })
                    .toArray(String[]::new));

            final char openingSymbol = nbPair.get() != taille() ? '[' : '{';
            final char closingSymbol = nbPair.get() != taille() ? ']' : '}';

            return openingSymbol + toString + closingSymbol;
        }

        @Override
        public ArrayList<ASObjet<?>> getValue() {
            return this.valeur;
        }

        @Override
        public boolean boolValue() {
            return !this.valeur.isEmpty();
        }

        @Override
        public String obtenirNomType() {
            return estDict() ? "dict" : "liste";
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Liste liste)) return false;
            return Objects.equals(valeur, liste.valeur);
        }

        @Override
        public int hashCode() {
            return Objects.hash(valeur);
        }

        public static class SousListe extends Liste {
            private final Liste parent;

            SousListe(Liste parent, int debut, int fin) {
                super(parent.valeur.subList(debut, fin).toArray(ASObjet<?>[]::new));
                this.parent = parent;
            }

            public Liste getParent() {
                return parent;
            }
        }
    }
}



















