var OPT_inputer_layout = {
    showlegend: {it: 'boolean', 'def': true},
    legend: {
      bordercolor: {it: "text",def: '#444',},
      bgcolor: {it: "text", def:'#FFFFFF'},
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
          // pad: {it: "number",def: 0,},
        },
        autosize: {it: "boolen", def:true},
      // font: {
      //     family: {it: "text",def: 'Segoe UI',},
      //     size: {it: "number",def: 10,},
      //     color: {it: 'text', def:'#000000'},
      // },
      itemwidth: {it: "number", def: 10},

    },

    xaxis: 
{      title: {
        text: {it: "text",def: 'headerX',},
        standoff: {it: "number",def: 0,},
      },
      range: {
        it: "array", def:['',''],
      },
      type: {it: 'option',options: ["linear", 'log']},
      zeroline: {it: 'boolean', 'def': false},
      dtick:  {it: "text",def: '',},
      // tickformat: {it: "text",def: '',}, // https://github.com/d3/d3-format/blob/main/README.md#locale_format
      exponentformat: {it: "option",options: ["power", "none" , "e" , "E" , "SI" , "B"],},
      ticks: {it: "option",options: ["inside", "outside", ""],},
      ticklen: {it: "text",def: 5,},
      // tickwidth: {it: "number",def: 1,},
      tickcolor: {it: "text",def: "#000000",},
      // tickprefix: {it: "text", def: ""},
      // ticksuffix: {it: "text", def: ""},
      linecolor: {it: "text",def: "#000000",},
      mirror: {it: "option",options: ["false", "ticks","true" ],},
      showgrid: {it: 'boolean', 'def': false},
      // tickfont: {
      //     family: {it: "text",def: 'Segoe UI',},
      //     size: {it: "number",def: 10,},
      //     color: {it: 'text', def:'#000000'},
      // },
      minor:{
        dtick:  {it: "text",def: '',},
        // tickmode: {it: "text",def: 'auto',},
        ticks: {it: "option",options: ["inside", "outside", ""],},
        ticklen: {it: "number",def: 2,},
        // tickwidth: {it: "number",def: 1,},
        tickcolor: {it: "text",def: "#000000",},
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
      tickformat: {it: "text",def: "",}, // https://github.com/d3/d3-format/blob/main/README.md#locale_format
      exponentformat: {it: "option", options: ["power", "none" , "e" , "E" , "SI" , "B"],},
      tickmode: '',
      ticks: {it: "option",options: ["inside", "outside", ""],},
      ticklen: {it: "number",def: 5,},
      // tickwidth: {it: "number",def: 1,},
      tickcolor: {it: "text",def: "#000000",},
      // tickprefix: {it: "text", def: ""},
      // ticksuffix: {it: "text", def: ""},
      linecolor: {it: "text",def: "#000000",},
      mirror: {it: "option",options: ["false", "ticks","true" ],},
      showgrid: {it: 'boolean', 'def': false},
      // tickfont: {
      //     family: {it: "text",def: 'Segoe UI',},
      //     size: {it: "number",def: 10,},
      //     color: {it: 'text', def:'#000000'},
      // },
      minor:{
        dtick: {it: "text",def: '',},
        tickmode: {it: "text",def: 'auto',},
        ticks: {it: "option",options: ["inside", "outside", ""],},
        ticklen: {it: "number",def: 2,},
        // tickwidth: {it: "number",def: 1,},
        tickcolor: {it: "text",def: "#000000",},
      },
    },
    margin:{
      b: {it: "number",def: 80,},
      l: {it: "number",def: 35,},
      r: {it: "number",def: 5,},
      t: {it: "number",def: 80,},
      // pad: {it: "number",def: 0,},
    },
    font: {
        family: {it: "text",def: 'Segoe UI',},
        size: {it: "number",def: 10,},
        color: {it: 'text', def:'#000000'},
    },

    width: {it: "number",def: 313,},
    height: {it: "number",def: 313,},
    // paper_bgcolor: {it: "text",def:'#FFFFFF',},
    // plot_bgcolor: {it: "text",def:'#FFFFFF',},
}


var marker_shapes = [
    "circle",
    "square",
    "diamond",
    "triangle-up",
    "cross" ,
    "triangle-down",
    "triangle-left",
    "triangle-right",
    "circle-open",
    "square-open",
    "diamond-open",
    "triangle-up-open",
    "cross-open" ,
    "triangle-down-open",
    "triangle-left-open",
    "triangle-right-open" 
 ]

var line_shapes = ["solid", "dot", "dash", "longdashdot", "dashdot", "longdash" ]

var colors_palettes = {
  "pyDefault": ["#0000ff","#00ff00","#ff0000","#00ffff","#ff00ff","#ffff00", "#000000", "#0000aa","#00aa00","#aa0000","#00aaaa","#aa00aa","#aaaa00"],
  "UTcolors":["#f8971f" ,"#ffd600","#a6cd57","#579d42","#00a9b7","#005f86","#9cadb7","#d6d2c4","#333f48"],
  "Accent" : ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666', '#7fc97f', '#beaed4', '#fdc086', '#ffff99'],
  "Paired" : ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
  "Dark2" : ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666', '#1b9e77', '#d95f02', '#7570b3', '#e7298a'],
  "Pastel1" : ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2', '#fbb4ae', '#b3cde3', '#ccebc5'],
  "Pastel2" : ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc', '#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4'],
  "Set1" : ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#e41a1c', '#377eb8', '#4daf4a'],
  "Set2" : ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3', '#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3'],
  "Set3" : ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
  "tab10" : ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#1f77b4', '#ff7f0e'],
  "tab20" : ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94'],
  "tab20b" : ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94'],
  "tab20c" : ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0'],
  "2_viridis" :['#31688e', '#35b779'],
  "2_viridis_r" :['#35b779', '#31688e'],
  "2_magma" :['#721f81', '#f1605d'],
  "2_magma_r" :['#f1605d', '#721f81'],
  "2_plasma" :['#9c179e', '#ed7953'],
  "2_plasma_r" :['#ed7953', '#9c179e'],
  "2_cividis" :['#575d6d', '#a59c74'],
  "2_cividis_r" :['#a59c74', '#575d6d'],
  "2_mako" :['#40498e', '#38aaac'],
  "2_mako_r" :['#38aaac', '#40498e'],
  "2_rocket" :['#841e5a', '#f06043'],
  "2_rocket_r" :['#f06043', '#841e5a'],
  "2_inferno" :['#781c6d', '#ed6925'],
  "2_inferno_r" :['#ed6925', '#781c6d'],
  "3_viridis" :['#3b528b', '#21918c', '#5ec962'],
  "3_viridis_r" :['#5cc863', '#21908d', '#3b518b'],
  "3_magma" :['#51127c', '#b73779', '#fc8961'],
  "3_magma_r" :['#fb8761', '#b5367a', '#4f127b'],
  "3_plasma" :['#7e03a8', '#cc4778', '#f89540'],
  "3_plasma_r" :['#f89441', '#cb4679', '#7d03a8'],
  "3_cividis" :['#434e6c', '#7d7c78', '#bcae6c'],
  "3_cividis_r" :['#bbad6d', '#7c7b78', '#424e6c'],
  "3_mako" :['#3e356b', '#357ba3', '#4bc2ad'],
  "3_mako_r" :['#49c1ad', '#357aa2', '#3e3469'],
  "3_rocket" :['#611f53', '#cb1b4f', '#f58860'],
  "3_rocket_r" :['#f4865e', '#ca1a50', '#601f52'],
  "3_inferno" :['#57106e', '#bc3754', '#f98e09'],
  "3_inferno_r" :['#f98c0a', '#ba3655', '#550f6d'],
  "4_viridis" :['#414487', '#2a788e', '#22a884', '#7ad151'],
  "4_viridis_r" :['#7ad151', '#22a884', '#2a788e', '#414487'],
  "4_magma" :['#3b0f70', '#8c2981', '#de4968', '#fe9f6d'],
  "4_magma_r" :['#fe9f6d', '#de4968', '#8c2981', '#3b0f70'],
  "4_plasma" :['#6a00a8', '#b12a90', '#e16462', '#fca636'],
  "4_plasma_r" :['#fca636', '#e16462', '#b12a90', '#6a00a8'],
  "4_cividis" :['#35456c', '#666970', '#948e77', '#c8b866'],
  "4_cividis_r" :['#c8b866', '#948e77', '#666970', '#35456c'],
  "4_mako" :['#382a54', '#395d9c', '#3497a9', '#60ceac'],
  "4_mako_r" :['#60ceac', '#3497a9', '#395d9c', '#382a54'],
  "4_rocket" :['#4c1d4b', '#a11a5b', '#e83f3f', '#f69c73'],
  "4_rocket_r" :['#f69c73', '#e83f3f', '#a11a5b', '#4c1d4b'],
  "4_inferno" :['#420a68', '#932667', '#dd513a', '#fca50a'],
  "4_inferno_r" :['#fca50a', '#dd513a', '#932667', '#420a68'],
  "5_viridis" :['#443983', '#31688e', '#21918c', '#35b779', '#90d743'],
  "5_viridis_r" :['#90d743', '#35b779', '#21908d', '#31688e', '#443983'],
  "5_magma" :['#2c115f', '#721f81', '#b73779', '#f1605d', '#feb078'],
  "5_magma_r" :['#feb078', '#f1605d', '#b5367a', '#721f81', '#2c115f'],
  "5_plasma" :['#5c01a6', '#9c179e', '#cc4778', '#ed7953', '#fdb42f'],
  "5_plasma_r" :['#fdb42f', '#ed7953', '#cb4679', '#9c179e', '#5c01a6'],
  "5_cividis" :['#2a3f6d', '#575d6d', '#7d7c78', '#a59c74', '#d2c060'],
  "5_cividis_r" :['#d2c060', '#a59c74', '#7c7b78', '#575d6d', '#2a3f6d'],
  "5_mako" :['#332345', '#40498e', '#357ba3', '#38aaac', '#79d6ae'],
  "5_mako_r" :['#79d6ae', '#38aaac', '#357aa2', '#40498e', '#332345'],
  "5_rocket" :['#3f1b43', '#841e5a', '#cb1b4f', '#f06043', '#f6ab83'],
  "5_rocket_r" :['#f6ab83', '#f06043', '#ca1a50', '#841e5a', '#3f1b43'],
  "5_inferno" :['#320a5e', '#781c6d', '#bc3754', '#ed6925', '#fbb61a'],
  "5_inferno_r" :['#fbb61a', '#ed6925', '#ba3655', '#781c6d', '#320a5e'],
  "6_viridis" :['#46327e', '#365c8d', '#277f8e', '#1fa187', '#4ac16d', '#a0da39'],
  "6_viridis_r" :['#a0da39', '#4ac16d', '#1fa187', '#277f8e', '#365c8d', '#46327e'],
  "6_magma" :['#221150', '#5f187f', '#982d80', '#d3436e', '#f8765c', '#febb81'],
  "6_magma_r" :['#febb81', '#f8765c', '#d3436e', '#982d80', '#5f187f', '#221150'],
  "6_plasma" :['#5302a3', '#8b0aa5', '#b83289', '#db5c68', '#f48849', '#febd2a'],
  "6_plasma_r" :['#febd2a', '#f48849', '#db5c68', '#b83289', '#8b0aa5', '#5302a3'],
  "6_cividis" :['#213b6e', '#4c556c', '#6c6e72', '#8e8978', '#b1a570', '#d9c55c'],
  "6_cividis_r" :['#d9c55c', '#b1a570', '#8e8978', '#6c6e72', '#4c556c', '#213b6e'],
  "6_mako" :['#2e1e3b', '#413d7b', '#37659e', '#348fa7', '#40b7ad', '#8bdab2'],
  "6_mako_r" :['#8bdab2', '#40b7ad', '#348fa7', '#37659e', '#413d7b', '#2e1e3b'],
  "6_rocket" :['#35193e', '#701f57', '#ad1759', '#e13342', '#f37651', '#f6b48f'],
  "6_rocket_r" :['#f6b48f', '#f37651', '#e13342', '#ad1759', '#701f57', '#35193e'],
  "6_inferno" :['#280b53', '#65156e', '#9f2a63', '#d44842', '#f57d15', '#fac228'],
  "6_inferno_r" :['#fac228', '#f57d15', '#d44842', '#9f2a63', '#65156e', '#280b53'],
  "7_viridis" :['#472d7b', '#3b528b', '#2c728e', '#21918c', '#28ae80', '#5ec962', '#addc30'],
  "7_viridis_r" :['#aadc32', '#5cc863', '#27ad81', '#21908d', '#2c718e', '#3b518b', '#472c7a'],
  "7_magma" :['#1d1147', '#51127c', '#832681', '#b73779', '#e75263', '#fc8961', '#fec488'],
  "7_magma_r" :['#fec287', '#fb8761', '#e55064', '#b5367a', '#812581', '#4f127b', '#1c1044'],
  "7_plasma" :['#4c02a1', '#7e03a8', '#aa2395', '#cc4778', '#e66c5c', '#f89540', '#fdc527'],
  "7_plasma_r" :['#fdc328', '#f89441', '#e56b5d', '#cb4679', '#a82296', '#7d03a8', '#4b03a1'],
  "7_cividis" :['#1a386f', '#434e6c', '#61656f', '#7d7c78', '#9b9476', '#bcae6c', '#dec958'],
  "7_cividis_r" :['#ddc858', '#bbad6d', '#9a9376', '#7c7b78', '#60646f', '#424e6c', '#18376f'],
  "7_mako" :['#2b1c35', '#3e356b', '#3b5698', '#357ba3', '#359fab', '#4bc2ad', '#99ddb6'],
  "7_mako_r" :['#96ddb5', '#49c1ad', '#359eaa', '#357aa2', '#3c5598', '#3e3469', '#2a1b33'],
  "7_rocket" :['#30173a', '#611f53', '#971c5b', '#cb1b4f', '#ec4c3e', '#f58860', '#f6bc99'],
  "7_rocket_r" :['#f6bb97', '#f4865e', '#ec4a3e', '#ca1a50', '#951c5b', '#601f52', '#2e1739'],
  "7_inferno" :['#210c4a', '#57106e', '#8a226a', '#bc3754', '#e45a31', '#f98e09', '#f9cb35'],
  "7_inferno_r" :['#f9c932', '#f98c0a', '#e35933', '#ba3655', '#88226a', '#550f6d', '#1f0c48'],
  "8_viridis" :['#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b'],
  "8_viridis_r" :['#b5de2b', '#6ece58', '#35b779', '#1f9e89', '#26828e', '#31688e', '#3e4989', '#482878'],
  "8_magma" :['#180f3d', '#440f76', '#721f81', '#9e2f7f', '#cd4071', '#f1605d', '#fd9668', '#feca8d'],
  "8_magma_r" :['#feca8d', '#fd9668', '#f1605d', '#cd4071', '#9e2f7f', '#721f81', '#440f76', '#180f3d'],
  "8_plasma" :['#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26'],
  "8_plasma_r" :['#fdca26', '#fb9f3a', '#ed7953', '#d8576b', '#bd3786', '#9c179e', '#7201a8', '#46039f'],
  "8_cividis" :['#123570', '#3b496c', '#575d6d', '#707173', '#8a8678', '#a59c74', '#c3b369', '#e1cc55'],
  "8_cividis_r" :['#e1cc55', '#c3b369', '#a59c74', '#8a8678', '#707173', '#575d6d', '#3b496c', '#123570'],
  "8_mako" :['#28192e', '#3b2e5d', '#40498e', '#366a9f', '#348ba6', '#38aaac', '#55caad', '#a1dfb9'],
  "8_mako_r" :['#a1dfb9', '#55caad', '#38aaac', '#348ba6', '#366a9f', '#40498e', '#3b2e5d', '#28192e'],
  "8_rocket" :['#2a1636', '#541e4e', '#841e5a', '#b41658', '#dd2c45', '#f06043', '#f5946b', '#f6c19f'],
  "8_rocket_r" :['#f6c19f', '#f5946b', '#f06043', '#dd2c45', '#b41658', '#841e5a', '#541e4e', '#2a1636'],
  "8_inferno" :['#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d13d'],
  "8_inferno_r" :['#f7d13d', '#fb9b06', '#ed6925', '#cf4446', '#a52c60', '#781c6d', '#4a0c6b', '#1b0c41'],
  "9_viridis" :['#482475', '#414487', '#355f8d', '#2a788e', '#21918c', '#22a884', '#44bf70', '#7ad151', '#bddf26'],
  "9_viridis_r" :['#bddf26', '#7ad151', '#44bf70', '#22a884', '#21908d', '#2a788e', '#355f8d', '#414487', '#482475'],
  "9_magma" :['#140e36', '#3b0f70', '#641a80', '#8c2981', '#b73779', '#de4968', '#f7705c', '#fe9f6d', '#fecf92'],
  "9_magma_r" :['#fecf92', '#fe9f6d', '#f7705c', '#de4968', '#b5367a', '#8c2981', '#641a80', '#3b0f70', '#140e36'],
  "9_plasma" :['#41049d', '#6a00a8', '#8f0da4', '#b12a90', '#cc4778', '#e16462', '#f2844b', '#fca636', '#fcce25'],
  "9_plasma_r" :['#fcce25', '#fca636', '#f2844b', '#e16462', '#cb4679', '#b12a90', '#8f0da4', '#6a00a8', '#41049d'],
  "9_cividis" :['#083370', '#35456c', '#4f576c', '#666970', '#7d7c78', '#948e77', '#aea371', '#c8b866', '#e5cf52'],
  "9_cividis_r" :['#e5cf52', '#c8b866', '#aea371', '#948e77', '#7c7b78', '#666970', '#4f576c', '#35456c', '#083370'],
  "9_mako" :['#251729', '#382a54', '#413f80', '#395d9c', '#357ba3', '#3497a9', '#3eb4ad', '#60ceac', '#a9e1bd'],
  "9_mako_r" :['#a9e1bd', '#60ceac', '#3eb4ad', '#3497a9', '#357aa2', '#395d9c', '#413f80', '#382a54', '#251729'],
  "9_rocket" :['#251433', '#4c1d4b', '#751f58', '#a11a5b', '#cb1b4f', '#e83f3f', '#f3714d', '#f69c73', '#f7c6a6'],
  "9_rocket_r" :['#f7c6a6', '#f69c73', '#f3714d', '#e83f3f', '#ca1a50', '#a11a5b', '#751f58', '#4c1d4b', '#251433'],
  "9_inferno" :['#160b39', '#420a68', '#6a176e', '#932667', '#bc3754', '#dd513a', '#f37819', '#fca50a', '#f6d746'],
  "9_inferno_r" :['#f6d746', '#fca50a', '#f37819', '#dd513a', '#ba3655', '#932667', '#6a176e', '#420a68', '#160b39'],
  "10_viridis" :['#482173', '#433e85', '#38588c', '#2d708e', '#25858e', '#1e9b8a', '#2ab07f', '#52c569', '#86d549', '#c2df23'],
  "10_viridis_r" :['#c2df23', '#86d549', '#52c569', '#2ab07f', '#1e9b8a', '#25858e', '#2d708e', '#38588c', '#433e85', '#482173'],
  "10_magma" :['#120d31', '#331067', '#59157e', '#7e2482', '#a3307e', '#c83e73', '#e95462', '#fa7d5e', '#fea973', '#fed395'],
  "10_magma_r" :['#fed395', '#fea973', '#fa7d5e', '#e95462', '#c83e73', '#a3307e', '#7e2482', '#59157e', '#331067', '#120d31'],
  "10_plasma" :['#3e049c', '#6300a7', '#8606a6', '#a62098', '#c03a83', '#d5546e', '#e76f5a', '#f68d45', '#fdae32', '#fcd225'],
  "10_plasma_r" :['#fcd225', '#fdae32', '#f68d45', '#e76f5a', '#d5546e', '#c03a83', '#a62098', '#8606a6', '#6300a7', '#3e049c'],
  "10_cividis" :['#013271', '#2f426d', '#48526c', '#5e636f', '#727374', '#878478', '#9d9576', '#b6a96f', '#cebc63', '#e7d150'],
  "10_cividis_r" :['#e7d150', '#cebc63', '#b6a96f', '#9d9576', '#878478', '#727374', '#5e636f', '#48526c', '#2f426d', '#013271'],
  "10_mako" :['#231526', '#35264c', '#403974', '#3d5296', '#366da0', '#3487a6', '#35a1ab', '#44bcad', '#6dd3ad', '#aee3c0'],
  "10_mako_r" :['#aee3c0', '#6dd3ad', '#44bcad', '#35a1ab', '#3487a6', '#366da0', '#3d5296', '#403974', '#35264c', '#231526'],
  "10_rocket" :['#221331', '#451c47', '#691f55', '#921c5b', '#b91657', '#d92847', '#ed503e', '#f47d57', '#f6a47c', '#f7c9aa'],
  "10_rocket_r" :['#f7c9aa', '#f6a47c', '#f47d57', '#ed503e', '#d92847', '#b91657', '#921c5b', '#691f55', '#451c47', '#221331'],
  "10_inferno" :['#140b34', '#390963', '#5f136e', '#85216b', '#a92e5e', '#cb4149', '#e65d2f', '#f78410', '#fcae12', '#f5db4c'],
  "10_inferno_r" :['#f5db4c', '#fcae12', '#f78410', '#e65d2f', '#cb4149', '#a92e5e', '#85216b', '#5f136e', '#390963', '#140b34'],
  "11_viridis" :['#481f70', '#443983', '#3b528b', '#31688e', '#287c8e', '#21918c', '#20a486', '#35b779', '#5ec962', '#90d743', '#c8e020'],
  "11_viridis_r" :['#c8e020', '#90d743', '#5cc863', '#35b779', '#20a486', '#21908d', '#287c8e', '#31688e', '#3b518b', '#443983', '#481f70'],
  "11_magma" :['#100b2d', '#2c115f', '#51127c', '#721f81', '#932b80', '#b73779', '#d8456c', '#f1605d', '#fc8961', '#feb078', '#fed799'],
  "11_magma_r" :['#fed799', '#feb078', '#fb8761', '#f1605d', '#d8456c', '#b5367a', '#932b80', '#721f81', '#4f127b', '#2c115f', '#100b2d'],
  "11_plasma" :['#3a049a', '#5c01a6', '#7e03a8', '#9c179e', '#b52f8c', '#cc4778', '#de5f65', '#ed7953', '#f89540', '#fdb42f', '#fbd524'],
  "11_plasma_r" :['#fbd524', '#fdb42f', '#f89441', '#ed7953', '#de5f65', '#cb4679', '#b52f8c', '#9c179e', '#7d03a8', '#5c01a6', '#3a049a'],
  "11_cividis" :['#003170', '#2a3f6d', '#434e6c', '#575d6d', '#6a6c71', '#7d7c78', '#918b78', '#a59c74', '#bcae6c', '#d2c060', '#e9d34e'],
  "11_cividis_r" :['#e9d34e', '#d2c060', '#bbad6d', '#a59c74', '#918b78', '#7c7b78', '#6a6c71', '#575d6d', '#424e6c', '#2a3f6d', '#003170'],
  "11_mako" :['#211423', '#332345', '#3e356b', '#40498e', '#38629d', '#357ba3', '#3492a8', '#38aaac', '#4bc2ad', '#79d6ae', '#b2e4c2'],
  "11_mako_r" :['#b2e4c2', '#79d6ae', '#49c1ad', '#38aaac', '#3492a8', '#357aa2', '#38629d', '#40498e', '#3e3469', '#332345', '#211423'],
  "11_rocket" :['#20122e', '#3f1b43', '#611f53', '#841e5a', '#a8185a', '#cb1b4f', '#e43841', '#f06043', '#f58860', '#f6ab83', '#f7ccaf'],
  "11_rocket_r" :['#f7ccaf', '#f6ab83', '#f4865e', '#f06043', '#e43841', '#ca1a50', '#a8185a', '#841e5a', '#601f52', '#3f1b43', '#20122e'],
  "11_inferno" :['#110a30', '#320a5e', '#57106e', '#781c6d', '#9a2865', '#bc3754', '#d84c3e', '#ed6925', '#f98e09', '#fbb61a', '#f4df53'],
  "11_inferno_r" :['#f4df53', '#fbb61a', '#f98c0a', '#ed6925', '#d84c3e', '#ba3655', '#9a2865', '#781c6d', '#550f6d', '#320a5e', '#110a30'],
  "12_viridis" :['#481c6e', '#453581', '#3d4d8a', '#34618d', '#2b748e', '#24878e', '#1f998a', '#25ac82', '#40bd72', '#67cc5c', '#98d83e', '#cde11d'],
  "12_viridis_r" :['#cde11d', '#98d83e', '#67cc5c', '#40bd72', '#25ac82', '#1f998a', '#24878e', '#2b748e', '#34618d', '#3d4d8a', '#453581', '#481c6e'],
  "12_magma" :['#0d0a29', '#271258', '#491078', '#671b80', '#862781', '#a6317d', '#c53c74', '#e34e65', '#f66c5c', '#fc9065', '#feb67c', '#fdda9c'],
  "12_magma_r" :['#fdda9c', '#feb67c', '#fc9065', '#f66c5c', '#e34e65', '#c53c74', '#a6317d', '#862781', '#671b80', '#491078', '#271258', '#0d0a29'],
  "12_plasma" :['#370499', '#5801a4', '#7701a8', '#920fa3', '#ac2694', '#c23c81', '#d45270', '#e4695e', '#f1814d', '#fa9b3d', '#feb82c', '#fad824'],
  "12_plasma_r" :['#fad824', '#feb82c', '#fa9b3d', '#f1814d', '#e4695e', '#d45270', '#c23c81', '#ac2694', '#920fa3', '#7701a8', '#5801a4', '#370499'],
  "12_cividis" :['#00306f', '#263d6e', '#3e4b6c', '#51586d', '#636670', '#747475', '#858279', '#989277', '#aca172', '#c0b16a', '#d5c25e', '#ebd44b'],
  "12_cividis_r" :['#ebd44b', '#d5c25e', '#c0b16a', '#aca172', '#989277', '#858279', '#747475', '#636670', '#51586d', '#3e4b6c', '#263d6e', '#00306f'],
  "12_mako" :['#1f1220', '#312140', '#3c3162', '#414184', '#3b589a', '#3670a0', '#3485a5', '#359baa', '#3cb2ad', '#50c6ad', '#82d8b0', '#b7e6c5'],
  "12_mako_r" :['#b7e6c5', '#82d8b0', '#50c6ad', '#3cb2ad', '#359baa', '#3485a5', '#3670a0', '#3b589a', '#414184', '#3c3162', '#312140', '#1f1220'],
  "12_rocket" :['#1d112c', '#3a1a41', '#591e50', '#781f59', '#9a1b5b', '#bc1656', '#d72549', '#eb463e', '#f26d4b', '#f58f66', '#f6b089', '#f7cfb3'],
  "12_rocket_r" :['#f7cfb3', '#f6b089', '#f58f66', '#f26d4b', '#eb463e', '#d72549', '#bc1656', '#9a1b5b', '#781f59', '#591e50', '#3a1a41', '#1d112c'],
  "12_inferno" :['#0e092b', '#2d0b59', '#4f0d6c', '#6d186e', '#8d2369', '#ad305d', '#c83f4b', '#e15635', '#f2741c', '#fb9606', '#fbbc21', '#f3e35a'],
  "12_inferno_r" :['#f3e35a', '#fbbc21', '#fb9606', '#f2741c', '#e15635', '#c83f4b', '#ad305d', '#8d2369', '#6d186e', '#4f0d6c', '#2d0b59', '#0e092b'],
}
