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
			// <link rel="stylesheet" href="/node_modules/todomvc-common/base.css">
			// <link rel="stylesheet" href="/node_modules/todomvc-app-css/index.css">
			<script>
				window.initialState = ${initialStateJSON}
			</script>
		</head>
		<body>
			<section id="todoapp" class="todoapp">${html}</section>
			<script src="/static/api-bundle.js"></script>
		</body>
	</html>
	`
};
