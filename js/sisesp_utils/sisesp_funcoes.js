function construir_graficoinicial(){

	    d3.csv("TABELA_2.1.csv",function(data){
		var dd = [];
		for (var i in data) {
		    dd.push([data[i].romano_C_254,Number(data[i].v_2_1_1_N_16_6)]);
		}
	    })
/* ******************************************* */
	    //Width and height
	    var w = 300;
	    var h = 280;
	    
	    //Data
	    var dataset1 = [5,8,11,14,17];
	    
	    //Create SVG element
	    var svg = d3.select("#id_indicadores-1")
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
	    var svg = d3.select("#id_indicadores-1")
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
	    var svg = d3.select("#id_indicadores-2")
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
	    var svg = d3.select("#id_indicadores-2")
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
	    var svg = d3.select("#id_indicadores-2")
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
function construir_grafico4 (infos_RA){
    var width = 250;
    var height = 180;
    //console.log(infos_RA);
    var color = d3.scale.ordinal()
        .domain(["chart0","chart1","chart2","chart3","chart4","chart5"])
        .range([QUARTIL0,QUARTIL1,QUARTIL2,QUARTIL3,QUARTIL4,QUARTIL5]);

    var escalax=  d3.scale.linear()
    .domain([d3.min(infos_RA,function(d){return d[0];}), d3.max(infos_RA,function(d){return d[0];})])
        .range(["1em","20em"]);
    var  escalay=  d3.scale.linear()
    .domain([0, d3.max(infos_RA,function(d){return d[5];})])
        .range(["8em","1em"]);
    d3.select("#id_indicadores-2")
            .append("meutexto")
            .text("Renda Per Capita x Indicador");

    var svg = d3.select("#id_indicadores-2")
        .append("svg")
        .attr("width",width)
        .attr("height",height)
        .attr("id","scatterplot");
    svg.selectAll("circle")
        .data(infos_RA)
        .enter()
        .append("circle")
        .attr("cx",function(d){return escalax(d[0]);})
        .attr("cy",function(d){return escalay(d[5]);})
        .attr("r",4)
        .attr("fill",function(d){return color(d[4]);});

}

function construir_grafico3 (quartil){
    var width  = 100;
    var height = 100;
    var dataset = [];
    var vsis_populacaototal = 0;
    //
    d3.select("#id_indicadores-2")
            .append("meutexto")
            .text("% População do DF por Quartil")

    for (var i in quartil)vsis_populacaototal += quartil[i][2];
    for (var i in quartil)dataset.push((quartil[i][2]*100/vsis_populacaototal).toFixed(1));
    var outerRadius = width / 2;
    var innerRadius = 0;
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    var pie = d3.layout.pie()
        .sort(null);
    var color = d3.scale.ordinal()
        .domain(["chart0","chart1","chart2","chart3","chart4","chart5"])
        .range([QUARTIL0,QUARTIL1,QUARTIL2,QUARTIL3,QUARTIL4,QUARTIL5]);
    //Create SVG element
    //d3.select("#id_indicadores-2 div").remove();
    d3.select("#id_indicadores-2")
            .append("grafico3")
            .attr("class", "chartsvg");

    var svg = d3.select("#id_indicadores-2 grafico3")
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



function construir_grafico2 (quartil){
    var width  = 100;
    var height = 100;
    var dataset = [];

    for (var i in quartil)dataset.push(quartil[i][0]);
    var outerRadius = width / 2;
    var innerRadius = 0;
    var arc = d3.svg.arc()
	.innerRadius(innerRadius)
        .outerRadius(outerRadius);
    var pie = d3.layout.pie()
	.sort(null);

    var color = d3.scale.ordinal()
	.domain(["chart0","chart1","chart2","chart3","chart4","chart5"])
	.range([QUARTIL0,QUARTIL1,QUARTIL2,QUARTIL3,QUARTIL4,QUARTIL5]);
    
    //Create SVG element
    d3.select("#id_indicadores-2 div").remove();
    d3.select("#id_indicadores-2")
            .append("meutexto")
    	    .text("Quantidade RAs por Quartil")

    d3.select("#id_indicadores-2")
            .append("grafico2")
    	    .attr("class", "chartsvg");

    var svg = d3.select("#id_indicadores-2 grafico2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)



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


function construir_grafico1 (infos_RA){
    var escala=  d3.scale.linear()
    .domain([0, d3.max(infos_RA,function(d){return d[0];})])
        .range(["1.5em","22em"]);

    d3.select("#id_indicadores-1 div").remove();
    d3.select("#id_indicadores-1")
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
        .attr("class", function(d){return d[4];})
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
/*    document.getElementById('id_indicadores').innerHTML = display_text;
*/
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



