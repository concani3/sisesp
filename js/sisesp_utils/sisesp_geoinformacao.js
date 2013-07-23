//
/*
* --------------------------------------------------------------------------
*
* DEFINICOES GLOBAIS
*
* --------------------------------------------------------------------------
*/
OpenLayers.Lang.setCode("pt-BR");
const HOSTNAME = "HTTP://50.116.27.239:8080/geoserver/wms/";
var vsis_map;
var vsis_mercator = new OpenLayers.Projection("EPSG:900913");
var vsis_geographic = new OpenLayers.Projection("EPSG:4326");
var vsis_formatjson = new OpenLayers.Format.GeoJSON({
    'externalProjection': new OpenLayers.Projection("vsis_mercator")});
var vsis_layerindicadores = null, vsis_layerregioes = null;
var vsis_featuresregioes;
// cores para os graficos de indicadores
const CHART0 = "#2DE22D";
const CHART1 = "#237D23";
const CHART2 = "#FF7F0E";
const CHART3 = "#D62728";
var vsis_coresregioes = [[0,CHART0],[1,CHART1],[2,CHART2],[3,CHART3]];

//
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
	    new OpenLayers.Control.Attribution({div:document.getElementById('id_layers_info'),template:'Camadas Visíveis: ${layers}'}),
	    new OpenLayers.Control.PanZoomBar({}),
	    new OpenLayers.Control.LayerSwitcher({title: 'Menu de Layers','roundedCorner':true}),
//	    new OpenLayers.Control.Permalink(),
	    new OpenLayers.Control.MousePosition({prefix:'Mouse em..... lon: ',separator:',    lat: ',numDigits:4,div:document.getElementById('id_mouse')}),
	    new OpenLayers.Control.EditingToolbar(vsis_layeredicao),
	    new OpenLayers.Control.ScaleLine({}),
	    new OpenLayers.Control.Scale(),
	    new OpenLayers.Control.OverviewMap({maxRatio: 20,minRatio:6}),
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
    panDuration:100,
    controls: vsis_controlsarray,
    maxExtent: new OpenLayers.Bounds(
    -5501341.250,
    -1961522.658,
    -5149730.919,
    -1634372.177),
    units: 'm',
    numZoomLevels: 26,
    projection: vsis_mercator,
//    displayProjection: vsis_mercator
    displayProjection: vsis_geographic
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
"OpenStreetMap Layer"
);
//
//Google streets
var vsis_layerstreets = new OpenLayers.Layer.Google(
"Google Streets Layer",{attribution:"Google Streets"}
);
//Google satellite
var vsis_layersatellite = new OpenLayers.Layer.Google(
"Google Satellite Layer",
{type: google.maps.MapTypeId.SATELLITE,attribution:"Google Satellite"}
);
//RIDE
var vsis_layerridegroup = new OpenLayers.Layer.WMS(
'Ride-DF',
HOSTNAME,
{layers: 'cdes:ride_group', transparent:true},{attribution:'RIDE-DF',visibility: false, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
);
//Poligono das RAs
vsis_layerRA = new OpenLayers.Layer.WMS(
'DF:RAs',
HOSTNAME,
{layers: 'cdes:ra31_df',transparent:true},{attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//WMS LAYER: SETOR
vsis_layersetor = new OpenLayers.Layer.WMS(
'DF:Setor',
HOSTNAME,
{layers: 'cdes:df_setor',transparent:true},{minScale:220000,attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//WMS LAYER: QUADRAS
vsis_layerquadras = new OpenLayers.Layer.WMS(
'DF:Quadra',
HOSTNAME,
{layers: 'cdes:df_quadra',transparent:true},{minScale:55000,attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
);
//WMS LAYER: CONJUNTO
vsis_layerconjunto = new OpenLayers.Layer.WMS(
'DF:Conjunto',
HOSTNAME,
{layers: 'cdes:df_conjunto',transparent:true},{minScale:15000,attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
);
//WMS LAYER: LOTE
vsis_layerlote = new OpenLayers.Layer.WMS(
'DF:Lote',
HOSTNAME,
{layers: 'cdes:df_lote',transparent:true},{minScale:10000,attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:.7,displayInLayerSwitcher:true}
);
//
//WMS Layer: Zonas Censitárias do DF (pelo IBGE)
//var wms_layer_cen = new OpenLayers.Layer.WMS(
// 'DF:Zonas Censitarias',
// 'http://192.168.1.102:8085/geoserver/wms/',
//{layers: 'cdes:53see250gc_sir'},{attribution:'Zonas Censitárias',visibility: false, isBaseLayer:false,opacity:.3,displayInLayerSwitcher:true}
//);
//
//WMS Layer: RIDE-DF
//var wms_layer_ride_df = new OpenLayers.Layer.WMS(
//'DF:Ride',
//HOSTNAME,
//{layers: 'cdes:ride_df', transparent:true},{attribution:'RIDE-DF',visibility: false, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
//);
//
//var wms_layer_municipios_ride = new OpenLayers.Layer.WMS(
//'DF:Mun_Ride',
//HOSTNAME,
//{layers: 'cdes:municipios_ride', transparent:true},{attribution:'MUN_RIDE-DF',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
//);
//
vsis_map.addLayer(vsis_layeredicao);
vsis_map.addLayers([vsis_layerosm, vsis_layerstreets,vsis_layersatellite,vsis_layerridegroup, vsis_layerRA, vsis_layersetor, vsis_layerquadras, vsis_layerconjunto, vsis_layerlote]);
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
    title:'Transparência RAs'
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
    type:2,
    title:'Atributos Literais',
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
	url: HOSTNAME,
	title: 'features by clicking',
	queryVisible: true,
	eventListeners: {
    	    "getfeatureinfo": function(event) {
        	var htmlString = '<p class="popup">Informações Literais:</p>';
        	var popup = new OpenLayers.Popup.FramedCloud(
            	    'geoinformacao',
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
*     MAPA VETORIAL DAS RAs PARA ESTILIZAÇÃO DOS INDICADORES
*
* --------------------------------------------------------------------------
*/
var vsis_protocolo = new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            url: "HTTP://50.116.27.239:8080/geoserver/wfs",
            featureType: "ra31_df",
            featureNS: "http://50.116.27.239/catalogcdes",
            srsName: "EPSG:900913",
});
vsis_featuresregioes = vsis_protocolo.read({
   callback:_CallBack
});
function _CallBack (resp) {
    var vsis_styleregioes = new OpenLayers.Style({
	'fillColor':'${ra_prefifo}',
	'strokeColor':'#000000',
    	'fillOpacity':1
    });
    vsis_layerregioes = new OpenLayers.Layer.Vector("layer Indicadores",{
	styleMap: new OpenLayers.StyleMap(vsis_styleregioes)
    });
    vsis_map.addLayer(vsis_layerregioes);
};
}  // Fim função init()
//
/*
* --------------------------------------------------------------------------
*
*      FUNCAO DE CONTROLE DA TRANSPARENCIA PARA O LAYER DAS RA's
*
* --------------------------------------------------------------------------
*/
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
//
/*
* --------------------------------------------------------------------------
*
*           FUNCAO DE CONTROLE DAS MARCAS DE INDICADORES
*
* --------------------------------------------------------------------------
*/
function fsis_indicadores(identf){
var vsis_arrayindicadores = {"escolaridade":0,"bandalarga":1,"cor":2,"bancaria":3,"renda":4};
var vsis_arrayindicadores2 = [
                          ["ESCOLARIDADE","data_indicador_escolaridade.json"],
                          ["BANDA LARGA","data_indicador_bandalarga.json"],
                          ["TEZ DA PELE","data_indicador_cor.json"],
                          ["EXCLUSÃO BANCÁRIA","data_indicador_bancaria.json"],
                          ["RENDA","data_indicador_renda.json"]
];
var vsis_arraysymbolizers = {
   '0':{'fillColor':CHART0,'fillOpacity':0,'strokeColor':'#000000','strokeWidth':0,'pointRadius':8,'label':'${indice}','cursor':'pointer','graphicName':'square'},
   '1':{'fillColor':CHART1,'fillOpacity':0,'strokeColor':'#000000','strokeWidth':0,'pointRadius':8,'label':'${indice}','cursor':'pointer','graphicName':'square'},
   '2':{'fillColor':CHART2,'fillOpacity':0,'strokeColor':'#000000','strokeWidth':0,'pointRadius':8,'label':'${indice}','cursor':'pointer','graphicName':'square'},
   '3':{'fillColor':CHART3,'fillOpacity':0,'strokeColor':'#000000','strokeWidth':0,'pointRadius':8,'label':'${indice}','cursor':'pointer','graphicName':'square'}
};
// ---------------------------------------------------------------------------------------------------------------------------------------------------
if (vsis_layerindicadores != null) {
  vsis_layerindicadores.destroyFeatures();
  vsis_map.removeLayer(vsis_layerindicadores);
  protocol1.destroy();
}
else {
  vector_style_map = new OpenLayers.StyleMap({});
  vector_style_map.addUniqueValueRules('default','nivel',vsis_arraysymbolizers);
}
protocol1 = new OpenLayers.Protocol.HTTP({
                    url:'data_json/'+vsis_arrayindicadores2[vsis_arrayindicadores[identf]][1],
                    format: vsis_formatjson
});
vsis_layerindicadores = new OpenLayers.Layer.Vector('Indicadores',{
                     protocol: protocol1,
                     strategies:[new OpenLayers.Strategy.Fixed()],
                     visibility:true,isBaseLayer:false,displayInLayerSwitcher:true
});
vsis_layerindicadores.styleMap = vector_style_map;
vsis_map.addLayer(vsis_layerindicadores);
// esperar o carregamento do arquivo
vsis_layerindicadores.events.on({
      "loadend": function(e){
             // console.log(e.object.features.length);
      fsis_visualizar_indicadores(vsis_arrayindicadores2[vsis_arrayindicadores[identf]][0]);
}});}
function fsis_visualizar_indicadores(nome_indicador){
// ----------------------------------------------------------------------------------------------------
    var i=0, infos_RA=[], quartil=[[0,"Índice Baixo"],[0,"Índice Médio-Baixo"],[0,"Índice Médio-Alto"],[0,"Índice Alto"]];
    for (var i = 0,len = (vsis_layerindicadores.features).length; i < len; i++){
    	infos_RA.push([vsis_layerindicadores.features[i].attributes.indice,vsis_layerindicadores.features[i].attributes.RA,
    	    vsis_layerindicadores.features[i].attributes.nivel,vsis_layerindicadores.features[i].attributes.romano]);
    	    // calculo dos quartis do indicador
    	    switch (infos_RA[i][2]){
    	            case 0:
    	            	quartil[0][0]++;
    	            	infos_RA[i][4]="chart0";
    		        break;
    	            case 1:
    	            	quartil[1][0]++;
    	            	infos_RA[i][4]="chart1";
    	    		break;
    	            case 2:
    	            	quartil[2][0]++;
    	            	infos_RA[i][4]="chart2";
    	            	break;
    	            case 3:
    	            	quartil[3][0]++;
    	            	infos_RA[i][4]="chart3";
    	            	break;
    	            default:
    	            	console.log("Erro na identificacao dos quartis");
    	                break;
    	        }

    };
    // calculo do desvio padrao
    var total = 0;
    for (var i= 0;i < infos_RA.length;i++) total += infos_RA[i][0];
    var media = total/infos_RA.length;
    total = 0;
    for (i = 0; i < infos_RA.length; i++){
    var desvio = infos_RA[i][0] - media;
    total += desvio * desvio;
    }
    var desvio_pa = Math.sqrt(total/(infos_RA.length));
    document.getElementById('id_indicadores-titulo').innerHTML = '';
    var display_text = '<texto style="font-size:1.7em;"><strong><center>' + nome_indicador + '</center></strong></style><hr />';
    document.getElementById('id_indicadores-titulo').innerHTML = display_text;
    document.getElementById('id_indicadores-1').innerHTML = '';
    
    var display_text = '<texto style="font-size:1.2em;"><strong>Índices desagregados por RA</strong></style><br /><texto style="font-size:0.8em;"> * Medida: ' + 
    vsis_layerindicadores.features[0].attributes.unidade +'<br /> * Média do indicador: ' + media.toFixed(2) + '<br /> * Desvio padrão do indicador: ' + desvio_pa.toFixed(2) + '<br /><a target="_blank" href="http://www.codeplan.df.gov.br/">Fonte: PDAD-Codeplan </a><br /></style><hr />';
    document.getElementById('id_indicadores-1').innerHTML = display_text;

    // classificar o array em ordem numérica
    infos_RA.sort(function(a,b){
	return a[0]-b[0];});
    var estilo_chart;
    estilo_chart = "chart0";
    fsis_estilizarregioes(infos_RA);
    construir_grafico1 (infos_RA);
    construir_grafico2 (quartil);
}
//
/*
* --------------------------------------------------------------------------
*
*           FUNCAO DE CONTROLE DAS MARCAS DE INDICADORES
*
* --------------------------------------------------------------------------
*/


function fsis_estilizarregioes(infos_RA){
 for (var i=0; i < vsis_featuresregioes.features.length; i++){
    for (var j=0; j < infos_RA.length; j++){
        if (vsis_featuresregioes.features[i].attributes.romano == infos_RA[j][3]){
            vsis_featuresregioes.features[i].attributes.ra_prefifo = vsis_coresregioes[infos_RA[j][2]][1];
    	    break;
        }
    }
    if (j == infos_RA.length){console.log("Erro: não encontrado especificação da situação da RA para o indicador escolhido. RA = ",vsis_featuresregioes.features[i].attributes.romano);}
 }
 vsis_layerregioes.addFeatures(vsis_featuresregioes.features);
}

ddsmoothmenu.init({
mainmenuid: "smoothmenu-ajax",
//customtheme: ["#1c5a80", "#18374a"], //override default menu CSS background values? Uncomment: ["normal_background", "hover_background"]
contentsource: ["id_container", "sisesp_menu.html"] //"markup" or ["id_container", "path_to_menu_file"]
});
