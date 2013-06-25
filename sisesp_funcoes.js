function construir_graficoinicial(){

	    d3.csv("TABELA_2.1.csv",function(data){
/*		console.log(data); */
		var dd = [];
		for (var i in data) {
		    dd.push([data[i].romano_C_254,Number(data[i].v_2_1_1_N_16_6)]);
		}
		console.log(dd);
	    })
/* ******************************************* */
	    //Width and height
	    var w = 300;
	    var h = 280;
	    
	    //Data
	    var dataset1 = [5,8,11,14,17];
	    
	    //Create SVG element
	    var svg = d3.select("#indicadores-1")
			.append("svg")
			.attr("width", w/12+"em")
			.attr("height", h/12+"em");

	    var circles = svg.selectAll("circle")
	        .data(dataset1)
	        .enter()
	        .append("circle");

	    circles.attr("cx", 100/12+"em")
		   .attr("cy", (function(d, i) {return (i * 50) + 40;}))
		   .attr("r", function(d) {return d;})
		   .attr("fill", "yellow")
		   .attr("stroke", "orange")
		   .attr("stroke-width", function(d) {return d/3;});
/* ****************************** */
	    //Width and height
	    var w = 200;
	    var h = 150;

	    //Original data
	    var dataset2 = [
		[
		    { x: 0, y: 5 },
		    { x: 1, y: 4 },
		    { x: 2, y: 2 },
		    { x: 3, y: 7 },
		    { x: 4, y: 23 }
		],
		[
		    { x: 0, y: 10 },
		    { x: 1, y: 12 },
		    { x: 2, y: 19 },
		    { x: 3, y: 23 },
		    { x: 4, y: 17 }
		],
		[
		    { x: 0, y: 22 },
		    { x: 1, y: 28 },
		    { x: 2, y: 32 },
		    { x: 3, y: 35 },
		    { x: 4, y: 43 }
		]
	    ];

	    //Set up stack method
	    var stack = d3.layout.stack();

	    //Data, stacked
	    stack(dataset2);

	    //Set up scales
	    var xScale = d3.scale.ordinal()
		.domain(d3.range(dataset2[0].length))
		.rangeRoundBands([0, w], 0.05);
	
	    var yScale = d3.scale.linear()
		.domain([0,
		    d3.max(dataset2, function(d) {
			return d3.max(d, function(d) {
			    return d.y0 + d.y;
			});
		    })
		])
		.range([0, h]);
		
	    //Easy colors accessible via a 10-step ordinal scale
	    var colors = d3.scale.category10();
	
	    //Create SVG element
	    var svg = d3.select("#indicadores-1")
			.append("svg")
			.attr("width", w+"em")
			.attr("height", h+"em");
    
	    // Add a group for each row of data
	    var groups = svg.selectAll("g")
		.data(dataset2)
		.enter()
		.append("g")
		.style("fill", function(d, i) {
		    return colors(i);
		});
    
	    // Add a rect for each data value
	    var rects = groups.selectAll("rect")
		.data(function(d) { return d; })
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
		    return xScale(i);
		})
		.attr("y", function(d) {
		    return yScale(d.y0);
		})
		.attr("height", function(d) {
		    return yScale(d.y);
		})
		.attr("width", xScale.rangeBand());

/* ****************************** */
	    //Width and height
	    var w = 200;
	    var h = 120;
	    var barPadding = 1;
	    
	    var dataset3 = [ 5, 10, 13, 19, 21, 25, 27,25,21, 19, 13, 10 ,5];
	    
	    //Create SVG element
	    var svg = d3.select("#indicadores-2")
			.append("svg")
			.attr("width", w/10+"em")
			.attr("height", h/14+"em");

	    svg.selectAll("rect")
	       .data(dataset3)
	       .enter()
	       .append("rect")
	       .attr("x", function(d, i) {return i * (w / dataset3.length);})
	       .attr("y", function(d) {return h - (d * 4);})
	       .attr("width", w / dataset3.length - barPadding)
	       .attr("height", function(d) {return d * 4;})
	       .attr("fill", "teal");

/* *************** */
	    //Width and height
	    var w = 200;
	    var h = 180;
	    //Create SVG element
	    var svg = d3.select("#indicadores-2")
			.append("svg")
			.attr("width", w/10+"em")
			.attr("height", h/16+"em");

	    var dataset4 = [ [20,"purple"],[40,"blue"],[60,"green"],[80,"yellow"],[100,"red"]];
	    var rect = svg.selectAll("rect")
	        .data(dataset4)
	        .enter()
	        .append("rect");
	        
	    rect.attr("x", function(d) {return d[0];})
		   .attr("y", function(d) {return d[0];})
		   .attr("fill", function(d){return d[1];})
		   .attr("width",40)
		   .attr("height",40);
/* ********************************************************* */
	    //Width and height
	    var w = 200;
	    var h = 200;

	    var dataset5 = [ 5, 10, 20, 45, 6, 25 ];

	    var outerRadius = w / 3;
	    var innerRadius = w / 8;
	    var arc = d3.svg.arc()
			    .innerRadius(innerRadius)
			    .outerRadius(outerRadius);
	    
	    var pie = d3.layout.pie();
	    
	    //Easy colors accessible via a 10-step ordinal scale
	    var color = d3.scale.category10();

	    //Create SVG element
	    var svg = d3.select("#indicadores-2")
			.append("svg")
			.attr("width", w+"em")
			.attr("height", h+"em");
	    
	    //Set up groups
	    var arcs = svg.selectAll("g.arc")
			  .data(pie(dataset5))
			  .enter()
			  .append("g")
			  .attr("class", "arc")
			  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
	    
	    //Draw arc paths
	    arcs.append("path")
	        .attr("fill", function(d, i) {
	    	return color(i);
	        })
	        .attr("d", arc);
	    
	    //Labels
	    arcs.append("text")
	        .attr("transform", function(d) {
	    	return "translate(" + arc.centroid(d) + ")";
	        })
	        .attr("text-anchor", "middle")
	        .text(function(d) {
	    	return d.value;
	        });

}

function construir_grafico2 (quartil){
    var width = 150;
    var height = 150;
    var dataset = [];

    for (i in quartil){
	dataset.push(quartil[i][0]);
    }
    document.getElementById('indicadores-2').innerHTML = '';
    var display_text = '<strong><center>Índices agregados RAs</center></strong><br />' +
	'<ul class="a"><li>Baixo</li></ul>' +
	'<ul class="b"><li>Médio-Baixo</li></ul>' +
	'<ul class="c"><li>Médio-Alto</li></ul>' +
	'<ul class="d"><li>Alto</li></ul>';
    document.getElementById('indicadores-2').innerHTML = display_text;

    var outerRadius = width / 2;
    var innerRadius = 0;
    var arc = d3.svg.arc()
	.innerRadius(innerRadius)
        .outerRadius(outerRadius);
    var pie = d3.layout.pie()
	.sort(null);

    var color = d3.scale.ordinal()
	.domain(["chart0","chart1","chart2","chart3"])
	.range([CHART0,CHART1,CHART2,CHART3]);
    
    //Create SVG element
    d3.select("#indicadores-2 div").remove();
    d3.select("#indicadores-2")
            .append("div")
    	    .attr("class", "chartsvg");

    var svg = d3.select("#indicadores-2 div")
	.append("svg")
	.attr("width", width)
	.attr("height", height);


    //Set up groups
    var arcs = svg.selectAll("g.arc")
	  .data(pie(dataset))
	  .enter()
	  .append("g")
	  .attr("class", "arc")
	  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {return color(i);})
        .attr("d", arc);

    //Labels
    arcs.append("text")
        .attr("transform", function(d) {
		return "translate(" + arc.centroid(d) + ")";
	})
	.attr("text-anchor", "middle")
	.text(function(d) {return d.value;});
}

/*

    d3.select("#indicadores-2 div").remove();
    d3.select("#indicadores-2")
        .append("div")
    	    .attr("class", "chart")
        .selectAll("div.linequartil")
	.data(quartil)
        .enter()
        .append("div")
        .attr("class","linequartil")
    
    d3.selectAll("div.linequartil")
        .append("div")
        .attr("class","label")
        .text(function(d){return d[1];})

    d3.selectAll("div.linequartil")
        .append("div")
        .attr("class", estilo_chart)
        .style("width", function(d){return escala(d[0]);})
        .text(function(d){return d[0];});
}

*/
function construir_grafico1 (infos_RA){
    var escala=  d3.scale.linear()
    .domain([0, d3.max(infos_RA,function(d){return d[0];})])
        .range(["1.5em","21em"]);

    d3.select("#indicadores-1 div").remove();
    d3.select("#indicadores-1")
        .append("div")
    	    .attr("class", "chart")
        .selectAll("div.line")
	.data(infos_RA)
        .enter()
        .append("div")
        .attr("class","line")
    
    d3.selectAll("div.line")
        .append("div")
        .attr("class","label")
        .text(function(d){return d[1].slice(0,19);})
        
    d3.selectAll("div.line")
        .append("div")
        .attr("class", function(d){return d[3];})
        .style("width", function(d){return escala(d[0]);})
        .text(function(d){return d[0];});
}	
function limpar_grafico(){
    var display_text = '<h2>Indicadores Sociais</h2><hr /><u>Indicadores - Legenda:</u><br />' +
    '<img src="icon/X2.png" alt="Indice Alto">Alto<br />' +
    '<img src="icon/circle2.png" alt="Indice Médio-Alto">Médio-Alto<br />' + 
    '<img src="icon/triangle2.png" alt="Indice Médio-Baixo">Médio-Baixo<br />' +
    '<img src="icon/square2.png" alt="Indice Baixo">Baixo<br /><hr />' + 
    'Os 5 indicadores aqui apresentados foram retirados dos resultados da PESQUISA DISTRITAL POR AMOSTRA DE DOMICÍLIOS – PDAD 2010/2012, ' +
    'um instrumento de planejamento de ações e tomadas de decisões governamentais. <br /><br />Trata-se da segunda pesquisa domiciliar realizada ' +
    'no DF, tendo a primeira ocorrida em 2004. Contém um rico manancial de informações de natureza socioeconômica sobre as famílias do DF, ' +
    'onde cerca de 24.000 questionários foram aplicados nas 30 Regiões Administrativas pesquisadas. <br /><br />Os dados completos da pesquisa ' +
    'podem ser encontrados na página da <a target="_blank" href="http://www.codeplan.df.gov.br/">Companhia de Planejamento do Distrito Federal – Codeplan</a>.';
/*    document.getElementById('indicadores').innerHTML = display_text;
*/
}
function definir_cores_camadas () {
var cores_camadas_ind = {
IND_RENDA        : '#db1917',
IND_BANDALARGA   : '#158958',
IND_COR          : '#171adb',
IND_ESCOLARIDADE : '#ae329d',
IND_BANCARIA     : '#271717'
}
return (cores_camadas_ind);
}
function definir_regras_indicadores () {
var regras_ind = {
    0:  new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO, property: 'nivel', value:0
        }),
        symbolizer:{ graphicName:'square',pointRadius:4}
    }),
    1: new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO, property: 'nivel', value:1
        }),
        symbolizer:{graphicName:'triangle', pointRadius:8}
    }),
    2: new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO, property: 'nivel', value:2
        }),
        symbolizer:{graphicName:'circle',pointRadius:11}
    }),
    3: new OpenLayers.Rule({
        filter: new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO, property: 'nivel', value:3
        }),
        symbolizer:{graphicName:'x',pointRadius:14}
})
}
return (regras_ind);
}
function definir_identificacao_layers_ind () {
var identificacao_layers_ind = {
    IND_RENDA:"Indicador Renda"   ,
    IND_BANDALARGA:"Indicador Banda Larga" , 
    IND_COR:"Indicador Cor"    ,
    IND_ESCOLARIDADE:"Indicador Escolaridade",
    IND_BANCARIA:"Indicador Exc. Bancária"
}
return (identificacao_layers_ind);
}
//function definir_estilo_layers_ind (TAMANHO_TEXTO_FEATURE,COR_TEXTO_FEATURE) {
function definir_estilo_layers_ind () {
var estilo_ind_selected = {
    'name':'indicadores',
    'fill':true,
    'pointRadius':20,
    'fillOpacity':.3,
    'strokeWidth':6,
    fontSize:TAMANHO_TEXTO_FEATURE,
    fontColor:COR_TEXTO_FEATURE,
    fontWeight:'bold',
    labelAlign:'cm', 
    labelYOffset:0,
    'label':'${RA}: ${indice}'
}
return (estilo_ind_selected);
}
function definir_estilo_default_layers_ind (cores_camadas_ind) {
var estilo_ind_default = {
    0 : new OpenLayers.Style({
        fillColor:cores_camadas_ind.IND_RENDA,
        strokeColor:cores_camadas_ind.IND_RENDA,
        fill:true,
        fillOpacity:.2,
        strokeWidth:2,
        }),
    1 : new OpenLayers.Style({
        fillColor:cores_camadas_ind.IND_BANDALARGA,
        strokeColor:cores_camadas_ind.IND_BANDALARGA,
        fill:true,
        fillOpacity:.2,
        strokeWidth:2
        }),
    2 : new OpenLayers.Style({
        fillColor:cores_camadas_ind.IND_COR,
        strokeColor:cores_camadas_ind.IND_COR,
        fill:true,
        fillOpacity:.2,
        strokeWidth:2
        }),
    3 : new OpenLayers.Style({
        fillColor:cores_camadas_ind.IND_ESCOLARIDADE,
        strokeColor:cores_camadas_ind.IND_ESCOLARIDADE,
        fill:true,
        fillOpacity:.2,
        strokeWidth:2
        }),
    4 : new OpenLayers.Style({
        fillColor:cores_camadas_ind.IND_BANCARIA,
        strokeColor:cores_camadas_ind.IND_BANCARIA,
        fill:true,
        fillOpacity:.2,
        strokeWidth:2
        })
}
return (estilo_ind_default);
}
function definir_layers_indicadores (identificacao_layers_ind) {
var asd = "Ind Escolar";
var layers_ind = {
    0 : new OpenLayers.Layer.Vector('<bullet class="cor_IND_RENDA";></bullet>'+identificacao_layers_ind.IND_RENDA,{
    protocol: new OpenLayers.Protocol.HTTP({
        url: 'data_json/data_indicador_renda.json',
        format: mgov_vector_format_json}),
    strategies: [new OpenLayers.Strategy.Fixed()],
    visibility: false, attribution:identificacao_layers_ind.IND_RENDA, isBaseLayer:false
    }),
    1 : new OpenLayers.Layer.Vector('<bullet class="cor_IND_BANDALARGA";></bullet>'+identificacao_layers_ind.IND_BANDALARGA,{
     protocol: new OpenLayers.Protocol.HTTP({
        url: 'data_json/data_indicador_bandalarga.json',
        format: mgov_vector_format_json}),
    strategies: [new OpenLayers.Strategy.Fixed()],
    visibility: false, attribution:identificacao_layers_ind.IND_BANDALARGA, isBaseLayer:false
    }),
    2 : new OpenLayers.Layer.Vector('<bullet class="cor_IND_COR";></bullet>'+identificacao_layers_ind.IND_COR,{
    protocol: new OpenLayers.Protocol.HTTP({
        url: 'data_json/data_indicador_cor.json',
        format: mgov_vector_format_json}), 
    strategies: [new OpenLayers.Strategy.Fixed()],
    visibility: false, attribution:identificacao_layers_ind.IND_COR, isBaseLayer:false
    }),
    3 : new OpenLayers.Layer.Vector('<bullet class="cor_IND_ESCOLARIDADE";></bullet>'+identificacao_layers_ind.IND_ESCOLARIDADE,{
    protocol: new OpenLayers.Protocol.HTTP({
        url: 'data_json/data_indicador_escolaridade.json',
        format: mgov_vector_format_json}), 
    strategies: [new OpenLayers.Strategy.Fixed()],
    visibility: false, attribution:identificacao_layers_ind.IND_ESCOLARIDADE, isBaseLayer:false
    }),
    4 : new OpenLayers.Layer.Vector('<bullet class="cor_IND_BANCARIA";></bulleT>'+identificacao_layers_ind.IND_BANCARIA,{
    protocol: new OpenLayers.Protocol.HTTP({
        url: 'data_json/data_indicador_bancaria.json',
        format: mgov_vector_format_json}), 
    strategies: [new OpenLayers.Strategy.Fixed()],
    visibility: false, attribution:identificacao_layers_ind.IND_BANCARIA, isBaseLayer:false
    })
}
return (layers_ind);
}
//
function definir_layers_pontos() {
var layers_pontos = {
    0 : new OpenLayers.Layer.Vector('<img src="icon/icon_policial.png" height="18px">Posto Policial',{
        protocol: new OpenLayers.Protocol.HTTP({
            url: 'data_json/data_policial.json',
            format: mgov_vector_format_json
        }), 
        strategies: [new OpenLayers.Strategy.Fixed()],
        visibility: false,
        isBaseLayer:false,
        attribution:'Policial'
        }),
    1 : new OpenLayers.Layer.Vector('<img src="icon/icon_hospital.png" height="18px">Hospitais',{ 
        protocol: new OpenLayers.Protocol.HTTP({
            url: 'data_json/data_hospital.json',
            format: mgov_vector_format_json
        }),
        strategies: [new OpenLayers.Strategy.Fixed()],
        visibility: false,
        isBaseLayer:false,
        attribution:'Hospitais'
        }),
    2 :  new OpenLayers.Layer.Vector('<img src="icon/icon_teatro.png" height="18px">Teatros',{
        protocol: new OpenLayers.Protocol.HTTP({
            url: 'data_json/data_teatro.json',
            format: mgov_vector_format_json
        }),
        strategies: [new OpenLayers.Strategy.Fixed()],
        visibility: false,
        isBaseLayer:false,
        attribution:'Teatros'})
}
return (layers_pontos);
}
function definir_style_layer_pontos() {
var estilo_pontos_default = {
    0 : new OpenLayers.Style({
        'externalGraphic': 'icon/icon_policial.png', 'graphicHeight': 30
        }),
    1 : new OpenLayers.Style({ 
        'externalGraphic': 'icon/icon_hospital.png', 'graphicHeight': 30
        }),
    2 : new OpenLayers.Style({
        'externalGraphic': 'icon/icon_teatro.png', 'graphicHeight': 30
        })
}
return (estilo_pontos_default);
}



