import {
    CancellationToken, ExtensionContext, Task,
    TaskDefinition, TaskProvider, tasks, workspace
} from 'vscode';

let taskProvider: Rebar3TaskProvider;

export function activate(context: ExtensionContext) {
    if (!workspace.workspaceFolders) return undefined

    taskProvider = new Rebar3TaskProvider(context)
    let disposable = tasks.registerTaskProvider(
        Rebar3TaskProvider.Rebar3Type,
        taskProvider
    );
    context.subscriptions.push(disposable)
}

export function deactivate(): void {
}

interface Rebar3TaskDefinition extends TaskDefinition {
    task: string;
    profile?: string
}

class Rebar3TaskProvider implements TaskProvider<Task> {
    static Rebar3Type = 'rebar3';
    private cachedTasks: Thenable<Task[]> = undefined

    constructor(context: ExtensionContext) {
        const invalidateCache = () => this.cachedTasks = undefined;

        let watcher = workspace.createFileSystemWatcher("**/rebar.config");
        watcher.onDidChange(invalidateCache)
        watcher.onDidCreate(invalidateCache)
        watcher.onDidDelete(invalidateCache)
        context.subscriptions.push(watcher)

        let workspaceWatcher = workspace.onDidChangeWorkspaceFolders(invalidateCache);
        context.subscriptions.push(workspaceWatcher);
    }

    public async provideTasks(token: CancellationToken): Promise<Task[]> {
        if (!this.cachedTasks) {
            this.cachedTasks = this.findRebar3Tasks()
        }

        return this.cachedTasks
    }

    public async resolveTask(task: Task, token: CancellationToken): Promise<Task | undefined> {
        return
    }

    private async findRebar3Tasks() {
        return []
    }
}