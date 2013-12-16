function construir_grafico4 (infos_RA){
    var escalax=  d3.scale.linear()
    .domain([0, d3.max(infos_RA,function(d){return d[5];})])
        .range(["1.5em","22em"]);
    var  escalay=  d3.scale.linear()
    .domain([0, d3.max(infos_RA,function(d){return d[0];})])
        .range(["1.5em","8em"]);
    d3.select("#id_indicadores-2")
            .append("meutexto")
            .text("% Relação Indicador x Renda Per Capita")
    
    var svg = d3.select("#id_indicadores-2")
            .append("grafico4")
            .attr("width",80)
            .attr("height",80);
    
    svg.selectAll("circle")
            .data(infos_RA)
            .enter()
            .append("circle")
            .attr("cx",function(d){
                return escalax(d[0]);
            })
            .attr("cy",function(d){
                return escalay(d[5]);
            })
            .attr("r",5);
}
