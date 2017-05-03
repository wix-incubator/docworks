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
			<link rel="stylesheet" href="/node_modules/todomvc-common/base.css">
			<link rel="stylesheet" href="/node_modules/todomvc-app-css/index.css">
			<script>
				window.initialState = ${initialStateJSON}
			</script>
		</head>
		<body>
			<section id="todoapp" class="todoapp">${html}</section>
			<script src="/static/bundle.js"></script>
			<footer class="info">
				<p>Double-click to edit a todo</p>
				<p>TodoMVC powered by React and <a href="http://github.com/mobxjs/mobx/">MobX</a>. Created by <a href="http://github.com/mweststrate/">mweststrate</a></p>
				<p>Based on the base React TodoMVC by <a href="http://github.com/petehunt/">petehunt</a></p>
				<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
			</footer>
		</body>
	</html>
	`
};
