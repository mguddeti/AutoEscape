const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;

function activate(context) {
	let disposable = vscode.commands.registerCommand('escapesquared.escapesquared', async function () {
		let text = await vscode.env.clipboard.readText()
		vscode.window.showQuickPick(["Escape Copied Text", "Escape Highlighted Text"], {}).then(function (selection) {
			if (selection === "Escape Copied Text") {escapeCopiedText(text)} else if (selection == "Escape Highlighted Text") {escapeHighlightedText()}
		});
	});
	context.subscriptions.push(disposable);
}

function escapeCopiedText(text) {
	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.insert(editor.selection.active, escape(text));
		});
	}
}
function escapeHighlightedText() {
	const selection = editor.selection;
	if (selection && !selection.isEmpty) {
		const firstSelectedCharacter = selection.start.character;
		const selectionRange = new vscode.Range(selection.start.line, firstSelectedCharacter, selection.end.line, selection.end.character);
		const highlighted = editor.document.getText(selectionRange);
		editor.edit(builder => {
			builder.replace(selection, escape(highlighted));
		});
	}
}

function escape(text) {
	text = text.replace(/\\/g, '\\\\');
	/*
	if ((text[0] != '"' && text[text.length - 1] != '"') && (text[0] != '\''&& text[text.length - 1] != '\'')) {
		text = `"${text}"` // should be an option in settings to disable automatic quotes
	} */
	return text;
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
