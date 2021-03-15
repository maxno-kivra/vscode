import { ExtensionContext } from 'vscode';
import * as client from './client';
import * as taskProvider from './taskProvider';


export async function activate(context: ExtensionContext) {
    client.activate(context)
    taskProvider.activate(context)
}

export async function deactivate(): Promise<void> {
    await client.deactivate()
    await taskProvider.deactivate()
}