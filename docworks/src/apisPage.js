import escape from 'jsesc';

export default (todos, html) => {
    const initialState = { todos };
    const initialStateJSON = escape( // So safe!
        JSON.stringify(initialState),
        { wrap: true, isScriptContext: true, json: true }
    );
    return `
	<!doctype html>
	<html lang="utf-8">
		<head>
			<script>
				window.initialState = ${initialStateJSON}
			</script>
		</head>
		<body style="margin: 0;">
			<div id="app-container" style="height: 100vh;background-color: #F0F4F7">${html}</div>
			<script src="/static/api-bundle.js"></script>
		</body>
	</html>
	`
};
