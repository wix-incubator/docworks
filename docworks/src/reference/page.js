import escape from 'jsesc';

export default (service) => {
  const initialState = { service };
  const initialStateJSON = escape( // So safe!
    JSON.stringify(initialState),
    { wrap: true, isScriptContext: true, json: true }
  );
  return `
	<!doctype html>
	<html lang="utf-8">
		<head>
      <title>${service.name}</title>
      <link rel="stylesheet" href="/layout.css">
      <link rel="stylesheet" href="/text-styles.css">
			<script>
				window.initialState = ${initialStateJSON}
			</script>
		</head>
		<body>
        <div class="header">header</div>
        <div class="sidebar">sidebar</div>
        <div class="content"></div>
        <div class="footer">footer</div>
    </body>
	</html>
	`
};
