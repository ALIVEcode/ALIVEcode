#!/bin/bash

if [ -d ./out/production/Interpreteur/interpreteur ]
then rm -r -f ./out/production/Interpreteur/interpreteur
fi
if [ -d ./out/production/ServerAS/server ]
then rm -r -f ./out/production/ServerAS/server
fi

javac -encoding UTF-8 -sourcepath ./src/ -d ./out/production/Interpreteur/ ./src/interpreteur/executeur/Executeur.java -cp ./lib/json-20140107.jar:./lib/snakeyaml-1.28.jar:./lib/annotations-19.0.0.jar:./lib/dotenv-java-2.2.0.jar
javac -encoding UTF-8 -sourcepath ./ServerAS/src/ -d ./out/production/ServerAS/ ./ServerAS/src/server/Server.java -cp ./lib/json-20140107.jar:./lib/snakeyaml-1.28.jar:./lib/annotations-19.0.0.jar:./lib/javax.websocket-api-1.1.jar:./out/production/Interpreteur/:./lib/dotenv-java-2.2.0.jar
if [ ! -d ./out/production/Interpreteur/interpreteur/regle_et_grammaire ]
then mkdir ./out/production/Interpreteur/interpreteur/regle_et_grammaire
fi
cp ./src/interpreteur/regle_et_grammaire/ASGrammaire.yaml ./out/production/Interpreteur/interpreteur/regle_et_grammaire/

