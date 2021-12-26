package interpreteur.as.Objets;

import java.util.Stack;

public class ScopeManager {
    private final Stack<Scope> scopeStack = new Stack<>();
    private final Stack<Scope.ScopeInstance> scopeInstanceStack = new Stack<>();


    /**
     * Crée un nouveau scope puis le met comme <code>currentScope</code>
     *
     * @return the new scope
     */
    public Scope makeNewCurrentScope() {
        Scope scope = new Scope();
        updateCurrentScope(scope);
        return scope;
    }

    public Stack<Scope> getScopeStack() {
        return scopeStack;
    }

    public Scope getCurrentScope() {
        return scopeStack.peek();
    }

    public void updateCurrentScope(Scope scope) {
        scopeStack.push(scope);
    }

    public void popCurrentScope() {
        scopeStack.pop();
    }


    public Stack<Scope.ScopeInstance> getScopeInstanceStack() {
        return scopeInstanceStack;
    }

    public Scope.ScopeInstance getCurrentScopeInstance() {
        return scopeInstanceStack.peek();
    }

    public void pushCurrentScopeInstance(Scope.ScopeInstance scopeInstance) {
        scopeInstanceStack.push(scopeInstance);
    }

    public void popCurrentScopeInstance() {
        scopeInstanceStack.pop();
    }


    public void resetAllScope() {
        //Executeur.printCompiledCode(scopeStack.toString());
        //Executeur.printCompiledCode(scopeInstanceStack.toString());
        scopeInstanceStack.clear();
        scopeStack.clear();
    }

}
