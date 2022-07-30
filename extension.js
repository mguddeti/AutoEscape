const vscode = require('vscode');
const editor = vscode.window.activeTextEditor;

function activate(context) {
	const copiedText = vscode.commands.registerCommand('escapestring.copiedtext', function () {escapeCopiedText()});
	const highlightedText = vscode.commands.registerCommand('escapestring.highlightedtext', function () {escapeHighlightedText()});
	context.subscriptions.push(copiedText, highlightedText);
}

async function escapeCopiedText() {
	const text = await vscode.env.clipboard.readText();
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
	if (text[0] == '"' && text[text.length - 1] == '"' || text[0] == '\''&& text[text.length - 1] == '\'') {
		const quote = text[0];
		text = text.slice(1, -1);
		text = text.replace(/"/g, '\\"');
		text = text.replace(/'/g, "\\'");
		text = `${quote}${text}${quote}`;
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
