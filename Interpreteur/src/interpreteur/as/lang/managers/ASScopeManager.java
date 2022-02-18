package interpreteur.as.lang.managers;

import interpreteur.as.lang.ASScope;

import java.util.Stack;

public class ASScopeManager {
    private final Stack<ASScope> scopeStack = new Stack<>();
    private final Stack<ASScope.ScopeInstance> scopeInstanceStack = new Stack<>();


    /**
     * Crée un nouveau scope puis le met comme <code>currentScope</code>
     *
     * @return the new scope
     */
    public ASScope makeNewCurrentScope() {
        ASScope scope = new ASScope();
        updateCurrentScope(scope);
        return scope;
    }

    public Stack<ASScope> getScopeStack() {
        return scopeStack;
    }

    public ASScope getCurrentScope() {
        return scopeStack.peek();
    }

    public void updateCurrentScope(ASScope scope) {
        scopeStack.push(scope);
    }

    public void popCurrentScope() {
        scopeStack.pop();
    }


    public Stack<ASScope.ScopeInstance> getScopeInstanceStack() {
        return scopeInstanceStack;
    }

    public ASScope.ScopeInstance getCurrentScopeInstance() {
        return scopeInstanceStack.peek();
    }

    public void pushCurrentScopeInstance(ASScope.ScopeInstance scopeInstance) {
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
