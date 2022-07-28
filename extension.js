const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;

function activate(context) {
	let palette = vscode.commands.registerCommand('escapesquared.escapesquared', async function () {
		let picks = ["Escape Copied Text", "Escape Highlighted Text"];
		vscode.window.showQuickPick(picks, {}).then(function(s) {
			if (s == picks[0]) {escapeCopiedText()} else if (s == picks[1]) {escapeHighlightedText()}
		});
	});

	let copiedText = vscode.commands.registerCommand('escapesquared.copiedtext', function () {
		escapeCopiedText();
	});

	let highlightedText = vscode.commands.registerCommand('escapesquared.highlightedtext', function () {
		escapeHighlightedText();
	});

	context.subscriptions.push(palette, copiedText, highlightedText);
}

async function escapeCopiedText() {
	/* Probably not going to include this in the extension
	const selection = await vscode.window.showQuickPick(['zero', 'one', 'two', 'three', 'four', 'five'], {
		canPickMany: true
	});
	Object.keys(selection).map(key => {
		vscode.window.showInformationMessage(selection[key]);
	}); */
	let text = await vscode.env.clipboard.readText();
	editor.edit(editBuilder => {
		editBuilder.insert(editor.selection.active, escape(text));
	});
}
function escapeHighlightedText() {
	const selection = editor.selection;
	if (selection && !selection.isEmpty) {
		const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
		const highlighted = editor.document.getText(selectionRange);
		editor.edit(builder => {
			builder.replace(selection, escape(highlighted));
		});
	}
}

function escape(text) {
	text = text.replace(/\\/g, '\\\\');
	// Clean Up This Logic
	if (text[0] == '"' && text[text.length - 1] == '"') {
		text = text.slice(1, -1);
		text = text.replace(/"/g, '\\"');
		text = text.replace(/'/g, "\\'");
		text = `"${text}"`; // should be an option in settings to disable automatic quotes
		return text;
	} else if (text[0] == '\''&& text[text.length - 1] == '\'') {
		text = text.slice(1, -1);
		text = text.replace(/"/g, '\\"');
		text = text.replace(/'/g, "\\'");
		text = `'${text}'`;
		return text;
	}
	text = text.replace(/"/g, '\\"');
	text = text.replace(/'/g, "\\'");
	text = `"${text}"`;
	return text;
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
