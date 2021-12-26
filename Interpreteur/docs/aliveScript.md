## AliveScript

<small>[v1.2.0](#versioning)</small>  
<small>Auteur: Mathis Laroche</small>  
<br>

#### Commentaires

-   simple ligne: <code># _commentaire_</code>
-   multiligne:
    -   ouverture: `(:`
    -   fermeture: `:)`
    -   ex:
        `(:`  
        `salut je suis un commentaire`  
        `sur plusieurs`  
        `lignes`  
        `:)`
-   documentation:
    -   ouverture: `(-:`
    -   fermeture: `:-)`
    -   ex:
        ```
        (-:
         - Cette fonction additionne deux nombres et retourne le résultat
         - @param num1: le premier nombre
         - @param num2: le deuxième nombre
         - @retourne la somme deux deux nombres
        :-)
        fonction additionner(num1: nombre, num2: nombre) -> nombre
          retourner num1 + num2
        fin fonction
        ```

#### i/o

-   output:
    -   commande **_`afficher`_** : <code>afficher _valeur_</code>
-   input:
    -   commande **_`lire dans`_** : <code>lire dans _variable_</code>

#### Variables

-   Nom:
    -   commence par une lettre (toutes les lettres unicodes) ou `_`
    -   ensuite, autorise les lettres (toutes les lettres unicodes), les `.`, les `_` et les chiffres
    -   ex: `nom` `num1` `école` `e_12.ahn1` `additioner_deux_nombres` `test.num3`
-   [typage](#typage)

-   ##### Getter

    -   **LES CONSTANTES NE PEUVENT PAS AVOIR DE GETTER**
    -   **UNE VARIABLE NE PEUT PAS AVOIR PLUS D'UN GETTER**
    -   syntaxe:
        -   ouverture: <code>get _nom_</code>
        -   fermeture: `fin get`
    -   utilité:
        > fonction appelée lorsque l'on veut obtenir la valeur d'une variable (par exemple pour l'afficher)  
        La valeur retournée par le get est la valeur obtenu lorsqu'on veut obtenir la valeur de la variable
    -   type retour: _le type retourné d'un getter doit être le même que le type de la variable_
    -   ex:

        ```
        get abc
          retourner 3
        fin get

        var abc = 10

        afficher abc # 3
        ```

-   ##### Setter

    -   **LES CONSTANTES NE PEUVENT PAS AVOIR DE SETTER**
    -   **UNE VARIABLE NE PEUT PAS AVOIR PLUS D'UN SETTER**
    -   syntaxe:
        -   ouverture:
            -   typé: <code>set _nom_(_param_: _type_)</code>
            -   pas typé: <code>set _nom_(_param_)</code>
        -   fermeture: `fin set`
    -   utilité:
        > fonction appelée lorsque l'on assigne une valeur à la variable  
        La valeur retournée par le set est la valeur assignée à la variable  
        **Le setter n'est pas appliqué lors de la déclaration de la variable**
    -   type param: _le type du param est_ `tout` _s'il n'est pas précisé_
    -   type retour: _le type retourné d'un setter doit être le **même** que le type de la variable_
    -   ex:

        ```
        set abc(valeur)
          retourner valeur * 2
        fin get

        var abc = 10

        afficher abc # 20

        abc = 2

        afficher abc # 4
        ```

-   ##### Déclaration:

    -   variable:
        -   sans type: <code>var _variable_ = _valeur_</code>
        -   avec type: <code>var _variable_: _type_ = _valeur_</code>
    -   constante:
        -   sans type: <code>const _variable_ = _valeur_</code>
        -   avec type: <code>const _variable_: _type_ = _valeur_</code>

-   ##### Assignement:
    -   assignement variable: <code>_variable_ = _valeur_</code>
    -   assignement constante: <code>**ERREUR: IMPOSSIBLE DE RÉASSIGNER UNE CONSTANTE**</code>
    -   assignement variable avec opération arithmétique <code>_variable_ **[operation](#arithmétique)**= _valeur_</code>
        -   <code>_variable_ += _valeur_</code>
        -   <code>_variable_ -= _valeur_</code>
        -   <code>_variable_ *= *valeur\*</code>
        -   <code>_variable_ /= _valeur_</code>
        -   <code>_variable_ %= _valeur_</code>
        -   <code>_variable_ ^= _valeur_</code>
        -   <code>_variable_ //= _valeur_</code>
    -   incrément: <code>_variable_++</code>
    -   décrément: <code>_variable_--</code>

#### Arithmétique

-   addition: `+`
    -   nombre + nombre -> nombre
        -   ex: `2 + 2 = 4`
    -   liste + tout -> ajoute le deuxième terme à la fin de la liste
        -   ex: `[2, 3, 4] + "salut" = [2, 3, 4, "salut"]`
    -   texte + tout -> concationne le texte avec la représentation en texte du deuxième terme
        -   ex: `"salut " + vrai = "salut vrai"`
    -   (tout sauf liste) + texte -> concationne le texte avec la représentation en texte du premier terme
        -   ex: `12 + "hey" = "12hey"`
-   soustraction: `-`
    -   nombre - nombre -> nombre
        -   ex: `12 - 2 = 10`
    -   liste - tout -> retire tous les éléments de la liste qui sont égaux au deuxième terme
        -   ex: `[1, vrai, "bonjour"] - vrai = [1, "bonjour"]`
    -   texte - texte -> retire tous les sous-textes du premier terme matchant au deuxième terme
        -   ex: `"salut je suis Mathis" - "is" = "salut je su Math`
-   multiplication: `*`
    -   nombre \* nombre -> nombre
        -   ex: `4 * 12 = 48`
    -   texte \* entier -> répète le texte un nombre de fois égal au deuxième terme
        -   ex: `"salut " * 3 = "salut salut salut "`
    -   liste \* entier -> répète la liste un nombre de fois égal au deuxième terme
        -   ex: `[12, vrai, "h"] * 3 = [12, vrai, "h", 12, vrai, "h", 12, vrai, "h"]`
-   division: `/`
    -   nombre / nombre -> nombre
        -   ex: `25 / 2 = 12.5`
    -   liste / liste -> retire tous les éléments de la liste 1 présent dans la liste 2
        -   ex: `[1, 1, 2, vrai, faux, 4, 5, "foo"] / [vrai, 2, 4, 1] = [faux, 5, "foo"]`
-   division entière: `//`
    -   nombre // nombre -> entier
        -   ex: `25 / 2 = 12`
-   exposant: `^`
    -   nombre ^ nombre -> nombre
        -   ex: `3 ^ 4 = 81`
-   modulo: `%`
    -   entier % entier -> entier
        -   ex: `7 % 3 = 1`
-   pipe: `|`
    -   liste | liste -> créé une nouvelle liste composé des éléments des deux listes sans modifier les listes originales
        -   ex: `[1, 2, 3, vrai] | [3, faux, "salut"] = [1, 2, 3, vrai, 3, faux, "salut"]`

#### Comparaisons

-   égal: `==`
-   pas égal: `!=`
-   plus grand: `>`
-   plus petit: `<`
-   plus grand égal: `>=`
-   plus petit égal: `<=`

#### Opérateurs logiques

-   et:
    -   syntaxe: <code>_valeur1_ et _valeur2_</code>
    -   fonctionnement: retourne <code>_valeur1_</code> si <code>_valeur1_</code> est **faux**, sinon retourne <code>_valeur2_</code>
-   ou:
    -   syntaxe: <code>_valeur1_ ou _valeur2_</code>
    -   fonctionnement: retourne <code>_valeur1_</code> si <code>_valeur1_</code> est **vrai**, sinon retourne <code>_valeur2_</code>
-   pas:
    -   syntaxe: <code>pas _valeur_</code>
    -   fonctionnement: retourne la valeur booléenne **inverse** de <code>_valeur_</code>

#### Fonction

-   syntaxe:
    -   ouverture <code>fonction _nom_(_param1_, _param2_, _etc._)</code>
    -   fermeture: `fin fonction`
-   paramètres:
    -   [typage d'un paramètre paramètre](#Typage)
    -   paramètre par défaut: <code>fonction _nom_(_param1_ = _valeurParDefaut_)</code>
-   retourner:
    -   [typage de la valeur retournée par la fonction](#Typage)
    -   syntaxe: <code>retourner _valeur_</code>

#### Types

-   ##### Typage:
    -   variable ou paramètre: <code>_nom_: _type_</code>
    -   constante: <code>const _nom_: _type_</code>
    -   retour d'une fonction: <code>fonction _nom_() -> _type_</code>
-   ##### Types builtins:

    -   `tout`

    -   `booleen`: `vrai` **ET** `faux`

    -   `nombre`:

        -   `entier`: nombre entier entre **-2147483648** et **2147483647**
        -   `decimal`: nombre décimal de forme:
            -   <code>_entier_._entier_</code> **OU**
            -   <code>_entier_.</code> (sous-entend un 0 à la fin) **OU**
            -   <code>._entier_</code> (sous-entend un 0 au début)

    -   `iterable`:

        -   `texte`: <code>"_texte_"</code> **OU** <code>'_texte_'</code>
        -   `liste`: <code>[*valeur1*, *valeur2*, *etc.*]</code>

    -   `fonctionType` syntaxe: [fonction](#Fonction)
    -   `nulType` syntaxe: `nul`
    -   `rien` syntaxe: `rien`

-   ##### Transformation de type

    -   txt: texte -> nombre: `+txt` **OU** `--txt`
    -   txt: texte -> entier: `entier(txt)`
    -   txt: texte -> decimal: `decimal(txt)`

    -   txt: texte -> liste: `liste(txt)`

    -   element: tout -> texte: `"" + element` **OU** `texte(element)`
    -   element: tout -> booleen: `pas pas element` **OU** `booleen(element)`

#### Iterable (liste | texte)

-   ##### index:
    -   obtenir valeur à l'index: <code>_variable_\[_index_]</code>
    -   assigner valeur à l'index: <code>_variable_\[_index_] = _valeur_</code>
-   ##### ranges:
    -   obtenir valeurs dans le range: <code>_variable_\[_debut_:_fin_]</code>
    -   assigner valeurs dans le range: <code>_variable_\[_debut_:_fin_] = _valeurIterable_</code>
-   ##### suites:
    -   syntaxe: <code>[*debut* ... *fin*]</code> **OU** <code>[*debut* ... *fin* bond *valeurEntier*]</code>
    -   nombre
        -   ex:
            -   `[1 ... 7] == [1, 2, 3, 4, 5, 6, 7]`
            -   `[1 ... 7 bond 2] == [1, 3, 5, 7]`
    -   lettres
        -   ex:
            -   `['e' ... 'm'] == ['e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']`
            -   `['L' ... 'E' bond -1] == ["L", "K", "J", "I", "H", "G", "F", "E"]`
-   ##### opérateurs `dans` **ET** `pas dans`
    -   ex: <code>si _variable_ dans _valeurIterable_</code>
    -   ex: <code>si _variable_ pas dans _valeurIterable_</code>

#### Control flow

-   si: <code>si _condition_</code>
-   sinon si: <code>sinon si _condition_</code>
-   sinon: `sinon`
-   fermeture: `fin si`

#### Boucles

-   ##### types:

    -   repeter:

        -   ouverture: <code>repeter _valeurEntier_</code>
        -   fermeture: `fin repeter`

    -   tant que:

        -   ouverture: <code>tant que _condition_</code>
        -   fermeture: `fin tant que`

    -   faire ... tant que

        -   ouverture: `faire`
        -   fermeture: <code>tant que _condition_</code>

    -   pour
        -   ouverture:
            -   La variable itérée existe déjà:
                -   <code>pour _variable_ dans _valeurIterable_</code>
            -   La variable itérée n'existe pas:
                -   <code>pour var _variable_ dans _valeurIterable_</code>
            -   La variable itérée n'existe pas **ET** c'est une constante:
                -   <code>pour const _variable_ dans _valeurIterable_</code>
        -   fermeture: `fin pour`

-   ##### control flow
    -   `sortir` (break en java/python)
    -   `continuer` (continue en java/python)

#### Modules

-   syntaxe:
    -   utiliser le module au complet: <code>utiliser _nomModule_</code>
    -   utiliser seulement certaines fonctions/constantes du module: <code>utiliser _nomModule_ {_nomFonction1_, _nomConstante1_, _etc._}</code>
-   ##### Modules builtins:

    -   builtins (n'a pas besoin d'être `utiliser`, car il est utilisé par défaut):

        -   fonctions:

            -   ~~info~~

            -   [aleatoire(choix: iterable) -> tout](bultins.md/#aleatoire)
            -   [typeDe(element: tout) -> texte](bultins.md/#typeDe)

            -   [joindre(lst: liste, separateur: texte = " ") -> texte](bultins.md/#joindre)
            -   [inv(iter: iterable) -> iterable](bultins.md/#inv)
            -   [map(f: fonctionType, lst: liste) -> liste](bultins.md/#map)
            -   [filtrer(f: fonctionType, lst: liste) -> liste](bultins.md/#filtrer)
            -   [somme(lst: liste) -> nombre](bultins.md/#somme)
            -   [max(lst: liste) -> nombre](bultins.md/#max)
            -   [min(lst: liste) -> nombre](bultins.md/#min)
            -   [unir(lst1: liste, lst2: liste) -> liste](bultins.md/#unir)
            -   [tailleDe(iter: iterable) -> entier](bultins.md/#taillDe)

            -   [bin(nb: entier) -> texte](bultins.md/#bin)
            -   [maj(txt: texte) -> texte](bultins.md/#maj)
            -   [minus(txt: texte) -> texte](bultins.md/#minus)
            -   [estNumerique(txt: texte) -> booleen](bultins.md/#estNumerique)
            -   [format(txt: texte, valeurs: liste) -> texte](bultins.md/#format)
            -   [remplacer(txt: texte, pattern: texte, remplacement: texte) -> texte](bultins.md/#remplacer)
            -   [remplacerRe(txt: texte, pattern: texte, remplacement: texte) -> texte](bultins.md/#remplacerRe)
            -   [match(txt: texte, pattern: texte) -> booleen](bultins.md/#match)

            -   [liste(txt: texte) -> liste](bultins.md/#liste)
            -   [texte(element: tout) -> texte](bultins.md/#texte)
            -   [entier(txt: texte, base: entier = 10) -> entier](bultins.md/#entier)
            -   [nombre(txt: texte) -> nombre](bultins.md/#nombre)
            -   [decimal(txt: texte) -> decimal](bultins.md/#decimal)
            -   [booleen(element: tout) -> booleen](bultins.md/#booleen)
            -   [auto(txt: texte) -> tout](bultins.md/#auto)

        -   constantes:
            -   **AUCUNE**

    -   Math:
        -   fonctions:
            -   sin(x: nombre) -> decimal
            -   cos(x: nombre) -> decimal
            -   tan(x: nombre) -> decimal
            -   arrondir(n: nombre, nbSignificatifs: entier) -> nombre
            -   abs(x: nombre) -> nombre
        -   constantes:
            -   PI = 3.141592653589793
            -   E = 2.718281828459045

## Versioning

-   Définitions

    > _Majeur_:
    >
    > 1.  La nouvelle verison contient des changements incompatibles avec les anciennes versions _Majeur_ du langage
    > 2.  Déprécation de certaines fonctionnalités
    >
    > _Mineur_:
    >
    > 1. La nouvelle version est 100% backward compatible avec toutes les autres versions _Mineur_ à l'intérieur de la même version _Majeur_
    > 2. Les nouvelles fonctionnalités n'introduisent pas de problèmes de compatibilités
    >
    > _Bugfix_ (.bf):
    >
    > 1. Ne contient que des fix de bugs et aucune nouvelle fonctionnalité
    > 2. 100% backward compatible
    >
    > _Release Candidate_ (-rc):
    >
    > 1. Candidat pour le lancement d'une nouvelle verison mineur du langage
    >
    > _build_ :
    >
    > 1. numéro changeant chaque fois qu'il y a un commit dans le langage

    ***

-   v*Majeur*._Mineur_\[ ._bf_ | -rc._num_ | -_build_ ]  
     ex: `v1.2.3-45`  
     -> 1: Majeur  
     -> 2: Mineur  
     -> 3: bugfix  
     -> 45: build
