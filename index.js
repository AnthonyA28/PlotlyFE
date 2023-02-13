const inputer = require("./libs/inputer.js");
var tools = require("./libs/tools.js");
var options = require("./options.js");
const {ipcRenderer}       = require('electron');
const dialog = require('node-file-dialog')
		

var filename = "output";
// var layout = {}
var traces = []

var marker_shapes = options.marker_shapes;
console.log(marker_shapes)
var line_shapes = options.line_shapes;
var colors_palettes = options.colors_palettes;




var inputer_traces = [];
function make_trace_boxes(){
	inputer_traces = [];
	for(var j = 0; j< 50; j +=1){
		if( document.getElementById('app'+j.toString()) != null ){
			document.getElementById('app'+j.toString()).remove();
		}
	}
	for(var j = 0; j< traces.length; j +=1){
		var div = document.createElement('div');  //creating element
		div.id = "app" + j.toString();         //adding text on the element
		document.getElementById("data").appendChild(div);           //appending the element

		inputer_traces.push(new inputer(div.id, {
			name: {it: "text", def: "",},
			visible: {it: "option", options: ['true' , 'false' , "legendonly" ]},
			line: {
				width: {it: "number", def: 3,},
				shape: {it: "option", options: ["linear", "spline", "hv", "vh", "hvh", "vhv"],},
				dash: {it: "option", options: ["solid", "dot", "dash", "longdash", "dashdot", "longdashdot"],},
				smoothing: {it: "number", def: 0,},
				color: {it: "option", options: colors_palettes["pyDefault"]},
			},
			mode: {it: "option", options: ['lines',"markers", 'text', 'none', 'lines+markers','lines+markers+text' ]},
			marker: {
				size: {it: "number", def: 6,},
				symbol: {it: "option", options: marker_shapes,},
				color: {it: "option", options: colors_palettes["pyDefault"]},
			},
			type: {it: "option", options: ["scatter", 'bar']},
		},function(e){
				update();
				if(e.target.id == 'color'){
					var index = e.target.selectedIndex
					if(index >= 0){
						var color = e.target.options[index].text;
						e.target.style.background = color;  
					}
				}
		}));
	}
} 

function plot(header, data, update_nums=false){
	var index_header = 0;
	var datas = []
	var xs = [0]
	var i = 2;
	var ys = [1]
	var reset = false;
	for(var j = 2; j< header.length; j +=1){
		if( reset && (header[j] != "" )){
			xs.push(j);
			reset = false
			i+=1
		}else if( header[j] != "" ){
			ys.push(j);
			i += 1;
		} else if (header[j] == "" ){
			reset = true
		}
	}

	var index_undefined = 0;
	for(var j = 0; j< data.length; j +=1){
		index_undefined = data[j].length;
		if( data[j][data[j].length-1] == undefined || isNaN(data[j][data[j].length-1]) || data[j][data[j].length-1] ==''){
			for(var i =0 ; i < data[j].length; i ++){
				data[j][i] = parseFloat(data[j][i])
				if(data[j][i] == undefined || isNaN(data[j][i]) || ( data[j][i] != 0 && data[j][i] == '') ){
					index_undefined = i
					break;
				}
			}
		}
		data[j] = data[j].slice(0, index_undefined)
	}

	var headers = []
	i = 0;
	j = 0;
	var q = 0;
	while( i < xs.length-1 && q < 100){
		while(j < ys.length && q < 100 && xs[i+1]>ys[j]){
			datas.push([data[xs[i]], data[ys[j]]]);
			headers.push(header[ys[j]]);
			j += 1
		}
		q += 1
		i += 1
	}
	while(j < ys.length && q < 100){
		datas.push([data[xs[xs.length-1]], data[ys[j]]]);
		headers.push(header[ys[j]]);
		j += 1
		q+=1;
	}

	var base_index = 0
	if(!update_nums){
		traces = []
	}else{
		traces = traces.slice(0, datas.length);
	}
	for(var j = 0; j< datas.length; j +=1){
		if( j < traces.length){
			traces[j].x = datas[j][0]
			traces[j].y = datas[j][1]
		}else{

		var marker_shape = marker_shapes[j%marker_shapes.length];
		var line_shape = line_shapes[j%line_shapes.length];
		var color = colors_palettes['pyDefault'][j%colors_palettes['pyDefault'].length];
		
		var trace = {
				x: datas[j][0],
				y: datas[j][1],
				visible: true,
				name: headers[j],
				type: 'scatter',
				mode: 'lines',
				marker: {
						size: 5,
						symbol: marker_shape,
						color: color,
					},

			line: {
				shape: "spline",
				dash: line_shape,
				width: 3,
						color: color,
			},
		}
		traces.push(trace)
		}
	}

	make_trace_boxes();
	for(var i = 0; i < traces.length; i ++ ){
		inputer_traces[i].update_data(traces[i]);
	}
	document.getElementById("n_colors").value = traces.length

	if(!update_nums){
		var layout = inputer_layout.get_data();
		layout.xaxis.title.text = header[0];
		layout.yaxis.title.text = header[1];
		if(traces.length >1){
			layout.showlegend = true;
		}else{
			layout.showlegend = false;
		}
		inputer_layout.update_data(layout);
	}


	Plotly.newPlot(document.getElementById('gd'), traces, inputer_layout.get_data(), {
			modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d'],
			modeBarButtonsToAdd: [{
				name: 'to SVG',
				icon: Plotly.Icons.camera,
				click: function(gd) {
					// Plotly.downloadImage(gd, {format: 'svg'})
					save_plot("svg")
				}},{
				name: 'to png',
				icon: Plotly.Icons.camera,
				click: function(gd) {
					save_plot("png");
					// Plotly.downloadImage(gd, {format: 'png', scale:8})
				}
		 	}]
	},);
};



var inputer_master_trace = new inputer("appM", {
		type: {it: "option", options: ["scatter", 'bar']},
		line: {
			width: {it: "number", def: 3,},
			shape: {it: "option", options: ["linear", "spline", "hv", "vh", "hvh", "vhv"],},
			dash: {it: "option", options: ["solid", "dot", "dash", "longdash", "dashdot", "longdashdot"],},
			smoothing: {it: "number", def: 0,},
			// color: {it: "text", def: ""},
		},
		mode: {it: "option", options: [ 'lines',"markers", 'text', 'none', 'lines+markers','lines+markers+text' ]},
		marker: {
			size: {it: "number", def: 6,},
			symbol: {it: "option", options: marker_shapes,},
			// color: {it: "text", def: ""},
		},
	}, function(e){
	var caller = e.target || e.srcElement || window.event.target || window.event.srcElement;
	console.log("callback id: ", caller.id);
	var value = e.target.value
	var key = e.target.id
	console.log("parent",parent );
	for(var j = 0; j< traces.length; j +=1){
		if(e.target.parentElement.previousElementSibling.innerHTML == "Master Trace:"){
			traces[j][key] = value
		}else{
			var parent_key = e.target.parentElement.previousElementSibling.previousElementSibling.innerHTML;
			parent_key = parent_key.slice(0, parent_key.length-1);
			traces[j][parent_key][key] = value;
		}
		inputer_traces[j].update_data(traces[j]);
	}
	update();
});


var inputer_layout = new inputer("app", {
		showlegend: {it: 'boolean', 'def': true},
		legend: {
			bordercolor: {it: "text",def: '#444',},
			bgcolor: {it: "text", def:'rgba(0,0,0,0)'},
			xanchor: {it: "option", options: ["auto", "left", "center", "right"],},
			yanchor: {it: 'option', options: ["auto", "top", "middle", "bottom"],},
			// borderwidth: 0,
			// tracegroupgap: 5,
			x: {it: "number",def: 0.98,},
			y: {it: "number",def: 0.98,},
				margin:{
					autoexpand: {it: 'boolean', 'def': true},
					b: {it: "number",def: 50,},
					l: {it: "number",def: 50,},
					r: {it: "number",def: 100,},
					t: {it: "number",def: 50,},
					pad: {it: "number",def: 0,},
				},
				autosize: {it: "boolen", def:true},
			font: {
					family: {it: "text",def: 'Segoe UI',},
					size: {it: "number",def: 15,},
					color: {it: 'text', def:'#000000'},
			},
			itemwidth: {it: "number", def: 10},

		},

		xaxis: {
			title: {
				text: {it: "text",def: 'headerX',},
				standoff: {it: "number",def: 0,},
			},
			range: {
				it: "array", def:['',''],
			},
			// range:[xMinGlobal, xMaxGlobal],
			type: {it: 'option',options: ["linear", 'log']},
			zeroline: {it: 'boolean', 'def': false},
			dtick:  {it: "text",def: '',},
			tickformat: {it: "text",def: '',},
			exponentformat: {it: "option",options: ["none" , "e" , "E" , "power" , "SI" , "B"],},
			minor:{
				dtick:  {it: "text",def: '',},
				tickmode: {it: "text",def: 'auto',},
				ticks: {it: "text",def: "inside",},
				ticklen: {it: "number",def: 2,},
				tickwidth: {it: "number",def: 1,},
				tickcolor: {it: "text",def: "#000000",},

			},
			ticks: {it: "text",def: "inside",},
			ticklen: {it: "text",def: 5,},
			tickwidth: {it: "number",def: 1,},
			tickcolor: {it: "text",def: "#000000",},
			linecolor: {it: "text",def: "#000000",},
			mirror: {it: "text",def: "all",},
			showgrid: {it: 'boolean', 'def': false},
			tickfont: {
					family: {it: "text",def: 'Segoe UI',},
					size: {it: "number",def: 15,},
					color: {it: 'text', def:'#000000'},
			},
		},
		yaxis: {
			title: {
				text:{it: "text",def: 'headerY',},
				standoff: {it: "number",def: 0,},
			},
			range: {
				it: "array", def:['',''],
			},
			"type": {it: 'option',options: ["linear", 'log']},
			zeroline: {it: 'boolean', 'def': true},
			dtick: {it: "text",def: '',},
			tickformat: {it: "text",def: "",},
			exponentformat: {it: "option", options: ["none" , "e" , "E" , "power" , "SI" , "B"],},
			minor:{
				dtick: {it: "text",def: '',},
				tickmode: {it: "text",def: 'auto',},
				ticks: {it: "text",def: "inside",},
				ticklen: {it: "number",def: 2,},
				tickwidth: {it: "number",def: 1,},
				tickcolor: {it: "text",def: "#000000",},
			},
			// tickmode: '',
			ticks: {it: "text",def: "inside",},
			ticklen: {it: "number",def: 5,},
			tickwidth: {it: "number",def: 1,},
			tickcolor: {it: "text",def: "#000000",},
			linecolor: {it: "text",def: "#000000",},
			mirror: {it: "text",def: "all",},
			showgrid: {it: 'boolean', 'def': false},
			tickfont: {
					family: {it: "text",def: 'Segoe UI',},
					size: {it: "number",def: 15,},
					color: {it: 'text', def:'#000000'},
			},
		},
		margin:{
			b: {it: "number",def: 80,},
			l: {it: "number",def: 80,},
			r: {it: "number",def: 80,},
			t: {it: "number",def: 80,},
			pad: {it: "number",def: 0,},
		},
		font: {
				family: {it: "text",def: 'Segoe UI',},
				size: {it: "number",def: 15,},
				color: {it: 'text', def:'#000000'},
		},

		width: {it: "number",def: 350,},
		height: {it: "number",def: 350,},
		// paper_bgcolor: {it: "text",def:'rgba(0,0,0,0)',},
		// plot_bgcolor: {it: "text",def:'rgba(0,0,0,0)',},
}, function(e){
	update();
});


function input_csv(selectedFile) {
	Papa.parse(selectedFile, {
		dynamicTyping: false,
		complete: function(results) {
			header = results.data[0]
			datapoints = []

			for(var i = 1; i < results.data.length; i ++){
				row = []
				for(var j = 0; j< header.length; j +=1){
					x = parseFloat(results.data[i][j])
					row.push(x)
				}
				datapoints.push(row)
			}
			datapoints = tools.transpose(datapoints)
			var update_date = false;
			if( traces.length > 0){
				update_date = true;
			}
			plot(header, datapoints, update_date)
			update();
		}
	})
};



function save_plot(type){
	console.log(filename)
	if( type == "png"){
		Plotly.downloadImage(gd, {format: 'png', scale:8, filename})
		return;
	}
	if( type == "svg"){
		// const config={type:'save-file'}
		// dialog(config)
		//     .then(file => {
		//     	console.log(file[0])
		    	Plotly.downloadImage(gd, {
		    			// filename: file[0],
		    			format: 'svg',
		    		}).then(result => {
					console.log(result);
					console.log("Should save a template as well..");
				});
		    // })
		    // .catch(err => console.log(err))

		return
	}
}

function selectOption(elem, index, trigger=false){
	if (index == 0) { 
		elem.options.selectedIndex = index;
	}
	else {
		elem.options.selectedIndex = (index );
	}
	if ("createEvent" in document) {
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", false, true);
		if(trigger){
			elem.dispatchEvent(evt);
		}
	}
	else if(trigger) {
		elem.fireEvent("onchange");
	}
}

function import_json(json_text, update_data=true, update_trace_styles=true, update_trace_names = false, update_axes_labels=false){

	var prevLayout = inputer_layout.get_data();
	var json = JSON.parse(json_text)
	var l = json["layout"]
	
	var prev_data = []
	for(var i = 0 ; i < traces.length; i ++ ){
		var trace_data = {
			"x": traces[i]['x'],
			"y": traces[i]['y'],
			'name': traces[i]['name']
		}
		prev_data.push(trace_data);
	 	
	}
	var new_traces = json["traces"];
	for(var i = 0 ; i < new_traces.length &&  i < new_traces.length; i ++ ){
		new_traces[i]['name'] = decodeURIComponent(new_traces[i]['name'])
	}
	if(!update_data){
		for(var i = 0 ; i < prev_data.length && i < new_traces.length &&  i < traces.length; i ++ ){
			new_traces[i]['x'] = prev_data[i]['x']
			new_traces[i]['y'] = prev_data[i]['y']
			if( !update_trace_names ){   
				new_traces[i]['name'] = traces[i]['name']
			} 
		}
	}
	l.xaxis.title.text  = decodeURIComponent(l.xaxis.title.text);
	l.yaxis.title.text  = decodeURIComponent(l.yaxis.title.text);
	if(prev_data.length > 0 ){
		if( !update_axes_labels ){
			l.xaxis.title.text  = prevLayout.xaxis.title.text
			l.yaxis.title.text  = prevLayout.yaxis.title.text
		}
	}
	inputer_layout.update_data(l);

	if(update_data){
		traces = structuredClone(new_traces);
	}

	if( update_trace_styles || inputer_traces.length == 0 ){
		make_trace_boxes();
		for(var i = 0 ; i < inputer_traces.length && i < traces.length && i < new_traces.length; i ++){
			inputer_traces[i].update_data(new_traces[i]);
			inputer_traces[i].fill_json(traces[i]);
		}
		for(var i = new_traces.length; i < traces.length; i ++ ){
			inputer_traces[i].update_data(traces[i]);
			inputer_traces[i].fill_json(traces[i]);	
		}

		var pal = json["palette"]
		if( pal.endsWith("_")){
			pal = pal.slice(0,pal.length-1)
		}
		for(var i = 0 ; i < inputer_traces.length && i < new_traces.length; i ++) {
			var index = colors_palettes[pal].indexOf(new_traces[i].line.color);
			selectOption(inputer_traces[i].inputs.line.color.elem, index);
			index = colors_palettes[pal].indexOf(new_traces[i].marker.color);
			selectOption(inputer_traces[i].inputs.marker.color.elem, index);
		}
		for(var i = new_traces.length; i < inputer_traces.length; i ++ ){
			// var index = colors_palettes[pal].indexOf(traces[i].marker.color);
			selectOption(inputer_traces[i].inputs.marker.color.elem,i%colors_palettes[pal].length);
			// index = colors_palettes[pal].indexOf(new_traces[i].line.color);
			selectOption(inputer_traces[i].inputs.line.color.elem,i%colors_palettes[pal].length);
		}
		var elem = document.getElementById("palettes");
		var colors =[...elem.options].map(o => o.value)
		pal = json["palette"]
		if( pal.endsWith("_")){
			document.getElementById("n_colors").value = parseInt(pal.slice(0,1))
			pal = pal.slice(2)
		}
		selectOption(elem, colors.indexOf(pal));
	}

	Plotly.newPlot(document.getElementById('gd'), traces, inputer_layout.get_data(), {
		modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d'],
		modeBarButtonsToAdd: [
		{
			name: 'to SVG',
			icon: Plotly.Icons.camera,
			click: function(gd) {
				save_plot("svg");
			}
		},{
			name: 'to png',
			icon: Plotly.Icons.camera,
			click: function(gd) {
				save_plot("png");
			}
		}] // END modeBarButtonsToAdd
		},); // END Plotly.newPlot

		var elem = document.getElementById("palettes");
		var event = new Event('change');
		elem.dispatchEvent(event);
		update();
}

function update(){
	document.getElementById("gd_div").style.width = inputer_layout.get_data()['width'];
	for(var i = 0 ; i < traces.length; i ++){
		traces[i] = inputer_traces[i].fill_json(traces[i]);
		inputer_traces[i].update_data(traces[i]);
		// traces[i].name = to_mathjax(traces[i].name, "normalsize")
	}

	var l = inputer_layout.get_data();
	Plotly.relayout(document.getElementById('gd'), l)
}

 document.onkeypress = function (eventKeyName) {
		eventKeyName = eventKeyName || window.event;
		if(eventKeyName.keyCode==13 && eventKeyName.shiftKey){
			 console.log('You have pressed enter key');
			 update();
		}
};

function get_template_text(){

	for(var i = 0 ; i < traces.length; i ++){
		traces[i].name = traces[i].name.replace(/\s/g,' ');
		traces[i].name = encodeURIComponent(traces[i].name)
	}
	if ( !filename.endsWith(".json")){
		filename = filename.concat(".json")
	}

	var layout = inputer_layout.get_data();

	layout.xaxis.title.text  = encodeURIComponent(layout.xaxis.title.text);
	layout.yaxis.title.text  = encodeURIComponent(layout.yaxis.title.text);
	var index = document.getElementById("palettes").selectedIndex
	var palette = document.getElementById("palettes").options[index].innerText;
	if(palette.endsWith("_")){
		palette = document.getElementById("n_colors").value.concat("_").concat(palette);
	}

	var json = {layout, traces, palette}
	var text = JSON.stringify(json);

	for(var i = 0 ; i < traces.length; i ++){
		traces[i].name = decodeURIComponent(traces[i].name);
	}
	return text;
}

document.getElementById('download').addEventListener( 'click', function(){

		var output_file = filename;
		console.log(output_file);
		const element = document.createElement('a');
		var json_text = get_template_text();

		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json_text));
		element.setAttribute('download', output_file.concat(".json"));
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);

});


document.getElementById('open_templates').addEventListener( 'click', function(){
		console.log("open template");
		ipcRenderer.send("open_templates");	
});



document.getElementById('helper_pair_colors').addEventListener( 'click', function(){
	console.log("helper_pair_colors")
	
	var j = 0;
	for(var i = 0; i < inputer_traces.length; i += 2 ){
		inputer_traces[i].inputs.marker.color.elem.selectedIndex = j
		inputer_traces[i+1].inputs.marker.color.elem.selectedIndex = j
		inputer_traces[i].inputs.line.color.elem.selectedIndex = j
		inputer_traces[i+1].inputs.line.color.elem.selectedIndex = j
		j+=1
	}
	update();
});

document.getElementById('helper_pair_markers_co').addEventListener( 'click', function(){
	console.log("helper_pair_markers_co")
	
	var j = 0;
	for(var i = 0; i < inputer_traces.length; i += 2 ){
		inputer_traces[i].inputs.marker.symbol.elem.selectedIndex = j;
		inputer_traces[i+1].inputs.marker.symbol.elem.selectedIndex = j+8;
		inputer_traces[i].inputs.line.dash.elem.selectedIndex = 1;
		inputer_traces[i+1].inputs.line.dash.elem.selectedIndex = 0;
		j += 1;
	}
	update();
});




document.getElementById('save_template').addEventListener( 'click', function(){
		console.log("Save template");
		// var template = Plotly.makeTemplate(document.getElementById("gd"));
		var template = get_template_text();
		ipcRenderer.send("save_template", template);
	
});
ipcRenderer.on("template_saved", function(event, arg){
	console.log(event, arg);
	var dropdown = document.getElementById("template_dropdown");
	var opt = document.createElement("option");

	console.log("Saving template");
	console.log(arg)
	opt.text = arg;
	dropdown.options.add(opt);  
});



document.getElementById("palettes").addEventListener("change", function (){
	console.log("Color Palette selected ")
	var index = document.getElementById("palettes").selectedIndex
	var color = document.getElementById("palettes").options[index].innerText
	if(color.endsWith("_")){
		var n_colors = document.getElementById("n_colors").value
		console.log("n_colors ", n_colors);
		if(n_colors>12){
			n_colors = 12;
		}
		else if(n_colors<2){
			n_colors = 2;
		}
		color = n_colors.toString().concat("_").concat(color.slice(0, color.length-1));
	}
	if( colors_palettes[color] == undefined ){
		return;
	}
			
	for(var i = 0 ; i < traces.length; i ++) {
		var index_marker_color = inputer_traces[i].inputs.marker.color.elem.selectedIndex;
		var index_line_color = inputer_traces[i].inputs.line.color.elem.selectedIndex;
		inputer_traces[i].inputs.marker.color.options=colors_palettes[color]
		inputer_traces[i].inputs.line.color.options=colors_palettes[color]
		var dropdown = inputer_traces[i].inputs.marker.color.elem;
		tools.removeOptions(dropdown);
		for(var j=0;j<colors_palettes[color].length;j++){
			var opt = document.createElement("option");
			opt.text = colors_palettes[color][j];
			opt.value = colors_palettes[color][j];
			opt.style.background = colors_palettes[color][j];
			dropdown.style.marginLeft = '15px'
			dropdown.options.add(opt);
		}
		selectOption(dropdown, index_marker_color%colors_palettes[color].length);
		dropdown = inputer_traces[i].inputs.line.color.elem;
		tools.removeOptions(dropdown);
		for(var j=0;j<colors_palettes[color].length;j++){
			var opt = document.createElement("option");
			opt.text = colors_palettes[color][j];
			opt.value = colors_palettes[color][j];
			opt.style.background = colors_palettes[color][j];
			dropdown.style.marginLeft = '15px'
			dropdown.options.add(opt);
		}
		selectOption(dropdown, index_line_color%colors_palettes[color].length, true);
	}
	update();
});


var input = document.getElementById('input_file')
input.addEventListener("change", function (){
	if (!this.files && !this.files[0]) {
		return;
	}
	console.log("Inputting file")
	console.log(this.files[0]);
	filename = this.files[0].name
	load_file(this.files[0])
});


function load_file(file){
	var name = file.path;
	if(name.endsWith(".json")){
			var reader = new FileReader();
			reader.addEventListener('load', function (e) {
				import_json(e.target.result, true, true, true, true)
			});reader.readAsBinaryString(file);
	}
	console.log("loading file");
	ipcRenderer.send("load_file", name);

}

ipcRenderer.on('load_file-task-finished', function(event,param) {
		console.log("Data:")                            
		var update = param[0];
		var header = param[1][0];
		var data = param[1].slice(1, param[1].length);
		plot(header, tools.transpose(data), param[0]);
 });

function change_template(){
	console.log("Choosing template");
	var index = document.getElementById('template_dropdown').selectedIndex
	var template_name = document.getElementById('template_dropdown').options[index].innerText;
	console.log(template_name);
	ipcRenderer.send("get_template_from_name", template_name);
}

ipcRenderer.on("load_templ", function(event, arg){
	var update_trace_styles = document.getElementById("update_trace_styles_check").checked;
	var update_trace_names = document.getElementById("update_trace_names_check").checked;
	var update_axes_labels = document.getElementById("update_axes_labels_check").checked;
	import_json(arg, false, update_trace_styles, update_trace_names, update_axes_labels);
});

ipcRenderer.send("get_templates");
ipcRenderer.on('available_templates', function(event, arg){
	console.log(event, arg);
	var dropdown = document.createElement("select");
	dropdown.id = 'template_dropdown';
	var opt = document.createElement("option");

	for(var i=0;i<arg.length;i++){
		var opt = document.createElement("option");
		opt.text = arg[i];
		dropdown.options.add(opt);
	}
	dropdown.onchange =  change_template;
	document.getElementById("template_div").appendChild(dropdown);
});


