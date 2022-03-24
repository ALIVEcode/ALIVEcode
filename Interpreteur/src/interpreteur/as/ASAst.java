package interpreteur.as;

import interpreteur.as.lang.ASType;
import interpreteur.as.lang.datatype.*;
import interpreteur.as.erreurs.ASErreur.ErreurAssignement;
import interpreteur.as.erreurs.ASErreur.ErreurInputOutput;
import interpreteur.as.erreurs.ASErreur.ErreurSyntaxe;
import interpreteur.as.erreurs.ASErreur.ErreurType;
import interpreteur.ast.Ast;
import interpreteur.ast.buildingBlocs.Expression;
import interpreteur.ast.buildingBlocs.Programme;
import interpreteur.ast.buildingBlocs.expressions.*;
import interpreteur.ast.buildingBlocs.programmes.*;
import interpreteur.executeur.Coordonnee;
import interpreteur.executeur.Executeur;
import interpreteur.generateurs.ast.AstGenerator;
import interpreteur.tokens.Token;

import javax.lang.model.type.NullType;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;


/**
 * Les explications vont être rajouté quand j'aurai la motivation de les écrire XD
 *
 * @author Mathis Laroche
 */


public class ASAst extends AstGenerator {
    private final Executeur executeurInstance;

    public ASAst(Executeur executeurInstance) {
        reset();
        ajouterProgrammes();
        ajouterExpressions();
        this.executeurInstance = executeurInstance;
    }


    protected void ajouterProgrammes() {
        ajouterProgramme("", new Ast<NullType>() {
            @Override
            public NullType apply(List<Object> p) {
                return null;
            }
        });

        ajouterProgramme("UTILISER expression~"
                        + "UTILISER expression BRACES_OUV expression BRACES_FERM",
                new Ast<Utiliser>() {
                    @Override
                    public Utiliser apply(List<Object> p) {
                        if (p.get(1) instanceof ValeurConstante valeurConstante && valeurConstante.eval() instanceof ASTexte texte) {
                            String msg = texte.getValue();
                            if (msg.equalsIgnoreCase("experimental")) {
                                //executeurInstance.setAst(new ASAstExperimental(executeurInstance));
                                return new Utiliser(new Var("experimental"), executeurInstance);
                            } else {
                                throw new ErreurSyntaxe("Les noms de modules ne doivent pas \u00EAtre \u00E9crits avec des \" \" ou des ' '");
                            }
                        }

                        if (p.size() > 2) {
                            Var[] sous_modules;
                            if (p.get(3) instanceof CreerListe.Enumeration enumeration) {
                                sous_modules = enumeration.getExprs().toArray(Var[]::new);
                            } else {
                                sous_modules = new Var[]{(Var) p.get(3)};
                            }
                            return new Utiliser((Var) p.get(1), sous_modules, executeurInstance);
                        }
                        return new Utiliser((Var) p.get(1), executeurInstance);
                    }
                });
        /*
        ajouterProgramme("AFFICHER expression", new Ast<Afficher>() {
            @Override
            public Afficher apply(List<Object> p) {
                return new Afficher((Expression<?>) p.get(1));
            }
        });
         */

        ajouterProgramme("LIRE expression~"
                        + "LIRE expression DANS expression~"
                        + "LIRE expression VIRGULE expression~"
                        + "LIRE expression DANS expression VIRGULE expression",
                new Ast<Lire>() {
                    @Override
                    public Lire apply(List<Object> p) {

                        boolean hasPromptMessage = p.stream()
                                .anyMatch(e -> e instanceof Token token && token.obtenirNom().equals("VIRGULE"));
                        boolean hasAppliedFunction = p.stream()
                                .anyMatch(e -> e instanceof Token token && token.obtenirNom().equals("DANS"));

                        Expression<?> message = null, fonction = null;

                        int idxVar = 1;
                        if (hasAppliedFunction) {
                            fonction = (Expression<?>) p.get(1);
                            idxVar = 3;
                        }
                        if (hasPromptMessage) message = (Expression<?>) p.get(p.size() - 1);

                        if (!(p.get(idxVar) instanceof Var var)) {
                            throw new ErreurInputOutput("Une variable est attendue apr\u00E8s la commande 'lire', mais '" +
                                    p.get(idxVar).getClass().getSimpleName() + "' a \u00E9t\u00E9 trouv\u00E9.");
                        }

                        return new Lire(var, message, fonction, executeurInstance);
                    }
                });
        /*
        ajouterProgramme("ATTENDRE expression", new Ast<Attendre>() {
            @Override
            public Attendre apply(List<Object> p) {
                return new Attendre((Expression<?>) p.get(1));
            }
        });
         */

        ajouterProgramme("CONSTANTE expression {assignements} expression~"
                        + "CONSTANTE expression DEUX_POINTS expression {assignements} expression~"
                        + "VAR expression~"
                        + "VAR expression {assignements} expression~"
                        + "VAR expression DEUX_POINTS expression {assignements} expression~"
                        + "VAR expression DEUX_POINTS expression~"
                        + "expression {assignements} expression",
                new Ast<Programme>() {
                    @Override
                    public Programme apply(List<Object> p) {
                        /*
                         * TODO erreur si c'est pas une Var qui est passé comme expression à gauche de l'assignement
                         */

                        int idxValeur;
                        int idxAssignement;

                        BinOp.Operation op = null;

                        // si le premier mot est "const" ou "var"
                        if (p.get(0) instanceof Token token) {
                            boolean estConst = token.obtenirNom().equals("CONSTANTE");
                            if (p.size() == 2) {
                                return new Declarer((Expression<?>) p.get(1), new ValeurConstante(new ASNul()), null, false);
                            }
                            if (p.size() == 4 && p.get(2) instanceof Token token2 && token2.obtenirNom().equals("DEUX_POINTS")) {
                                // si le type précisisé n'est pas un type
                                if (!(p.get(3) instanceof ASType type))
                                    throw new ErreurType("Dans une d\u00E9claration de " +
                                            (estConst ? "constante" : "variable") +
                                            ", les deux points doivent \u00EAtre suivi d'un type valide");

                                return new Declarer((Expression<?>) p.get(1), new ValeurConstante(new ASNul()), type, false);
                            }
                            ASType type = null;
                            // si la précision du type est présente
                            if (p.size() == 6) {
                                idxValeur = 5;
                                idxAssignement = 4;

                                // si le type précisisé n'est pas un type
                                if (!(p.get(3) instanceof ASType))
                                    throw new ErreurType("Dans une d\u00E9claration de " +
                                            (estConst ? "constante" : "variable") +
                                            ", les deux points doivent \u00EAtre suivi d'un type valide");
                                type = (ASType) p.get(3);
                            }
                            // si la précision du type n'est pas présente
                            else {
                                idxValeur = 3;
                                idxAssignement = 2;
                            }
                            // si on tente de déclarer une constante avec autre chose que = (ex: +=, *=, -=, etc.)
                            String nomAssignement = ((Token) p.get(idxAssignement)).obtenirNom();
                            if (!nomAssignement.equals("ASSIGNEMENT") && !(nomAssignement.equals("ASSIGNEMENT_FLECHE"))) {
                                if (estConst)
                                    throw new ErreurAssignement("Impossible de modifier la valeur d'une constante");
                                else
                                    throw new ErreurAssignement("Impossible de modifier la valeur d'une variable durant sa d\u00E9claration");
                            }

                            // si la valeur de l'expression est une énumération d'éléments ex: 3, "salut", 4
                            // on forme une liste avec la suite d'éléments
                            if (p.get(idxValeur) instanceof CreerListe.Enumeration enumeration)
                                p.set(idxValeur, enumeration.buildCreerListe());

                            // on retourne l'objet Assigner
                            return new Declarer((Expression<?>) p.get(1), (Expression<?>) p.get(idxValeur), type, estConst);

                        }
                        // si le premier mot n'est pas "const" ou "var"
                        else {
                            // si un type est précisé
                            if (p.size() == 5) {
                                throw new ErreurType("Il est impossible de pr\u00E9ciser le type d'une variable ailleurs que dans sa d\u00E9claration");
                            } else {
                                idxValeur = 2;
                                idxAssignement = 1;
                            }

                            // si on tente d'assigner avec un opérateur spécial (ex: +=, *=, -=, etc.)
                            String nomAssignement = ((Token) p.get(idxAssignement)).obtenirNom();
                            if (!nomAssignement.equals("ASSIGNEMENT") && !(nomAssignement.equals("ASSIGNEMENT_FLECHE"))) {
                                op = BinOp.Operation.valueOf(((Token) p.get(idxAssignement)).obtenirNom().split("_")[0]);
                            }

                            // si la valeur de l'expression est une énumération d'éléments ex: var = 3, "salut", 4
                            // on forme une liste avec la suite d'éléments
                            if (p.get(idxValeur) instanceof CreerListe.Enumeration enumeration)
                                p.set(idxValeur, enumeration.buildCreerListe());
                            return new Assigner((Expression<?>) p.get(0), (Expression<?>) p.get(idxValeur), op);
                        }
                    }
                });

        ajouterProgramme("{methode_moteur} expression~"
                        + "{methode_moteur}",
                new Ast<MethodeMoteur>() {
                    @Override
                    public MethodeMoteur apply(List<Object> p) {
                        String nom = ((Token) p.get(0)).obtenirNom();

                        return new MethodeMoteur(nom, p.size() > 1 ? (Expression<?>) p.get(1) : null);
                    }
                });

        ajouterProgramme("STRUCTURE NOM_VARIABLE", new Ast<CreerStructure>() {
            @Override
            public CreerStructure apply(List<Object> p) {
                return new CreerStructure(((Token) p.get(1)).obtenirValeur());
            }
        });

        ajouterProgramme("FIN STRUCTURE", new Ast<FinStructure>() {
            @Override
            public FinStructure apply(List<Object> p) {
                return new FinStructure();
            }
        });

        //<-----------------------------------Les getters----------------------------------------->//
        ajouterProgramme("GET NOM_VARIABLE~" +
                        "GET NOM_VARIABLE FLECHE expression",
                new Ast<CreerGetter>() {
                    @Override
                    public CreerGetter apply(List<Object> p) {
                        ASType type = new ASType("tout");
                        if (p.size() > 2) {
                            if (!(p.get(3) instanceof ASType)) {
                                throw new ErreurType("'" + p.get(4) + "' n'est pas un type valide");
                            }
                            type = (ASType) p.get(3);
                        }
                        return new CreerGetter(new Var(((Token) p.get(1)).obtenirValeur()), type, executeurInstance);
                    }
                });

        ajouterProgramme("FIN GET",
                new Ast<FinGet>() {
                    @Override
                    public FinGet apply(List<Object> p) {
                        return new FinGet(executeurInstance);
                    }
                });

        //<-----------------------------------Les setters----------------------------------------->//
        ajouterProgramme("SET NOM_VARIABLE PARENT_OUV NOM_VARIABLE PARENT_FERM~" +
                        "SET NOM_VARIABLE PARENT_OUV NOM_VARIABLE DEUX_POINTS expression PARENT_FERM",
                new Ast<CreerSetter>() {
                    @Override
                    public CreerSetter apply(List<Object> p) {
                        ASType type = new ASType("tout");
                        if (p.size() > 5) {
                            if (!(p.get(5) instanceof ASType)) {
                                throw new ErreurType("'" + p.get(5) + "' n'est pas un type valide");
                            }
                            type = (ASType) p.get(5);
                        }
                        return new CreerSetter(new Var(((Token) p.get(1)).obtenirValeur()), new Var(((Token) p.get(3)).obtenirValeur()), type, executeurInstance);
                    }
                });

        ajouterProgramme("FIN SET",
                new Ast<FinSet>() {
                    @Override
                    public FinSet apply(List<Object> p) {
                        return new FinSet(executeurInstance);
                    }
                });

        //<-----------------------------------Les fonctions----------------------------------------->//

        ajouterProgramme("FONCTION expression PARENT_OUV expression PARENT_FERM FLECHE expression~" +
                        "FONCTION expression PARENT_OUV expression PARENT_FERM",
                new Ast<CreerFonction>(
                        new Object[]{"expression DEUX_POINTS expression ASSIGNEMENT expression~"
                                + "expression ASSIGNEMENT expression~"
                                + "expression DEUX_POINTS expression",
                                new Ast<Argument>(19) {
                                    @Override
                                    public Argument apply(List<Object> p) {
                                        ASType type = new ASType("tout");
                                        Expression<?> valParDefaut = null;

                                        if (!(p.get(0) instanceof Var var)) {
                                            throw new ErreurSyntaxe("Une d\u00E9claration de fonction doit commencer par une variable, pas par " + p.get(0));
                                        }

                                        Token deuxPointsToken = (Token) p.stream()
                                                .filter(t -> t instanceof Token token && token.obtenirNom().equals("DEUX_POINTS"))
                                                .findFirst()
                                                .orElse(null);
                                        if (deuxPointsToken != null) {
                                            Expression<?> typeObj = (Expression<?>) p.get(p.indexOf(deuxPointsToken) + 1);
                                            if (!(typeObj instanceof ASType)) {
                                                String nom;
                                                if (p.get(0) instanceof Var) {
                                                    nom = ((Var) typeObj).getNom();
                                                } else {
                                                    nom = typeObj.eval().toString();
                                                }
                                                throw new ErreurType("Le symbole ':' doit \u00EAtre suivi d'un type valide ('" + nom + "' n'est pas un type valide)");
                                            }
                                            type = (ASType) typeObj;
                                        }
                                        Token assignementToken = (Token) p.stream()
                                                .filter(t -> t instanceof Token token && token.obtenirNom().equals("ASSIGNEMENT"))
                                                .findFirst()
                                                .orElse(null);
                                        if (assignementToken != null) {
                                            valParDefaut = (Expression<?>) p.get(p.indexOf(assignementToken) + 1);
                                        }

                                        return new Argument(var, valParDefaut, type);
                                    }
                                }}
                ) {
                    @Override
                    public CreerFonction apply(List<Object> p) {
                        Argument[] params = new Argument[]{};

                        ASType typeRetour = p.get(p.size() - 1) instanceof ASType type ? type : new ASType("tout");

                        if (p.get(p.size() - 1) == null && p.get(3) instanceof ASType type) {
                            typeRetour = type;
                            return new CreerFonction((Var) p.get(1), params, typeRetour, executeurInstance);
                        }

                        if (p.get(3) != null && !(p.get(3) instanceof Token)) {
                            if (p.get(3) instanceof CreerListe.Enumeration enumeration) {
                                params = enumeration.getExprs()
                                        .stream()
                                        .map(expr -> expr instanceof Argument arg
                                                ? arg
                                                : new Argument((Var) expr, null, null))
                                        .toArray(Argument[]::new);
                            } else if (p.get(3) instanceof Argument arg) {
                                params = new Argument[]{arg};
                            } else {
                                params = new Argument[]{
                                        new Argument((Var) p.get(3), null, null)
                                };
                            }
                        }

                        return new CreerFonction((Var) p.get(1), params, typeRetour, executeurInstance);
                    }
                });

        ajouterProgramme("RETOURNER~" +
                        "RETOURNER expression",
                new Ast<Retourner>() {
                    @Override
                    public Retourner apply(List<Object> p) {
                        if (p.size() > 1 && p.get(1) instanceof CreerListe.Enumeration enumeration)
                            p.set(1, enumeration.buildCreerListe());
                        return new Retourner(p.size() > 1 ? (Expression<?>) p.get(1) : new ValeurConstante(new ASNul()));
                    }
                });


        ajouterProgramme("FIN FONCTION", new Ast<FinFonction>() {
            @Override
            public FinFonction apply(List<Object> p) {
                return new FinFonction(executeurInstance);
            }
        });


        //<-----------------------------------Les blocs de code------------------------------------->
        ajouterProgramme("SI expression~" +
                        "SI expression ALORS",
                new Ast<Si>() {
                    @Override
                    public Si apply(List<Object> p) {
                        return new Si((Expression<?>) p.get(1), executeurInstance);
                    }
                });

        ajouterProgramme("SINON SI expression~" +
                        "SINON SI expression ALORS",
                new Ast<SinonSi>() {
                    @Override
                    public SinonSi apply(List<Object> p) {
                        return new SinonSi((Expression<?>) p.get(2), executeurInstance);
                    }
                });


        ajouterProgramme("SINON",
                new Ast<Sinon>() {
                    @Override
                    public Sinon apply(List<Object> p) {
                        return new Sinon(executeurInstance);
                    }
                });

        ajouterProgramme("FIN SI", new Ast<FinSi>() {
            @Override
            public FinSi apply(List<Object> p) {
                return new FinSi(executeurInstance);
            }
        });

        ajouterProgramme("FAIRE",
                new Ast<Programme>() {
                    @Override
                    public Programme apply(List<Object> p) {
                        return new Programme(executeurInstance) {
                            @Override
                            public NullType execute() {
                                assert this.executeurInstance != null;
                                this.executeurInstance.obtenirCoordRunTime().nouveauBloc("faire");
                                return null;
                            }

                            @Override
                            public Coordonnee prochaineCoord(Coordonnee coord, List<Token> ligne) {
                                return coord.nouveauBloc("faire");
                            }

                            @Override
                            public String toString() {
                                return "BoucleFaire";
                            }
                        };
                    }
                });

        ajouterProgramme("TANT_QUE expression",
                new Ast<BoucleTantQue>() {
                    @Override
                    public BoucleTantQue apply(List<Object> p) {
                        return new BoucleTantQue((Expression<?>) p.get(1), executeurInstance);
                    }
                });

        ajouterProgramme("REPETER expression", new Ast<BoucleRepeter>() {
            @Override
            public BoucleRepeter apply(List<Object> p) {
                return new BoucleRepeter((Expression<?>) p.get(1), executeurInstance);
            }
        });

        ajouterProgramme("POUR expression DANS expression~"
                        + "POUR VAR expression DANS expression~"
                        + "POUR CONSTANTE expression DANS expression",
                new Ast<BouclePour>() {
                    @Override
                    public BouclePour apply(List<Object> p) {
                        // boucle pour sans déclaration
                        if (p.size() == 4) {
                            return new BouclePour((Var) p.get(1), (Expression<?>) p.get(3), executeurInstance);
                        } else {
                            boolean estConst = ((Token) p.get(1)).obtenirNom().equals("CONSTANTE");
                            return new BouclePour((Var) p.get(2), (Expression<?>) p.get(4), executeurInstance).setDeclarerVar(estConst, null);
                        }
                    }
                });

        ajouterProgramme("SORTIR", new Ast<Boucle.Sortir>() {
            @Override
            public Boucle.Sortir apply(List<Object> p) {
                return new Boucle.Sortir(executeurInstance);
            }
        });

        ajouterProgramme("CONTINUER", new Ast<Boucle.Continuer>() {
            @Override
            public Boucle.Continuer apply(List<Object> p) {
                return new Boucle.Continuer(executeurInstance);
            }
        });

        ajouterProgramme("FIN POUR~"
                        + "FIN TANT_QUE~"
                        + "FIN REPETER",
                new Ast<FinBoucle>() {
                    @Override
                    public FinBoucle apply(List<Object> p) {
                        return new FinBoucle(((Token) p.get(1)).obtenirValeur(), executeurInstance);
                    }
                });

        ajouterProgramme("expression", new Ast<Programme>() {
            @Override
            public Programme apply(List<Object> p) {
                return Programme.evalExpression((Expression<?>) p.get(0), p.get(0).toString());
            }
        });
        //setOrdreProgramme();
    }


    protected void ajouterExpressions() {

        ajouterExpression("NOM_VARIABLE", new Ast<Var>() {
            @Override
            public Var apply(List<Object> p) {
                return new Var(((Token) p.get(0)).obtenirValeur());
            }
        });

        ajouterExpression("{nom_type_de_donnees}",
                new Ast<ASType>() {
                    @Override
                    public ASType apply(List<Object> p) {
                        return new ASType(((Token) p.get(0)).obtenirValeur());
                    }
                });

        ajouterExpression("{type_de_donnees}",
                new Ast<ValeurConstante>() {
                    @Override
                    public ValeurConstante apply(List<Object> p) {
                        Token valeur = (Token) p.get(0);
                        String nom = valeur.obtenirNom();
                        return new ValeurConstante(switch (nom) {
                            case "ENTIER" -> new ASEntier(valeur);
                            case "DECIMAL" -> new ASDecimal(valeur);
                            case "TEXTE" -> new ASTexte(valeur);
                            case "BOOLEEN" -> new ASBooleen(valeur);
                            case "NUL" -> new ASNul();
                            default -> throw new ErreurType("Type de donnee invalide");
                        });
                    }
                });

        //call fonction
        ajouterExpression("expression PARENT_OUV #expression PARENT_FERM~"
                        + "expression PARENT_OUV PARENT_FERM",
                new Ast<AppelFonc>() {
                    @Override
                    public AppelFonc apply(List<Object> p) {
                        if (p.size() == 3) {
                            //Expression<?> nom = p.get(0) instanceof Type type
                            //        ? new Var(type.nom())
                            //        : (Expression<?>) p.get(0);
                            return new AppelFonc((Expression<?>) p.get(0), new CreerListe());
                        }
                        Hashtable<String, Ast<?>> astParams = new Hashtable<>();

                        //astParams.put("expression DEUX_POINTS expression", new Ast<Argument>(8){
                        //    @Override
                        //    public Argument apply(List<Object> p) {
                        //        assert p.get(0) instanceof Var : "gauche assignement doit être Var (source: appelFonction dans ASAst)";
                        //
                        //        return new Argument((Var) p.get(0), (Expression<?>) p.get(2), null);
                        //    }
                        //});
                        Expression<?> contenu = evalOneExpr(new ArrayList<>(p.subList(2, p.size() - 1)), astParams);

                        CreerListe args = contenu instanceof CreerListe.Enumeration enumeration ?
                                enumeration.buildCreerListe() :
                                new CreerListe(contenu);


                        //final Expression<?> nom;
                        //if (p.get(0) instanceof Type type) {
                        //    nom = new Var(type.nom());
                        //} else {
                        //    nom = (Expression<?>) p.get(0);
                        //}

                        return new AppelFonc((Expression<?>) p.get(0), args);
                    }
                });

        ajouterExpression("PARENT_OUV #expression PARENT_FERM~"
                        + "PARENT_OUV expression PARENT_FERM~"
                        + "PARENT_OUV PARENT_FERM",
                new Ast<Expression<?>>() {
                    @Override
                    public Expression<?> apply(List<Object> p) {
                        if (p.size() == 2) {
                            return new Expression.ExpressionVide();
                        }
                        return evalOneExpr(new ArrayList<>(p.subList(1, p.size() - 1)), null);
                    }
                });


        //ajouterExpression("!expression PIPE #expression PIPE",
        //        new Ast<UnaryOp>(4) {
        //            @Override
        //            public UnaryOp apply(List<Object> p) {
        //                Expression<?> expr = AstGenerator.eval(new ArrayList<>(p.subList(1, p.size() - 1)), null).get(0);
        //                return new UnaryOp(expr, UnaryOp.Operation.ABSOLUE);
        //            }
        //        });

        ajouterExpression("BRACES_OUV #expression TROIS_POINTS #expression BRACES_FERM~"
                        + "BRACES_OUV #expression TROIS_POINTS #expression BOND #expression BRACES_FERM~"
                        + "CROCHET_OUV #expression TROIS_POINTS #expression BOND #expression CROCHET_FERM~"
                        + "CROCHET_OUV #expression TROIS_POINTS #expression CROCHET_FERM",
                new Ast<Suite>() {
                    /**
                     * {1...10} -> {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
                     * {"a"..."g"} -> {"a", "b", "c", "d", "e", "f", "g"}
                     * {"A"..."G"} -> {"A", "B", "C", "D", "E", "F", "G"}
                     */
                    @Override
                    public Suite apply(List<Object> p) {

                        int idxTroisPoints = p.indexOf(p.stream().filter(exp -> exp instanceof Token token
                                && token.obtenirNom().equals("TROIS_POINTS")).findFirst().orElseThrow());
                        Token bondToken = (Token) p.stream()
                                .filter(exp -> exp instanceof Token token && token.obtenirNom().equals("BOND"))
                                .findFirst()
                                .orElse(null);

                        Expression<?> debut = evalOneExpr(new ArrayList<>(p.subList(1, idxTroisPoints)), null);
                        Expression<?> fin, bond = null;

                        // pas de bond, forme {debut...fin}
                        if (bondToken == null) {
                            fin = evalOneExpr(new ArrayList<>(p.subList(idxTroisPoints + 1, p.size() - 1)), null);
                        } else {
                            int idxBond = p.indexOf(bondToken);
                            fin = evalOneExpr(new ArrayList<>(p.subList(idxTroisPoints + 1, idxBond)), null);
                            bond = evalOneExpr(new ArrayList<>(p.subList(idxBond + 1, p.size() - 1)), null);
                        }

                        return new Suite(debut, fin, bond);
                    }
                });


        ajouterExpression("expression CROCHET_OUV DEUX_POINTS CROCHET_FERM~"
                        + "expression CROCHET_OUV #expression DEUX_POINTS #expression CROCHET_FERM~"
                        + "expression CROCHET_OUV #expression DEUX_POINTS CROCHET_FERM~"
                        + "expression CROCHET_OUV DEUX_POINTS #expression CROCHET_FERM~"
                        + "expression CROCHET_OUV #expression CROCHET_FERM",
                new Ast<CreerListe.SousSection>() {
                    @Override
                    public CreerListe.SousSection apply(List<Object> p) {

                        Token deux_pointsToken = (Token) p.stream()
                                .filter(exp -> exp instanceof Token token && token.obtenirNom().equals("DEUX_POINTS"))
                                .findFirst()
                                .orElse(null);

                        // pas de deux points, forme val[idxOrKey]
                        if (deux_pointsToken == null) {
                            Expression<?> idx = evalOneExpr(new ArrayList<>(p.subList(2, p.size() - 1)), null);
                            return new CreerListe.SousSection.IndexSection((Expression<?>) p.get(0), idx);
                        }
                        // deux points, forme val[debut:fin] ou val[:fin] ou val[debut:] ou val[:]
                        else {
                            Expression<?> debut = null, fin = null;
                            int idxDeuxPoints = p.indexOf(deux_pointsToken);
                            // si debut dans sous section
                            if (idxDeuxPoints > 2) {
                                debut = evalOneExpr(new ArrayList<>(p.subList(2, idxDeuxPoints)), null);
                            }
                            // si fin dans sous section
                            if (idxDeuxPoints < p.size() - 2) {
                                fin = evalOneExpr(new ArrayList<>(p.subList(idxDeuxPoints + 1, p.size() - 1)), null);
                            }
                            return new CreerListe.SousSection.CreerSousSection((Expression<?>) p.get(0), debut, fin);
                        }
                    }
                });
        ajouterExpression("BRACES_OUV BRACES_FERM~"
                        + "BRACES_OUV #expression BRACES_FERM~"
                        + "CROCHET_OUV CROCHET_FERM~"
                        + "!expression CROCHET_OUV CROCHET_FERM~"
                        + "!expression CROCHET_OUV #expression CROCHET_FERM",
                new Ast<CreerListe>() {
                    @Override
                    public CreerListe apply(List<Object> p) {
                        if (p.size() < 3) return new CreerListe();
                        Expression<?> contenu = evalOneExpr(new ArrayList<>(p.subList(1, p.size() - 1)), null);
                        if (contenu instanceof CreerListe.Enumeration enumeration)
                            return enumeration.buildCreerListe();
                        return new CreerListe(contenu);
                    }
                });

        ajouterExpression("expression PLUS PLUS~"
                        + "expression MOINS MOINS",
                new Ast<Incrementer>() {
                    @Override
                    public Incrementer apply(List<Object> p) {
                        final byte signe;
                        if (((Token) p.get(1)).obtenirNom().equals("MOINS")) signe = -1;
                        else signe = 1;
                        return new Incrementer((Expression<?>) p.get(0), signe);
                    }
                });


        ajouterExpression("!expression MOINS expression",
                new Ast<UnaryOp>() {
                    @Override
                    public UnaryOp apply(List<Object> p) {
                        return new UnaryOp((Expression<?>) p.get(1), UnaryOp.Operation.NEGATION);
                    }
                });

        ajouterExpression("!expression PLUS expression",
                new Ast<UnaryOp>() {
                    @Override
                    public UnaryOp apply(List<Object> p) {
                        return new UnaryOp((Expression<?>) p.get(1), UnaryOp.Operation.PLUS);
                    }
                });


        ajouterExpression("expression MOD expression", new Ast<BinOp>() {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.MOD, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression POW expression", new Ast<BinOp>() {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.POW, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression MUL expression", new Ast<BinOp>() {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.MUL, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression DIV expression", new Ast<BinOp>() {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.DIV, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression DIV_ENTIERE expression", new Ast<BinOp>() {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.DIV_ENTIERE, (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression PLUS expression", new Ast<BinOp>() {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.PLUS, (Expression<?>) p.get(2));
            }
        });

        ajouterExpression("expression MOINS expression", new Ast<BinOp>() {
            @Override
            public BinOp apply(List<Object> p) {
                return new BinOp((Expression<?>) p.get(0), BinOp.Operation.MOINS, (Expression<?>) p.get(2));
            }
        });

        ajouterExpression("expression PIPE expression",
                new Ast<Expression<?>>() {
                    @Override
                    public Expression<?> apply(List<Object> p) {
                        if (!(p.get(0) instanceof ASType typeG && p.get(2) instanceof ASType typeD)) {
                            //String nom;
                            //if (p.get(0) instanceof Var) {
                            //    nom = ((Var) p.get(0)).getNom();
                            //} else if (p.get(2) instanceof Var) {
                            //    nom = ((Var) p.get(2)).getNom();
                            //} else {
                            //    nom = p.get(0) instanceof Type ? ((Expression<?>) p.get(2)).eval().toString() : ((Expression<?>) p.get(0)).eval().toString();
                            //}

                            return new BinOp((Expression<?>) p.get(0), BinOp.Operation.PIPE, (Expression<?>) p.get(2));

                            //throw new ErreurType("Le symbole | doit s\u00E9parer deux types valides " +
                            //        "('" + nom + "' n'est pas un type valide)");
                        }
                        typeG.union(typeD);
                        return typeG;
                    }
                });

        ajouterExpression("expression DANS expression~" +
                "expression PAS DANS expression", new Ast<BinComp>() {
            @Override
            public BinComp apply(List<Object> p) {
                return p.size() == 3 ?
                        new BinComp((Expression<?>) p.get(0), BinComp.Comparateur.DANS, (Expression<?>) p.get(2))
                        :
                        new BinComp((Expression<?>) p.get(0), BinComp.Comparateur.PAS_DANS, (Expression<?>) p.get(3));
            }
        });


        ajouterExpression("expression {comparaison} expression", new Ast<BinComp>() {
            @Override
            public BinComp apply(List<Object> p) {
                return new BinComp(
                        (Expression<?>) p.get(0),
                        BinComp.Comparateur.valueOf(((Token) p.get(1)).obtenirNom()),
                        (Expression<?>) p.get(2));
            }
        });


        ajouterExpression("expression {porte_logique} expression",
                new Ast<BoolOp>() {
                    @Override
                    public BoolOp apply(List<Object> p) {
                        return new BoolOp(
                                (Expression<?>) p.get(0),
                                BoolOp.Operateur.valueOf(((Token) p.get(1)).obtenirNom()),
                                (Expression<?>) p.get(2));
                    }
                });

        ajouterExpression("PAS expression",
                new Ast<BoolOp>() {
                    @Override
                    public BoolOp apply(List<Object> p) {
                        return new BoolOp((Expression<?>) p.get(1), BoolOp.Operateur.PAS, null);
                    }
                });

        ajouterExpression("expression SI expression SINON expression",
                new Ast<Ternary>() {
                    @Override
                    public Ternary apply(List<Object> p) {
                        return new Ternary((Expression<?>) p.get(2), (Expression<?>) p.get(0), (Expression<?>) p.get(4));
                    }
                });

        ajouterExpression("expression DEUX_POINTS expression",
                new Ast<Paire>() {
                    @Override
                    public Paire apply(List<Object> p) {
                        return new Paire((Expression<?>) p.get(0), (Expression<?>) p.get(2));
                    }
                });

        ajouterExpression("expression VIRGULE expression~",
                new Ast<CreerListe.Enumeration>() {
                    @Override
                    public CreerListe.Enumeration apply(List<Object> p) {
                        if (p.size() == 2) {
                            if (p.get(0) instanceof CreerListe.Enumeration enumeration)
                                return enumeration;
                            else
                                return new CreerListe.Enumeration((Expression<?>) p.get(0));
                        }

                        Expression<?> valeur = (Expression<?>) p.get(2);
                        if (p.get(2) instanceof CreerListe.Enumeration enumeration) {
                            valeur = enumeration.buildCreerListe();
                        }
                        if (p.get(0) instanceof CreerListe.Enumeration enumeration) {
                            enumeration.add(valeur);
                            return enumeration;
                        }

                        return new CreerListe.Enumeration((Expression<?>) p.get(0), valeur);
                    }
                });

        ajouterExpression("expression expression",
                new Ast<Expression<?>>() {
                    @Override
                    public Expression<?> apply(List<Object> p) {
                        Hashtable<String, Ast<?>> astParams = new Hashtable<>();

                        //astParams.put("expression DEUX_POINTS expression", new Ast<Argument>(8){
                        //    @Override
                        //    public Argument apply(List<Object> p) {
                        //        assert p.get(0) instanceof Var : "gauche assignement doit être Var (source: appelFonction dans ASAst)";
                        //
                        //        return new Argument((Var) p.get(0), (Expression<?>) p.get(2), null);
                        //    }
                        //});
                        Expression<?> contenu;
                        CreerListe args;
                        if (p.size() == 2 && !(p.get(1) instanceof Expression.ExpressionVide)) {
                            contenu = (Expression<?>) p.get(1);

                            args = contenu instanceof CreerListe.Enumeration enumeration ?
                                    enumeration.buildCreerListe() :
                                    new CreerListe(contenu);
                        } else {
                            args = new CreerListe();
                        }

                        return new AppelFonc((Expression<?>) p.get(0), args);
                    }
                });
        //setOrdreExpression();
    }
}

























