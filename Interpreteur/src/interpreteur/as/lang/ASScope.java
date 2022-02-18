package interpreteur.as.lang;

import java.util.Stack;

public class ASScope {
    // static fields
    private final static Stack<ASScope> scopeStack = new Stack<>();
    private final static Stack<ScopeInstance> scopeInstanceStack = new Stack<>();

    // non static fields
    private ScopeInstance parent;
    private final Stack<ASVariable> variablesDeclarees = new Stack<>();

    public ASScope() {
        this.parent = null;
    }

    public ASScope(ASScope fromScope) {
        this.parent = null;
        this.variablesDeclarees.addAll(fromScope.cloneVariablesDeclarees());
    }

    public ASScope(ScopeInstance parent) {
        this.parent = parent;
    }

    public void setParent(ScopeInstance parent) {
        this.parent = parent;
    }

    //#region --------- static stuff ---------

    /**
     * Crée un nouveau scope puis le met comme <code>currentScope</code>
     *
     * @return the new scope
     */
    public static ASScope makeNewCurrentScope() {
        ASScope scope = new ASScope();
        updateCurrentScope(scope);
        return scope;
    }

    public static Stack<ASScope> getScopeStack() {
        return scopeStack;
    }

    public static ASScope getCurrentScope() {
        return scopeStack.peek();
    }

    public static void updateCurrentScope(ASScope scope) {
        scopeStack.push(scope);
    }

    public static void popCurrentScope() {
        scopeStack.pop();
    }


    public static Stack<ScopeInstance> getScopeInstanceStack() {
        return scopeInstanceStack;
    }

    public static ScopeInstance getCurrentScopeInstance() {
        return scopeInstanceStack.peek();
    }

    public static void pushCurrentScopeInstance(ScopeInstance scopeInstance) {
        scopeInstanceStack.push(scopeInstance);
    }

    public static void popCurrentScopeInstance() {
        scopeInstanceStack.pop();
    }


    public static void resetAllScope() {
        //Executeur.printCompiledCode(scopeStack.toString());
        //Executeur.printCompiledCode(scopeInstanceStack.toString());
        scopeInstanceStack.clear();
        scopeStack.clear();
    }

    //#endregion


    //#region --------- not static stuff ---------

    private Stack<ASVariable> cloneVariablesDeclarees() {
        Stack<ASVariable> newVariableStack = new Stack<>();
        variablesDeclarees.forEach(var -> newVariableStack.push(var.clone()));
        return newVariableStack;
    }

    public Stack<ASVariable> getVariablesDeclarees() {
        return variablesDeclarees;
    }

    public ScopeInstance makeScopeInstance(ScopeInstance parent) {
        return new ScopeInstance(parent, cloneVariablesDeclarees());
    }

    public ScopeInstance makeScopeInstanceFromCurrentScope() {
        return new ScopeInstance(getCurrentScopeInstance(), cloneVariablesDeclarees());
    }

    public ScopeInstance makeScopeInstanceFromScopeParent() {
        return new ScopeInstance(parent, cloneVariablesDeclarees());
    }

    /**
     * Cette fonction devrait être appelée <b>SEULEMENT</b> au compile time
     *
     * @param variable la variable qui est déclarée
     */
    public void declarerVariable(ASVariable variable) {
        variablesDeclarees.push(variable);
    }

    public ASVariable getVariable(String nom) {
        return variablesDeclarees.stream()
                .filter(var -> var.obtenirNom().equals(nom))
                .findFirst()
                .orElse(null);
    }

    @Override
    public String toString() {
        return "Scope{" +
                "variablesDeclarees=" + variablesDeclarees +
                '}';
    }

    //#endregion


    //#region --------- ScopeInstance ---------

    public static class ScopeInstance {
        private final ScopeInstance parent;
        private final Stack<ASVariable> variableStack;

        private ScopeInstance(ScopeInstance parent, Stack<ASVariable> variableStack) {
            this.parent = parent;
            this.variableStack = variableStack;
        }

        public ScopeInstance getParent() {
            return parent;
        }

        public Stack<ASVariable> getVariableStack() {
            return variableStack;
        }

        public ASVariable getVariable(String nom) {
            return variableStack.stream()
                    .filter(var -> var.obtenirNom().equals(nom))
                    .findFirst()
                    .orElse(parent == null ? null : parent.getVariable(nom));
        }

        public ASVariable getVariable(ASVariable variable) {
            return variableStack.stream()
                    .filter(var -> var.equals(variable))
                    .findFirst()
                    .orElse(parent == null ? null : parent.getVariable(variable));
        }

        @Override
        public String toString() {
            return "ScopeInstance{" +
                    "variableStack=" + variableStack +
                    ", parent=" + parent +
                    '}';
        }
    }

    //#endregion

}

























