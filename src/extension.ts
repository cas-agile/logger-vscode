// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import VScodeLogger from '../lib/VScode-logger.js';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let panel: vscode.WebviewPanel;
let panel_created = false;
let activeLogger = false;

/* Creating a webview panel and setting the html content of the webview. */
async function activate(context: vscode.ExtensionContext) {

	const ChartJS_PATH = vscode.Uri.file(
		path.join(context.extensionPath, 'node_modules', 'chart.js', 'dist', 'Chart.js')
	);

	await VScodeLogger.StartLogger();
	let disposable = vscode.commands.registerCommand('vscode-logger.logger', async () => {
		activeLogger = true;
		if (!panel_created) {
			panel = vscode.window.createWebviewPanel(
				'logger',
				'Logger',
				vscode.ViewColumn.Beside,
				{
					enableScripts: true,
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'node_modules'))]
				}
			);
		}
		panel_created = true;

		const ChartJS_URI = panel.webview.asWebviewUri(ChartJS_PATH);

		/* Setting the html content of the webview. 	*/
		
		let chartloader = ``;
		if (VScodeLogger.auth){
			chartloader= `window.onload = function() {
				
		
				const CtxLines = document.getElementById('LinesCanvas');
		
				let LinesChartConfig = this.createConfig("Lines", [${VScodeLogger.dashView.lines.inserted}, ${VScodeLogger.dashView.lines.deleted}, ${VScodeLogger.dashView.lines.modified}], ['Inserted', 'Deleted', 'Modified']);
		
				let LinesChart = new Chart(CtxLines, LinesChartConfig);
		
		
		
				const CtxComments = document.getElementById('CommentsCanvas');
		
				let CommentsChartConfig = this.createConfig("Comments", [${VScodeLogger.dashView.comments.inserted}, ${VScodeLogger.dashView.comments.deleted}], ['Inserted', 'Deleted']);
		
				let CommentsChart = new Chart(CtxComments, CommentsChartConfig);
		
		
		
				const CtxTests = document.getElementById('TestsCanvas');
		
				let TestsChartConfig = this.createConfig("Tests", [${VScodeLogger.dashView.tests.inserted}, ${VScodeLogger.dashView.tests.deleted}], ['Inserted', 'Deleted']);
		
				let TestsChart = new Chart(CtxTests, TestsChartConfig);
				
		
			}`;
		}

		if (activeLogger) panel.webview.html = getWebviewContent(ChartJS_URI, chartloader);
		
		setInterval(function(){ 
			if(activeLogger) {
				panel.webview.html = getWebviewContent(ChartJS_URI, chartloader);
			}
		}, 1000);
		
		panel.onDidDispose(function () {
			panel_created = false;
			activeLogger = false;
		});

	})
	context.subscriptions.push(disposable);
}


function getWebviewContent(ChartJS_URI: any, chartloader: any) {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>VScode-Logger</title>
	</head>

	<script src="${ChartJS_URI}"></script>

	<script>

	${chartloader}

	function createConfig(title, DataValue, LabelsValue) {

		var conf = {
		  type : 'doughnut',
		  data : {
			labels : LabelsValue,
			datasets : [{
			  data : DataValue,
			  backgroundColor : ['#2ecc71', '#c0392b', '#f1c40f' ]
			}]
		  },
		  options: {
			responsive: true,
			maintainAspectRatio: true,
			legend: {
			  labels: {
				fontColor: '#95a5a6',
			  },
			  position: 'left'
			},
			title: {
			  fontColor: '#95a5a6',
			  display: true,
			  text : title
			},
			animation: false
		  }
		}
		return conf;
	  }


	</script>

	<body>

	${VScodeLogger.doctype.window.document.body.innerHTML}
	
	<canvas id="LinesCanvas"></canvas>

	<canvas id="CommentsCanvas"></canvas>

	<canvas id="TestsCanvas"></canvas>

	</body>

	</html>`;
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}