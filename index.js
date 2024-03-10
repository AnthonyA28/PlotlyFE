var filename = "output";
var traces = []
var inputer_traces = [];


const {ipcRenderer}       = require('electron');

function movingAverage(x, y, dx) {
    var newx = [x[0]];
    var newy = [y[0]];
    var i = 0;
    while (i < x.length - 1) {
        var j = i + 1;
        var sum_y = y[i + 1]; // Initialize sum_y with the next element of y
        while (j < x.length - 1 && x[j] - x[i] < dx) {
            sum_y += y[j + 1]; // Update sum_y with the next element of y
            j++;
        }
        var avg = sum_y / (j - i); // Calculate average
        i = j;
        newx.push(x[j]);
        newy.push(avg);
    }
    return [newx, newy];
}

var n_data_lim = 1000
function downSample(data){
  for(var i = 0; i< data.length; i +=1) {
    if(data[i].x.length > n_data_lim){
      console.log("Original  size: " , data[i].x.length)
      var scale_fac  = (data[i].x.length/n_data_lim)
      var dx = ((data[i].x[data[i].x.length-1]-data[i].x[0])/data[i].x.length)*scale_fac
      result = movingAverage(data[i].x, data[i].y, dx)
      data[i].x = result[0]
      data[i].y = result[1]    
      console.log("Downsampled size: " , data[i].x.length)
    }
  }
  return data
}

var log10 = function (y) {
  return Math.log(y) / Math.log(10);
}

var transpose = function (a) {
  var w = a.length || 0;
  var h = a[0] instanceof Array ? a[0].length : 0;
  if(h === 0 || w === 0) { return []; }
  var i, j, t = [];
  for(i=0; i<h; i++) {
    t[i] = [];
    for(j=0; j<w; j++) {
      t[i][j] = a[j][i];
    }
  }
  return t;
}

var removeOptions = function (selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}


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

  var palette = document.getElementById("palettes").options[document.getElementById("palettes").selectedIndex].innerText;
  if(palette.endsWith("_")){
    palette = document.getElementById("n_colors").value.concat("_").concat(palette);
    palette = palette.slice(0, -1);
    console.log(palette)
  }


    inputer_traces.push(new inputer(div.id, {
      name: {it: "text", def: "",},
      visible: {it: "option", options: ['true' , 'false' , "legendonly" ]},
      yaxis: {it: "option", options: ['y' , 'y2']},
      line: {
        width: {it: "number", def: default_line_width,},
        shape: {it: "option", options: ["spline", "linear", "hv", "vh", "hvh", "vhv"],},
        dash: {it: "option", options: ["solid", "dot", "dash", "longdash", "dashdot", "longdashdot"],},
        smoothing: {it: "number", def: 0,},
        color: {it: "option", options: colors_palettes[palette]},
      },
      mode: {it: "option", options: ['lines',"markers", 'text', 'none', 'lines+markers','lines+markers+text' ]},
      marker: {
        size: {it: "number", def: default_marker_size,},
        symbol: {it: "option", options: marker_shapes,},
        color: {it: "option", options: colors_palettes[palette]},
      },
      type: {it: "option", options: ["scattergl", 'bar']},
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





var inputer_master_trace = new inputer("appM", {
    type: {it: "option", options: ["scattergl", 'bar']},
    yaxis: {it: "option", options: ['y' , 'y2']},
    line: {
      width: {it: "number", def: default_line_width,},
      shape: {it: "option", options: ["spline", "linear", "hv", "vh", "hvh", "vhv"],},
      dash: {it: "option", options: ["solid", "dot", "dash", "longdash", "dashdot", "longdashdot"],},
      smoothing: {it: "number", def: 0,},
    },
    mode: {it: "option", options: [ 'lines+markers', 'lines',"markers", 'text', 'none', 'lines+markers+text' ]},
    marker: {
      size: {it: "number", def: default_marker_size,},
      symbol: {it: "option", options: marker_shapes,},
      // color: {it: "option", options: colors_palettes["pyDefault"]},
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

  var palette = document.getElementById("palettes").options[document.getElementById("palettes").selectedIndex].innerText;
  if(palette.endsWith("_")){
    palette = document.getElementById("n_colors").value.concat("_").concat(palette);
    palette = palette.slice(0, -1);
    console.log(palette)
  }


  for(var j = 0; j< datas.length; j +=1){
    if( j < traces.length){
      traces[j].x = datas[j][0]
      traces[j].y = datas[j][1]
    }else{

    var marker_shape = marker_shapes[j%marker_shapes.length];
    var line_shape = line_shapes[0];

    
  
    var color = colors_palettes[palette][j%colors_palettes[palette].length];
    


      var trace = {
          x: datas[j][0],
          y: datas[j][1],
          visible: true,
          name: headers[j],
          type: 'scattergl',
          mode: 'lines+markers',
          yaxis: "y",
          marker: {
              size: default_marker_size,
              symbol: marker_shape,
              color: color,
            },

        line: {
          shape: "spline",
          dash: line_shape,
          width: default_line_width,
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

  document.getElementById("palettes").dispatchEvent(new Event('change')); // Force the inputer_traces color options box to update color 


  traces = downSample(traces)
  Plotly.newPlot(document.getElementById('gd'), traces, inputer_layout.get_data(), {
      
      modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
      modeBarButtonsToAdd: [{
        name: 'To SVG',
        icon: Plotly.Icons.camera,
        click: function(gd) {
          // Plotly.downloadImage(gd, {format: 'svg'})
          save_plot("svg")
        }},{
        name: 'To PNG',
        icon: Plotly.Icons.camera,
        click: function(gd) {
          save_plot("png");
          // Plotly.downloadImage(gd, {format: 'png', scale:8})
        }
      }]
  },);
    
};



var inputer_layout = new inputer("app", OPT_inputer_layout , function(e){
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
      datapoints = transpose(datapoints)
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



  
  filename = filename.replace('.csv', '');
  filename = filename.replace('.json', '');
  filename = filename.replace('.J', '');
  filename = filename.replace('.svg', '');
  filename = filename.replace('.xlsx', '');
  console.log(filename)
  
  if( type == "png"){
    filename = filename
    Plotly.downloadImage(gd, {format: 'png', scale:8, filename})
    return;
  }
  if( type == "svg"){

  	// scattergl does not seem to save properly.... But it is FAST rendering!
    var plot = document.getElementById('gd');
    for (let i = 0; i < plot.data.length; i++) {
        if (plot.data[i].type === 'scattergl') {
            plot.data[i].type = 'scatter';
        }
    }
	 Plotly.redraw(plot);


    var svgContent = plot.querySelector('svg').cloneNode(true);

    var legend = plot.querySelector('.legend');
    if (legend) {
      svgContent.appendChild(legend.cloneNode(true));
    }

    var axesLabels = plot.querySelectorAll('.xtitle, .ytitle, .y2title');
    axesLabels.forEach(function (label) {
      svgContent.appendChild(label.cloneNode(true));
    });

    var json_text = get_template_text(true);

    var comment = document.createComment("layout=" + json_text + "endlayout");
    svgContent.appendChild(comment);

    var classesToRemove = ['nsewdrag', 'nwdrag', 'nedrag', 'swdrag', 'sedrag', 'ewdrag', 'wdrag', 'edrag', 'nsdrag', 'sdrag', 'ndrag'];
    classesToRemove.forEach(function(className) {
      var elementsToRemove = svgContent.querySelectorAll('.' + className);
      elementsToRemove.forEach(function(element) {
        element.remove();
      });
    });
    
    var svgData = new XMLSerializer().serializeToString(svgContent);
    // Replace all occurrences of vector-effect:non-scaling-stroke with an empty string
    //vector-effect:non-scaling-stroke
    svgData = svgData.replace(/vector-effect:\s*non-scaling-stroke;/g, '');

    var svgBlob = new Blob([svgData], { type: 'image/svg+xml' });

    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(svgBlob);
    downloadLink.download = filename + ".svg";

    const currentDate = new Date(); const year = currentDate.getFullYear(); const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); const day = currentDate.getDate().toString().padStart(2, '0'); const hour = currentDate.getHours().toString().padStart(2, '0'); const minute = currentDate.getMinutes().toString().padStart(2, '0');
    const currentDateTimeString = `${year}-${month}-${day}--${hour}-${minute}`;
    
    console.log(currentDateTimeString);

    const svgName = currentDateTimeString.concat("_").concat(filename).concat(".svg")
    ipcRenderer.send("archive_plot", [svgData, svgName]);
    var dropdown = document.getElementById("archive_dropdown");
    var opt = document.createElement("option");
    opt.text = svgName;
    dropdown.options.add(opt);  

    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);


    // Lets convert back to scattergl
    var plot = document.getElementById('gd');
    for (let i = 0; i < plot.data.length; i++) {
        if (plot.data[i].type == 'scatter') {
            plot.data[i].type = 'scattergl';
        }
    }
   Plotly.redraw(plot);



    // filename = filename
    // Plotly.downloadImage(gd, {format: 'png', scale:8, filename})

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

function import_svg(svg_text, update_data=true, update_trace_styles=true, update_trace_names = false, update_axes_labels=false, update_size_only=false){
    var splitStrings = svg_text.split("layout=");
    var layoutText = splitStrings[1].split("endlayout")[0]
    console.log(layoutText);
    import_json(layoutText, update_data, update_trace_styles, update_trace_names , update_axes_labels, update_size_only)
}

function import_json(json_text, update_data=true, update_trace_styles=true, update_trace_names = false, update_axes_labels=false, update_size_only=false){


  var prevLayout = inputer_layout.get_data();
  var json = JSON.parse(json_text);
  var l = json["layout"];


  if(update_size_only){
    update_data = false;
    update_trace_names = false;
    update_trace_styles = false;
    update_axes_labels = false;
  }


  if(!update_size_only){
    var elem = document.getElementById("palettes");
    var colors =[...elem.options].map(o => o.value)
    pal = json["palette"]
    if( pal.endsWith("_")){
      document.getElementById("n_colors").value = parseInt(pal.slice(0,1))
      pal = pal.slice(2)
      console.log(pal);
    }
    selectOption(elem, colors.indexOf(pal));
    pal = json["palette"]
    if( pal.endsWith("_")){
      pal = pal.slice(0, -1)
      console.log(pal);
    }

  }


    
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
  l.yaxis2.title.text  = decodeURIComponent(l.yaxis2.title.text);
  
  if(prev_data.length > 0 ){
    if( !update_axes_labels ){
      l.xaxis.title.text  = prevLayout.xaxis.title.text
      l.yaxis.title.text  = prevLayout.yaxis.title.text
    }
  }

  if(update_size_only){
    prevLayout.margin = l.margin
    prevLayout.width = l.width
    prevLayout.height = l.height
    inputer_layout.update_data(prevLayout);
  }else{
    inputer_layout.update_data(l);
  }

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
    
  }

  var la = inputer_layout.get_data()
  la.modebar = {}
  la.modebar.orientation = "v"

  Plotly.newPlot(document.getElementById('gd'), traces, la, {
    modeBarButtonsToRemove: ['toImage', 'sendDataToCloud' ],
    modeBarButtonsToAdd: [

    {
      name: 'To SVG',
      icon: Plotly.Icons.camera,
      click: function(gd) {
        save_plot("svg");
      }
    },{
      name: 'To png',
      icon: Plotly.Icons.camera,
      click: function(gd) {
        save_plot("png");
      }
    }] // END modeBarButtonsToAdd,
    },); // END 

    update();


    // Update the colors in the color options dropdowns by triggering palette changed 
    var event = new Event('change');
    document.getElementById("palettes").dispatchEvent(event);
  
}

function update(){

  set_y2_color();

  var plot = document.getElementById('gd');
  var xaxisRange = plot.layout.xaxis.range;
  var yaxisRange = plot.layout.yaxis.range;
  var y2axisRange = plot.layout.yaxis2.range;



  document.getElementById("gd_div").style.width = inputer_layout.get_data()['width'];
  for(var i = 0 ; i < traces.length; i ++){
      traces[i] = inputer_traces[i].fill_json(traces[i]);
      if(i < traces.length-1 && i % 2 == 0 ){
        if(document.getElementById("error_bars").checked){
        traces[i]["error_y"] = {
            type: 'data',
            array: traces[i+1].y,
            visible: true,
            thickness: traces[i].line.width,
            width: traces[i].line.width*2,
            color: traces[i].marker.color, 
          }
        // traces[i+1].dontupdate = true
        inputer_traces[i+1].inputs.visible.elem.selectedIndex = 1 
        traces[i+1].visible = false
          
      }else{
        traces[i]["error_y"] = {}
        inputer_traces[i+1].inputs.visible.elem.selectedIndex = 0
        traces[i+1].visible = true
      }
    }
    inputer_traces[i].update_data(traces[i]);
  }

  var l = inputer_layout.get_data();

  if(document.getElementById("ignore_zoom_check").checked){
    l.xaxis.range = xaxisRange
    l.yaxis.range = yaxisRange
    l.yaxis2.range = y2axisRange
  }


  Plotly.relayout(document.getElementById('gd'), l);

}

function get_template_text(curZoom=false){



  for(var i = 0 ; i < traces.length; i ++){
    traces[i].name = traces[i].name.replace(/\s/g,' ');
    traces[i].name = encodeURIComponent(traces[i].name)
  }
  
  var layout = inputer_layout.get_data();

  if(curZoom){
    var plot = document.getElementById('gd');
    layout.xaxis.range = plot.layout.xaxis.range;
    layout.yaxis.range = plot.layout.yaxis.range;

    layout.yaxis2.range = plot.layout.yaxis2.range;
  }

  layout.xaxis.title.text  = encodeURIComponent(layout.xaxis.title.text);
  layout.yaxis.title.text  = encodeURIComponent(layout.yaxis.title.text);
  layout.yaxis2.title.text  = encodeURIComponent(layout.yaxis2.title.text);


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






document.getElementById('helper_reset_markers').addEventListener( 'click', function(){
  console.log("helper_reset_markers")
  
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.marker.symbol.elem.selectedIndex = i%inputer_traces[i].inputs.marker.symbol.elem.options.length
  }
  update();
});


document.getElementById('helper_reset_colors').addEventListener( 'click', function(){
  console.log("helper_reset_colors")
  
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.marker.color.elem.selectedIndex = i%inputer_traces[i].inputs.marker.color.elem.options.length
    inputer_traces[i].inputs.line.color.elem.selectedIndex = i%inputer_traces[i].inputs.line.color.elem.options.length
  }
  update();
});

document.getElementById('helper_reset_linestyles').addEventListener( 'click', function(){
  console.log("helper_reset_linestyles")
  
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.line.dash.elem.selectedIndex = i%inputer_traces[i].inputs.line.dash.elem.options.length
  }
  update();
});


document.getElementById('helper_pair_colors').addEventListener( 'click', function(){
  console.log("helper_pair_colors")
  
  var j = 0;
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.marker.color.elem.selectedIndex = j
    inputer_traces[i].inputs.line.color.elem.selectedIndex = j
    i += 1
    if(i >= inputer_traces.length){
      break
    }
    inputer_traces[i].inputs.marker.color.elem.selectedIndex = j
    inputer_traces[i].inputs.line.color.elem.selectedIndex = j
    j+=1
  }
  update();
});

document.getElementById('helper_pair_markers').addEventListener( 'click', function(){
  console.log("helper_pair_markers")
  
  var j = 0;
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.marker.symbol.elem.selectedIndex = j;
    i += 1
    if(i >= inputer_traces.length){
      break
    }
    inputer_traces[i].inputs.marker.symbol.elem.selectedIndex = j+8;
    j += 1;
  }
  update();
});

document.getElementById('helper_pair_linestyles').addEventListener( 'click', function(){
  console.log("helper_pair_linestyles")
  
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.line.dash.elem.selectedIndex = 0;
    i += 1
    if(i >= inputer_traces.length){
      break
    }
    inputer_traces[i].inputs.line.dash.elem.selectedIndex = 1;
  }
  update();
});


document.getElementById('helper_set_y2_color').addEventListener( 'change',  function(){set_y2_color(); update();});
  

function set_y2_color(){
    if(document.getElementById('helper_set_y2_color').checked == false){
      return;
    }
    for(var i = 0; i < inputer_traces.length; i += 1 ){
    var axis = inputer_traces[i].inputs.yaxis.elem[inputer_traces[i].inputs.yaxis.elem.selectedIndex].text
    if(axis == "y2"){
      var color = inputer_traces[i].inputs.marker.color.elem[inputer_traces[i].inputs.marker.color.elem.selectedIndex].text
      var layout = inputer_layout.get_data();
      layout.yaxis2.tickcolor = color
      layout.yaxis2.linecolor = color
      layout.yaxis2.tickfont.color = color
      layout.yaxis2.title.font.color = color
      inputer_layout.update_data(layout);
    }
  }
}



document.getElementById("palettes").addEventListener("change", function (){
  console.log("Color Palette selected ")
  var index = document.getElementById("palettes").selectedIndex
  var color = document.getElementById("palettes").options[index].innerText
  if(color.endsWith("_")){
    var n_colors = document.getElementById("n_colors").value
    console.log("n_colors ", n_colors);
    if(n_colors>50){
      n_colors = 50;
    }
    else if(n_colors<2){
      n_colors = 2;
    }
    color = n_colors.toString().concat("_").concat(color.slice(0, color.length-1));
  }
  if( colors_palettes[color] == undefined ){
    return;
  }


  document.getElementById("error_bars").addEventListener('change', function() {
    update();
  });

  function set_color_options(inputer){ //todo
    var index_marker_color = inputer.inputs.marker.color.elem.selectedIndex;
    var index_line_color = inputer.inputs.line.color.elem.selectedIndex;
    inputer.inputs.marker.color.options=colors_palettes[color]
    inputer.inputs.line.color.options=colors_palettes[color]
    function replace_options(dropdown, new_index){
      removeOptions(dropdown);
      for(var j=0;j<colors_palettes[color].length;j++){
        var opt = document.createElement("option");
        opt.text = colors_palettes[color][j];
        opt.value = colors_palettes[color][j];
        opt.style.background = colors_palettes[color][j];
        dropdown.style.marginLeft = '15px'
        dropdown.options.add(opt);
      }
      selectOption(dropdown, new_index);
      dropdown.style.background = dropdown.options[dropdown.selectedIndex].text;  
    }
    replace_options(inputer.inputs.line.color.elem, index_line_color%colors_palettes[color].length)
    replace_options(inputer.inputs.marker.color.elem, index_marker_color%colors_palettes[color].length)
  }
      
  for(var i = 0 ; i < traces.length; i ++) {
    set_color_options(inputer_traces[i]);
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

	  if(name.endsWith(".svg")){
	    var reader = new FileReader();
	    reader.addEventListener('load', function (e) {
	      import_svg(e.target.result, true, true, true, true)
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
    data = transpose(data)
		plot(header, data, param[0]);
 });

function change_template(){
	console.log("Choosing template");
	var index = document.getElementById('template_dropdown').selectedIndex
	var template_name = document.getElementById('template_dropdown').options[index].innerText;
	console.log(template_name);
	ipcRenderer.send("get_template_from_name", template_name);
}

function plot_archived(){
  console.log("plotting archived");
  var index = document.getElementById('archive_dropdown').selectedIndex
  var plot_name = document.getElementById('archive_dropdown').options[index].innerText;
  console.log(plot_name);
  ipcRenderer.send("get_archiveplot_from_name", plot_name);
}

ipcRenderer.on("load_ArchivedPlots", function(event, arg){
  import_svg(arg, true, true, true, true)
});

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

	// Get the dropdown element
	var dropdown = document.getElementById("template_dropdown");

	// Loop through the options to find the index of the item with the title "default.json"
	for (var i = 0; i < dropdown.options.length; i++) {
	    if (dropdown.options[i].text === "default.json") {
	        // Set the selectedIndex to the index of the item with the title "default.json"
	        dropdown.selectedIndex = i;
	        break; // Exit the loop once found
	    }
	}

});


ipcRenderer.send("get_archived_plots");
ipcRenderer.on('available_plots', function(event, arg){
  console.log(event, arg);
  var dropdown = document.createElement("select");
  dropdown.id = 'archive_dropdown';
  var opt = document.createElement("option");

  for(var i=0;i<arg.length;i++){
    var opt = document.createElement("option");
    opt.text = arg[i];
    dropdown.options.add(opt);
  }
  dropdown.onchange =  plot_archived;
  document.getElementById("archive_div").appendChild(dropdown);
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
	console.log("Saved template");
	console.log(arg)
	opt.text = arg;
	dropdown.options.add(opt);  
});

document.getElementById('delete_template').addEventListener( 'click', function(){
		console.log("Delete template");
		var dropdown = document.getElementById("template_dropdown");
		template_name = dropdown.options[dropdown.selectedIndex].text;
		ipcRenderer.send("delete_template", template_name);
});
ipcRenderer.on("template_deleted", function(event, arg){
	console.log(event, arg);
	var dropdown = document.getElementById("template_dropdown");
    var selectedIndex = dropdown.selectedIndex;
    if (selectedIndex !== -1) {
        dropdown.remove(selectedIndex);
        if (dropdown.options.length > 0) {
            dropdown.selectedIndex = 0;
        }
    }
	console.log("Deleted template");

});







document.getElementById('open_templates').addEventListener( 'click', function(){
		console.log("open template");
		ipcRenderer.send("open_templates");	
});



document.getElementById("delete_template").addEventListener('click', function(){
  var selectedOption = dropdown.options[dropdown.selectedIndex];
  var selectedText = selectedOption.text;

  var name = "LocalStorage_" + selectedText;
  console.log("Deleting " + name)

  var item = localStorage.getItem(name);

  if (item !== null) {
    console.log('Item exists in localStorage');
    localStorage.removeItem(name);
    dropdown.options[dropdown.selectedIndex].remove();
  } else {
    console.log('Item does not exist in localStorage');
  }
});


document.getElementById('ignore_zoom_check').addEventListener('click', function(){
  update();
})


document.getElementById("n_colors").addEventListener('input', function(){
  document.getElementById("palettes").dispatchEvent(new Event('change'));
})

document.getElementById('helper_save_current_zoom').addEventListener('click', function(){
  
  var plot = document.getElementById('gd');
  var layout = inputer_layout.get_data();
  
  layout.xaxis.range = plot.layout.xaxis.range
  layout.yaxis.range = plot.layout.yaxis.range

  layout.yaxis2.range = plot.layout.yaxis2.range

  inputer_layout.update_data(layout);


  

 
})



document.getElementById('exportData').addEventListener('click', function() {

	var layout = inputer_layout.get_data();
	var x = layout.xaxis.title.text
	var y = layout.yaxis.title.text

	const separator = ','; // Change this to your desired separator
	const filename = 'exported_data';

	const rows = [];

	// Iterate over data points for each trace
	for (let i = 0; i < Math.max(...traces.map(trace => trace.x.length)); i++) {
	  const rowData = [];

	  for (const trace of traces) {
	    // Check if the current trace has data for the current index
	    if (i < trace.x.length) {
	      rowData.push(trace.x[i] || ''); // Insert 'x' data or an empty string if data is missing
	      rowData.push(trace.y[i] || ''); // Insert 'y' data or an empty string if data is missing
	    } else {
	      // If no data is available for the current index, insert empty strings
	      rowData.push('');
	      rowData.push('');
	    }

	    // Add an empty column after every trace in both header and data
	    rowData.push('');
	  }

	  rows.push(rowData.join(separator));
	}

	// Add an empty column in headers for every trace
	const header = traces.flatMap(trace => [`${x}`, `${y} (${trace.name})`, '']);

	// Create CSV content
	const csvContent = [header.join(separator), ...rows].join('\n');

	// Create a Blob containing the CSV data
	const blob = new Blob([csvContent], { type: 'text/csv' });

	// Create a download link
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = `${filename}.csv`;

	// Trigger the download
	document.body.appendChild(a);
	a.click();

	// Clean up
	URL.revokeObjectURL(url);
	document.body.removeChild(a);
});



