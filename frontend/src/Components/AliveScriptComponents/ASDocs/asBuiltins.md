# Builtins AliveScript
&#x200B;  
&#x200B;  
#### Fonctions générales
&#x200B;  

-  ##### _aleatoire_

    -   retourne un membre choisi aléatoirement dans celui l'itérable passé en argument

        @param `choix`: [iterable][type_builtins]  
        @retourne -> [tout][type_builtins]

-   ##### *typeDe*

    -   retourne le nom du type de `element` passé en argument

        @param `element`: [tout][type_builtins]  
        @retourne -> [texte][type_builtins]

-------

#### Fonctions sur les listes  
&#x200B;  

-   ##### *joindre*

    -   join ensemble la liste d'éléments passé en argument en séparant chaque élément par le `separateur` passé en argument

        @param `lst`: [liste][type_builtins]  
        @param `separateur = " "`: [texte][type_builtins]  
        @retourne -> [texte][type_builtins]

-   ##### *inv*

    -   génère une nouvelle liste composée des éléments de la liste `lst` passé en argument à l'envers (le 1er échange de place avec le dernier, le 2e échange de place avec l'avant dernier, etc.)

        @param `lst`: [liste][type_builtins]  
        @retourne -> [liste][type_builtins]

-   ##### *map*

    -   génère une nouvelle liste où chaque élément est le résulat de l'application de la fonction passée en paramètre sur l'élément correspondant dans la liste initiale  
        ex: `map(typeDe, [1, "deux", vrai]) == [typeDe(1), typeDe("deux"), typeDe(vrai)]`

        @param `f`: [fonctionType][type_builtins]
        @param `lst`: [liste][type_builtins]
        @retourne -> [liste][type_builtins]

-   ##### *filtrer*

    -   génère une nouvelle liste composée de tous les éléments de la liste `lst` passée en paramètre où la fonction `f` passée en paramètre retourne `vrai`  
        ex: `filtrer(estNumerique, [1, "deux", 5]) == [1, 5]`

        @param: `f`: [fonctionType][type_builtins]
        @param: `lst`: [liste][type_builtins]
        @retourne -> [liste][type_builtins]

[type_builtins]: doc/
