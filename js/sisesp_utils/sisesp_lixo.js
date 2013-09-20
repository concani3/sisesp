//
/*
* --------------------------------------------------------------------------
*
* DEFINICOES GLOBAIS
*
* --------------------------------------------------------------------------
*/
OpenLayers.Lang.setCode("pt-BR");
// endereços: URLs e pastas
const HOSTNAME = "http://50.116.27.239";
const HOSTNAME_WMS = HOSTNAME + ":8080/geoserver/wms/";
const HOSTNAME_WFS = HOSTNAME + ":8080/geoserver/wfs/";
const PASTA_HTML = "html/"; // subdiretorio abaixo pasta raiz para arquivos html (como os de menus. Exceção: index.html, que fica pasta raiz).
const PASTA_JSON = "data_json/"; // subdiretório abaixo pasta raiz para arquivos JSON;
// cores para os graficos de indicadores
const QUARTIL0 = "#FFF68F";
const QUARTIL1 = "#EABE53";
const QUARTIL2 = "#B1D4AF";
const QUARTIL3 = "#7E9B26";
const QUARTIL4 = "#E48164";
const QUARTIL5 = "#E92922";
// Mensagens de erro da aplicação
const MENS_ERR_01 = "Erro 01: ";
const MENS_ERR_02 = "Erro 02: ";
const MENS_ERR_03 = "Erro 03: ";
const MENS_ERR_04 = "Erro 04: ";
const MENS_ERR_05 = "Erro 05: ";
const MENS_ERR_06 = "Erro 06: ";
const MENS_ERR_07 = "";
const MENS_ERR_08 = "";
// Mensagens gerais da aplicação
const MENS_01 = "problemas no carregamento dos arquivos de Informações Gerais.";
const MENS_02 = "OpenStreetMap Layer";
const MENS_03 = "Google Streets Layer";
const MENS_04 = "Google Satellite Layer";
const MENS_05 = "RIDE-DF";
const MENS_06 = "DF:RAs";
const MENS_07 = "DF:Setor";
const MENS_08 = "DF:Quadra";
const MENS_09 = "DF:Conjunto";
const MENS_10 = "DF:Lote";
const MENS_11 = "Transparência RAs";
const MENS_12 = "Atributos Literais";
const MENS_13 = "geoinformação";
const MENS_14 = "<p class='popup'>Informações Literais:</p>";
const MENS_15 = "Features by clicking";
const MENS_16 = "arquivo ";
const MENS_17 = " não encontrado.";
const MENS_18 = "problemas no carregamento do arquivo ";
const MENS_19 = "problemas com a geometria das regiões. ";
const MENS_20 = "<p class='indi_titulo1'>Indicadores Sociais</p><hr />";
const MENS_21 = "problemas no carregamento WFS.";
const MENS_22 = "Execução interrompida!";
const MENS_23 = "inconsistência nos dados dos indicadores ou da geometria.";
const MENS_24 = "";
const MENS_25 = "";
const MENS_26 = "";
const MENS_27 = "";
const MENS_28 = "";
//

var vsis_map, vsis_populacaoDF, vsis_percapitaDF;
var vsis_mercator = new OpenLayers.Projection("EPSG:900913");
var vsis_geographic = new OpenLayers.Projection("EPSG:4326");
var vsis_layerindicadores = null, vsis_layerregioes = null;
var vsis_featuresregioes;
var vsis_paletaregioes = [[0,"chart0"],[1,"chart1"],[2,"chart2"],[3,"chart3"],[4,"chart4"],[5,"chart5"]];
var vsis_paletaregioes2 = [[0,QUARTIL0],[1,QUARTIL1],[2,QUARTIL2],[3,QUARTIL3],[4,QUARTIL4],[5,QUARTIL5]];
    // vsis_baseindicadores:  base de dados das pesquisas com os indicadores.
    // campos: [subdiretorio dentro pasta arquivos JSON contendo os indicadores, nome arquivo do menu para o internauta, arquivo de populacao, arquivo renda per capita]]
var vsis_baseindicadores = [["pdad_2011","sisesp_menupdad2011.html","2011_pdad_indicador_populacao.json","2011_pdad_indicador_renda_percapita.json"],
                            ["pdad_2013","sisesp_menupdad2013.html","2013_pdad_indicador_populacao.json","2013_pdad_indicador_renda_percapita.json"],
                            ["pdad_2015","sisesp_menupdad2015.html","2015_pdad_indicador_populacao.json","2015_pdad_indicador_renda_percapita.json"],
                            ["pdad_2004","sisesp_menupdad2004.html","2004_pdad_indicador_populacao.json","2004_pdad_indicador_renda_percapita.json"]
];
var vsis_base;


/*
* --------------------------------------------------------------------------
*
* FUNCAO PRINCIPAL init()
*
* --------------------------------------------------------------------------
*/
function init() {

//construir_graficoinicial();
/*
* --------------------------------------------------------------------------
* DEFINICAO DOS CONTROLES
*  1 - Propiedades utilizadas:
*       prefix: a string to be prepended to the current pointers coordinates when it is rendered. 
*	separator: a string to be used to seperate the two coordinates from each other. 
*	numDigits: the number of digits each coordinate shall have when being rendered, Defaults to 5.
*	div: element that contains the control, if not present the control is placed inside the map.
* --------------------------------------------------------------------------
*/
// SphericalMercator - name given to the projection used by the commercial API providers, such as Google and OpenStreetMap.
// It has been given the code EPSG:3857, though OpenLayers still uses the older, unofficial EPSG:900913.
var vsis_navigation_control = new OpenLayers.Control.Navigation({});
var vsis_layeredicao = new OpenLayers.Layer.Vector('Vetores Editáveis');
var vsis_controlsarray = [
	    vsis_navigation_control,
	    new OpenLayers.Control.Attribution({div:document.getElementById('id_layers_info'),template:'Camadas Selecionadas: ${layers}'}),
	    new OpenLayers.Control.PanZoomBar({title:'PanZoomBar'}),
	    new OpenLayers.Control.LayerSwitcher({title: 'Menu de Layers','roundedCorner':true}),
	    new OpenLayers.Control.Permalink(),
	    new OpenLayers.Control.MousePosition({prefix:'Mouse=   lon: ',separator:',    lat: ',numDigits:4,div:document.getElementById('id_mouse')}),
	    new OpenLayers.Control.EditingToolbar(vsis_layeredicao),
	    new OpenLayers.Control.ScaleLine({}),
	    new OpenLayers.Control.Scale(),
	    new OpenLayers.Control.OverviewMap({title: 'Overview Map',maxRatio: 20,minRatio:6}),
	    new OpenLayers.Control.KeyboardDefaults({})
];

/*
* --------------------------------------------------------------------------
*
*                            CRIAR O MAPA
*
* ---------------------------------------------------------------------------
*/
vsis_map = new OpenLayers.Map('id_map',{
    allOverlays:false,
    PanMethod: OpenLayers.Easing.Quad.easeInOut,
    panDuration:90,
    controls: vsis_controlsarray,
    numZoomLevels: 26,
    projection: vsis_mercator,
    displayProjection: vsis_mercator
//    displayProjection: vsis_geographic
});
//
/*
* -------------------------------------------------------------------------
*
*                              LAYERS
*
* --------------------------------------------------------------------------
*/
//OpenStreetMap
var vsis_layerosm = new OpenLayers.Layer.OSM(
MENS_02
);
/*
//Google streets
var vsis_layerstreets = new OpenLayers.Layer.Google(
MENS_03,{attribution:"Google Streets"}
);
//Google satellite
var vsis_layersatellite = new OpenLayers.Layer.Google(
MENS_04,
{type: google.maps.MapTypeId.SATELLITE,attribution:"Google Satellite"}
);

var vsis_layerRA = new OpenLayers.Layer.WMS(
MENS_06,
HOSTNAME_WMS,
{layers: 'cdes:ra31_df',transparent:false},{attribution:'RA-Limites',visibility: true, isBaseLayer:true,opacity:1,displayInLayerSwitcher:true}
);
*/
//Escolas
var vsis_layerescolas = new OpenLayers.Layer.WMS(
'Escolas',
HOSTNAME_WMS,
{layers: 'cdes:equip_publico_educacao', transparent:true},{attribution:'Escolas',visibility: true, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
);
/*
//RIDE
var vsis_layerridegroup = new OpenLayers.Layer.WMS(
MENS_05,
HOSTNAME_WMS,
{layers: 'cdes:ride_group', transparent:true},{attribution:'RIDE-DF',visibility: false, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
);
*/
//Poligono das RAs

/*
//WMS LAYER: SETOR
var vsis_layersetor = new OpenLayers.Layer.WMS(
MENS_07,
HOSTNAME_WMS,
{layers: 'cdes:df_setor',transparent:true},{minScale:220000,attribution:'DF-Setores',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//WMS LAYER: QUADRAS
var vsis_layerquadras = new OpenLayers.Layer.WMS(
MENS_08,
HOSTNAME_WMS,
{layers: 'cdes:df_quadra',transparent:true},{minScale:55000,attribution:'DF-Quadras',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
);
//WMS LAYER: CONJUNTO
var vsis_layerconjunto = new OpenLayers.Layer.WMS(
MENS_09,
HOSTNAME_WMS,
{layers: 'cdes:df_conjunto',transparent:true},{minScale:15000,attribution:'DF-Conjuntos',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
);
//WMS LAYER: LOTE
var vsis_layerlote = new OpenLayers.Layer.WMS(
MENS_10,
HOSTNAME_WMS,
{layers: 'cdes:df_lote',transparent:true},{minScale:10000,attribution:'DF-Lotes',visibility: false, isBaseLayer:false,opacity:.7,displayInLayerSwitcher:true}
);
*/
vsis_map.addLayer(vsis_layeredicao);
// vsis_map.addLayers([vsis_layerosm, vsis_layerstreets,vsis_layersatellite,vsis_layerescolas,vsis_layerridegroup, vsis_layerRA, vsis_layersetor, vsis_layerquadras, vsis_layerconjunto, vsis_layerlote]);
//vsis_map.addLayers([vsis_layerosm, vsis_layerstreets,vsis_layersatellite,vsis_layerescolas, vsis_layerRA]);
//vsis_map.addLayers([vsis_layerRA,vsis_layerescolas]);
vsis_map.addLayers([vsis_layerosm,vsis_layerescolas]);
// Deixar o centro do mapa no Distrito Federal
vsis_map.setCenter(new OpenLayers.LonLat(-5330000,-1780000),10);
if(!vsis_map.getCenter()){vsis_map.zoomToMaxExtent()};
//
/*
* --------------------------------------------------------------------------
*
*                               HISTORY CONTROL
*
* --------------------------------------------------------------------------
*/
var vsis_panel = new OpenLayers.Control.Panel({div:document.getElementById('id_history')});
var vsis_history = new OpenLayers.Control.NavigationHistory({
    "previousOptions": {"title": "Anterior"},
    "nextOptions":     {"title": "Próximo"} 
});
vsis_panel.addControls([vsis_history.next,vsis_history.previous]);
vsis_map.addControls([vsis_history,vsis_panel]);
//
/*
* --------------------------------------------------------------------------
*
*                     CONTROLE TRANSPARÊNCIA LAYER RAs-DF
*
* --------------------------------------------------------------------------
*/
var vsis_controltransparencia = new OpenLayers.Control.Button({
    displayClass: 'olControlTransparencia',
    trigger: fsis_transparencia,
    type:1,
    title:MENS_11
});
var vsis_paineltransparencia = new OpenLayers.Control.Panel({displayClass:'olControlPanel'});
vsis_paineltransparencia.addControls([vsis_controltransparencia]);
vsis_map.addControl(vsis_paineltransparencia);
//
/*
* --------------------------------------------------------------------------
*
*                       INFORMACOES  LITERAIS (POPUP)
*
* --------------------------------------------------------------------------
*/
var vsis_controlpopup = new OpenLayers.Control.Button({
    displayClass:'olControlButtonInfo',
//    type:2,
    title:MENS_12,
    eventListeners:{
        'activate':fsis_ativarinfo,
        'deactivate':fsis_desativarinfo
    },
    type: OpenLayers.Control.TYPE_TOGGLE
});
vsis_paineltransparencia.addControls([vsis_controlpopup]); 
function fsis_desativarinfo(){
    if (typeof var_featureInfo != 'undefined'){var_featureInfo.destroy();}
};
function fsis_ativarinfo(){
    if (typeof var_featureInfo != 'undefined'){var_featureInfo.destroy();};
    var_featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
        url: HOSTNAME_WMS,
        title: MENS_15,
        queryVisible: true,
        eventListeners: {
                "getfeatureinfo": function(event) {
                    var htmlString = MENS_14;
                    var popup = new OpenLayers.Popup.FramedCloud(
                        MENS_13,
                        vsis_map.getLonLatFromPixel(event.xy),
                        null,
                        htmlString+event.text,
                        anchor=null,
                        closeButtonX=true
                    );
                    popup.autoSize = true;
                    popup.maxSize = new OpenLayers.Size(500,300);
                    vsis_map.addPopup(popup);
                }
        }
    });
    vsis_map.addControl(var_featureInfo);
    var_featureInfo.activate();
}
//
/*
* --------------------------------------------------------------------------
*
*           INFORMAÇÕES GERAIS DAS RAs PARA MONTAGEM DE GRÁFICOS DE
*                           CORRELAÇÃO DE INDICADORES
*
* --------------------------------------------------------------------------
*/
    if (!fsis_infogeraisRA()){return false;}

//
/*
* --------------------------------------------------------------------------
*
*     MAPA VETORIAL DAS RAs PARA ESTILIZAÇÃO DOS INDICADORES
*
* --------------------------------------------------------------------------
*/
var vsis_protocolo = new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            url: HOSTNAME_WFS,
            featureType: "ra31_df",
            featureNS: HOSTNAME + "/catalogcdes",
            srsName: "EPSG:900913",
});
vsis_featuresregioes = vsis_protocolo.read({
   callback:_CallBack
});
function _CallBack (resp) {
        try{
            if (resp.features == null) throw MENS_21 + MENS_22;
            if (resp.error != null) throw MENS_21 + MENS_22;
        }
        catch(err){
            window.alert(MENS_ERR_01 + err);
            return false;
        }
    var vsis_styleregioes = new OpenLayers.Style({
        'fillColor':'${ra_prefifo}',
        'strokeColor':'#000000',
        'fillOpacity':.85
    });
    vsis_layerregioes = new OpenLayers.Layer.Vector("layer Indicadores",{
        styleMap: new OpenLayers.StyleMap(vsis_styleregioes)
    });
    vsis_map.addLayer(vsis_layerregioes);
};
//
/*
* --------------------------------------------------------------------------
*
*      FUNCAO DE CONTROLE DA TRANSPARENCIA PARA O LAYER DAS RA's
*
* --------------------------------------------------------------------------
*/
/*
function fsis_transparencia(){
            if(vsis_layerRA.opacity === 0){
                vsis_layerRA.setOpacity(.3);
            }
            else if (vsis_layerRA.opacity === .3){
                vsis_layerRA.setOpacity(.5);
            }
            else if (vsis_layerRA.opacity === .5){
                vsis_layerRA.setOpacity(.7);
            }
            else if (vsis_layerRA.opacity === .7){
                vsis_layerRA.setOpacity(1);
            }
            else {
                vsis_layerRA.setOpacity(0);
            }
}
*/
function fsis_transparencia(){
            if(vsis_layerregioes.opacity === 0){
                vsis_layerregioes.setOpacity(.3);
            }
            else if (vsis_layerregioes.opacity === .3){
                vsis_layerregioes.setOpacity(.5);
            }
            else if (vsis_layerregioes.opacity === .5){
                vsis_layerregioes.setOpacity(.7);
            }
            else if (vsis_layerregioes.opacity === .7){
                vsis_layerregioes.setOpacity(1);
            }
            else {
                vsis_layerregioes.setOpacity(0);
            }
}
} // Fim função init()
//
function fsis_infogeraisRA(){
    vsis_base = vsis_baseindicadores[document.getElementById("Items").selectedIndex];
    var vsis_protocol2 = new OpenLayers.Protocol.HTTP({
                    url:PASTA_JSON + vsis_base[0] + '/'+ vsis_base[2],
                    format: new OpenLayers.Format.JSON({})
    });

    vsis_populacaoDF = vsis_protocol2.read({callback:_CallBackpopulacao});
        function _CallBackpopulacao(resp){
        try{
            if (resp.features == null) throw MENS_01 + MENS_22;
            if (resp.error != null) throw MENS_01 + MENS_22;
        }
        catch(err){
            window.alert(MENS_ERR_02 + err);
            return false;
        }
    }
    vsis_protocol2 = new OpenLayers.Protocol.HTTP({
                    url:PASTA_JSON + vsis_base[0] + '/' + vsis_base[3],
                    format: new OpenLayers.Format.JSON({})
    });
    vsis_percapitaDF = vsis_protocol2.read({callback:_CallBackpercapita});
        function  _CallBackpercapita(resp){
        try{
            if (resp.features == null) throw MENS_01 + MENS_22;
            if (resp.error != null) throw MENS_01 + MENS_22
        }
        catch(err){
            window.alert(MENS_ERR_03 + err);
            return false;
        }
    }
    return true;
}
/*
* --------------------------------------------------------------------------
*
* FUNCAO PARA PLOTAGEM DE GRÁFICOS DE INDICADORES DAS RAs E MAPA ESTILIZADO
*
* --------------------------------------------------------------------------
*/
function fsis_indicadores(identf){
    var vsis_protocol1, vsis_indices;
    fsis_limparpainel();
    vsis_base = vsis_baseindicadores[document.getElementById("Items").selectedIndex][0];
    vsis_protocol1 = new OpenLayers.Protocol.HTTP({
                    url:PASTA_JSON + vsis_base + '/' + identf,
                    format: new OpenLayers.Format.JSON({})
    });
    vsis_layerindicadores = new OpenLayers.Layer.Vector('Indicadores',{
                    protocol: vsis_protocol1,
                    strategies:[new OpenLayers.Strategy.Fixed()],
                    visibility:true,isBaseLayer:false,displayInLayerSwitcher:true
    });
    vsis_indices = vsis_protocol1.read({callback: _callBack2});
    function _callBack2 (vsis_indices) {
        try{
            if (vsis_indices.features == null) throw MENS_16 + identf + MENS_17 + MENS_22;
            if (vsis_indices.error != null) throw MENS_18 + identf + '. '+ MENS_22;
            if (vsis_featuresregioes.features == null) throw MENS_19 + MENS_22;
        }
        catch(err){
            window.alert(MENS_ERR_04 + err);
            return false; // retorna, não continuando a execução da função fsis_indicadores
        }
        // Variáveis locais:
                var vsis_limiarquartis = [], vsis_infosRA=[], vsis_RAsquartil=[], vsis_media, vsis_total=0, vsis_desvio, vsis_indicepercapita;
                var vsis_classespaleta = ["a","b","c","d","e","f"];  /* sistema para até 6 quartis */
                // Quartis:
                //     - classificacao das RAs dentro dos limiares dos quartis;
                //     - vsis_infosRA será composto por: [[indice,nome da RA, romano, quartil,style],[...],....];
            try{
                for (var i = 0, len = (vsis_indices.features.indicador.quartis).length; i < len; i++){
                // iniciação das variáveis de quartis.
                    vsis_limiarquartis.push([vsis_indices.features.indicador.quartis[i].qi,vsis_indices.features.indicador.quartis[i].qs]);
                    vsis_RAsquartil.push([0,"",0]);
                }
                for (var i = 0, len = ( vsis_indices.features.indices).length; i < len; i++){
                    for (var m = 0; m < vsis_percapitaDF.features.indices.length; m++){
                        // associação da renda percapita com a RA atual
                        if ( vsis_indices.features.indices[i].romano == vsis_percapitaDF.features.indices[m].romano ){
                            vsis_indicepercapita = vsis_percapitaDF.features.indices[m].indice;
                            break;
                        }
                    }
                    for (var j = 0; j < vsis_indices.features.indicador.num_quartis; j++) {
                        // identificação de cada RA em relação aos quartis.
                        if ( vsis_indices.features.indices[i].indice <= vsis_limiarquartis[j][1] ) {
                            vsis_infosRA.push([vsis_indices.features.indices[i].indice, vsis_indices.features.indices[i].RA, vsis_indices.features.indices[i].romano,j,vsis_paletaregioes[j][1],vsis_indicepercapita]);
                            vsis_RAsquartil[j][0]++;
                            break;
                        }
                    }
                    for (var k = 0; k < vsis_populacaoDF.features.indices.length; k++){
                        if ( vsis_indices.features.indices[i].romano == vsis_populacaoDF.features.indices[k].romano ){
                            vsis_RAsquartil[j][2] += vsis_populacaoDF.features.indices[k].indice;
                            // console.log(j,vsis_indices.features.indices[i].romano," ",vsis_populacaoDF.features.indices[k].romano,vsis_populacaoDF.features.indices[k].indice);
                            break;
                        }
                    }
                }
            }
            catch(err){
                window.alert(MENS_ERR_05 + MENS_23 + MENS_22);
                return false;
            }
        //console.log(vsis_RAsquartil);
        // Estatisticas e preparação da visualização:
        //      - desvio padrão dos índices;
        //      - classificar as RAs de acordo com o índice.
        for (var i= 0;i < vsis_infosRA.length;i++) vsis_total += vsis_infosRA[i][0];
        vsis_media = vsis_total/vsis_infosRA.length;
        vsis_total = 0;
        for (i = 0; i < vsis_infosRA.length; i++){
            vsis_desvio = vsis_infosRA[i][0] - vsis_media;
            vsis_total += vsis_desvio * vsis_desvio;
        }
        vsis_desvio = Math.sqrt(vsis_total/(vsis_infosRA.length));
        vsis_infosRA.sort(function(a,b){return a[0]-b[0];});
        // Cabeçalho textual da área de indicadores
        //      - para gráficos de índices desagregados e agregados
        // width="20" height="20"
        const MENS1 = '<p class="indi_titulo1">' + vsis_indices.features.indicador.titulo.substr(0,52) + '</p><hr />';
        const MENS2 = '<explicacao2><span class="indi_titulo2">Índices Desagregados:</span><br />* Medida: ' + 
                    vsis_indices.features.indicador.unidade.substr(0,75) +'<br /> * Média do indicador: ' + vsis_media.toFixed(2) + 
                    '<br /> * Desvio padrão do indicador: ' + vsis_desvio.toFixed(2) +
                    '<br /><a target="_blank" href="http://www.codeplan.df.gov.br/">Fonte: PDAD-Codeplan </a></explicacao2><br />';
        const MENS3 = '<explicacao2><span class="indi_titulo2">Índices Agregados:</span><br />* Descrição: '+ vsis_indices.features.indicador.descricao.substr(0,64) +
                    '</explicacao2>';

        document.getElementById('id_indicadores-titulo').innerHTML = '';
        document.getElementById('id_indicadores-titulo').innerHTML = MENS1;
        document.getElementById('id_indicadores-1').innerHTML = '';
        document.getElementById('id_indicadores-1').innerHTML = MENS2;
        document.getElementById('id_indicadores-2').innerHTML = '';
        document.getElementById('id_indicadores-2').innerHTML = MENS3;
        // plotar os gráficos e mostrar o mapa estilizado de acordo com os índices
        //      - duas áreas de indicadores (informações agregadas e desagregadas) e uma área do mapa
        fsis_estilizarregioes(vsis_infosRA);
        construir_grafico1 (vsis_infosRA);
        construir_grafico2 (vsis_RAsquartil);
        construir_grafico3 (vsis_RAsquartil);
        construir_grafico4 (vsis_infosRA);
    }
} /* Fim função fsis_indicadores() */
//


/*
* --------------------------------------------------------------------------
*
*    FUNCAO PARA LIMPAR AS FEATURES DO LAYER DE INDICADORES
*                        E OS INFOGRÁFICOS
*
* --------------------------------------------------------------------------
*/
function fsis_limparpainel(){
    try{
        vsis_layerregioes.removeAllFeatures();
        document.getElementById('id_indicadores-titulo').innerHTML = MENS_20;
        document.getElementById('id_indicadores-1').innerHTML = '';
        document.getElementById('id_indicadores-2').innerHTML = '';
    }
    catch(err){
        window.alert(MENS_ERR_06 + MENS_23 + MENS_22);
        return false;
    }
    return true;
}

/*
* --------------------------------------------------------------------------
*
*    FUNCAO PARA ESTILIZAR AS REGIÕES DO MAPA DE ACORDO COM OS INDICADORES
*
* --------------------------------------------------------------------------
*/


function fsis_estilizarregioes(vsis_infosRA){
 for (var i=0; i < vsis_featuresregioes.features.length; i++){
    for (var j=0; j < vsis_infosRA.length; j++){
        if (vsis_featuresregioes.features[i].attributes.romano == vsis_infosRA[j][2]){
            vsis_featuresregioes.features[i].attributes.ra_prefifo = vsis_paletaregioes2[vsis_infosRA[j][3]][1];
            break;
        }
    }
    if (j == vsis_infosRA.length){
         console.log("Erro: não encontrado especificação da situação da RA para o indicador escolhido. RA = ",vsis_featuresregioes.features[i].attributes.romano);
         vsis_featuresregioes.features[i].attributes.ra_prefifo = "#000"; /* Preto: para estilizar região do mapa referente à RA que não fora encontrada suas informações */
    }
 }
 vsis_layerregioes.addFeatures(vsis_featuresregioes.features);
}
/* --------------------------------------------------------------------------
*
*               FUNCAO INICIAÇÃO DE MENU DE INDICADORES
*
* --------------------------------------------------------------------------
*/

ddsmoothmenu.init({
mainmenuid: "smoothmenu-ajax",
//customtheme: ["#1c5a80", "#18374a"], //override default menu CSS background values? Uncomment: ["normal_background", "hover_background"]
contentsource: ["id_menus-2", PASTA_HTML + vsis_baseindicadores[0][1]] //"markup" or ["id_menus-2", "path_to_menu_file"]
});
