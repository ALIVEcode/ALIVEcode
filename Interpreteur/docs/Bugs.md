# Bug Report AliveScript

Format:

> \[completion(❌=incomplet, ✔=résolu)] explication (personne l'ayant reportée ; date du report (JJ/MM/AAAA))

#### AliveScript

- \[✔] lorsqu'une variable est déclarée dans une fonction comme paramètre, elle n'est pas détectée comme déclarée par le compiler
- \[✔] le message d'erreur lorsqu'une variable n'est pas déclarée dans le compiler a des accents graves au lieu d'accents aiguës
- \[✔] les variables ne se transmettent pas dans les scopes inférieurs
- \[✔] dans un splice, le premier argument \(celui avant le : ) est ignoré
- \[✔] les getter ne marchent pas pour une raison obscure
- \[✔] la fonction builtin "nombre" est transformée en 'entier|decimal' (Mathis)
- \[❌] les commentaires multi-lignes et de documentation sont détectés même dans les string (Mathis)
- \[❌] index dans un dictionnaire retourne `nul` si la clef n'existe pas (devrait être une erreur)
- \[❌] impossible d'assigner en utilisant un index nested (`d[1][0] = 2` ou `doc['document']['logs'] += "salut"`)
- \[❌] impossible d'assigner si la clef est un texte (ex: `d['logs'] += "oh oh!"` -> erreur)

#### Server:

-   \[❌] s'il y a une erreur qui fait crash le thread durant l'exécution, ça retourne juste jamais rien (Enric ; 12/09/2021)
