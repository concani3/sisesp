//
//
/*
* --------------------------------------------------------------------------
*
* DEFINICOES GLOBAIS
*
* --------------------------------------------------------------------------
*/
OpenLayers.Lang.setCode("pt-BR");
// cores para os graficos de indicadores
const CHART0 = "#2DE22D";
const CHART1 = "#237D23";
const CHART2 = "#FF7F0E";
const CHART3 = "#D62728";
const HOSTNAME = "HTTP://50.116.27.239:8080/geoserver/wms/";
var vsis_mercator = new OpenLayers.Projection("EPSG:900913");
var vsis_geographic = new OpenLayers.Projection("EPSG:4326");
var map;
var mgov_vector_format_json = new OpenLayers.Format.GeoJSON({
                'externalProjection': new OpenLayers.Projection("vsis_mercator")
});
var vector_indicador = null;
//
/*
* --------------------------------------------------------------------------
*
* FUNCAO PRINCIPAL init()
*
* --------------------------------------------------------------------------
*/
function init() {
construir_graficoinicial();
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

var mgov_vector_layer = new OpenLayers.Layer.Vector('Vetores Editáveis');
var mgov_controls_array = [
	    vsis_navigation_control,
	    new OpenLayers.Control.Attribution({div:document.getElementById('id_layers_info'),template:'Camadas Visíveis: ${layers}'}),
	    new OpenLayers.Control.PanZoomBar({}),
	    new OpenLayers.Control.LayerSwitcher({title: 'Menu de Layers','roundedCorner':true}),
//	    new OpenLayers.Control.Permalink(),
	    new OpenLayers.Control.MousePosition({prefix:'Mouse em..... lon: ',separator:',    lat: ',numDigits:4,div:document.getElementById('id_mouse')}),
	    new OpenLayers.Control.EditingToolbar(mgov_vector_layer),
	    new OpenLayers.Control.ScaleLine({}),
	    new OpenLayers.Control.Scale(),
	    new OpenLayers.Control.OverviewMap({maxRatio: 20,minRatio:6}),
	    new OpenLayers.Control.KeyboardDefaults({})
];
//
/*
* --------------------------------------------------------------------------
*
* DEFINIR O PROXY
*
* --------------------------------------------------------------------------
*/
// OpenLayers.ProxyHost = "/var/lib/tomcat6/webapps/ROOT/openlayers-cookbook/utils/proxy.php?url=";

/*
* --------------------------------------------------------------------------
* CRIAR O MAPA
* 1- Propriedades utilizadas:
*   allOverlays: allow or not the map to function without "base layers" 
*   controls: List of controls associated with the map.
*   maxExtent: {<OpenLayers.Bounds>|Array}
*   units: the map units.
*   numZoomLevels: number of zoom levels for the map.
*   projection: specify the default projection for layers added to this map.
*   displayProjection: {OpenLayers.Projection} - requires proj4js support for 
*     projections other than EPSG:4326 or EPSG:900913/EPSG:3857.
*
* 2- Metodos (funcoes) utilizadas:
*   addLayers: add the layers to the MAP.
*   zoomToMaxExtent: zoom to the full extent and recenter.
*   setCenter: set the map center (and optionally, the zoom level).
*   getCenter: {OpenLayers.LonLat}
* ---------------------------------------------------------------------------
*/
//Criar o "objeto" mapa
// This particular projection is embedded into OpenLayers, so no need for proj4js
// displayProjection - there are 3 controls which use displayProjection: ArgParser, MousePosition, Permalink. So when, for example,
// MousePosition needs to display coordinates, it checks whether displayProjection is set, and if so converts them from the map 
// projection to the displayProjection  (displayProjection too is always a projection object).
map = new OpenLayers.Map('id_map',{
    allOverlays:false,
    PanMethod: OpenLayers.Easing.Quad.easeInOut,
    panDuration:100,
    controls: mgov_controls_array,
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
* --------------------------------------------------------------------------
* HISTORY CONTROL
* --------------------------------------------------------------------------
*/
var panel = new OpenLayers.Control.Panel({div:document.getElementById('id_history')});
var history = new OpenLayers.Control.NavigationHistory({
    "previousOptions": {"title": "Anterior"},
    "nextOptions": {"title": "Próximo"} 
});
panel.addControls([history.next,history.previous]);
map.addControls([history,panel]);
//
/*
* --------------------------------------------------------------------------
* CONTROLE TRANSPARÊNCIA LAYER RAs-DF
* --------------------------------------------------------------------------
*/
var transp = new OpenLayers.Control.Button({
    displayClass: 'olControlTransparencia',
    trigger: transparencia,
    type:1,
    title:'Transparência RAs'
});
var mgov_panel = new OpenLayers.Control.Panel({displayClass:'olControlPanel'});
mgov_panel.addControls([transp]);
map.addControl(mgov_panel);
//
/*
* --------------------------------------------------------------------------
* CONTROLE INFORMACOES  LITERAIS WMSGetFeatureInfo com POPUP
* --------------------------------------------------------------------------
*/
var infos = new OpenLayers.Control.Button({
    displayClass:'olControlButtonInfo',
    type:2,
    title:'Atributos Literais',
    eventListeners:{
        'activate':ativar_funcao_info,
        'deactivate':desativar_funcao_info
    },
    type: OpenLayers.Control.TYPE_TOGGLE
});
mgov_panel.addControls([infos]); 
function desativar_funcao_info(){
    if (typeof var_featureInfo != 'undefined'){
         var_featureInfo.destroy();
    }
};
function ativar_funcao_info(){
if (typeof var_featureInfo != 'undefined'){
var_featureInfo.destroy();
};
var_featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
    url: HOSTNAME,
    title: 'features by clicking',
    queryVisible: true,
    eventListeners: {
        "getfeatureinfo": function(event) {
            var htmlString = '<p class="popup">Informações Literais:</p>';
            var popup = new OpenLayers.Popup.FramedCloud(
                'geoinformacao',
                map.getLonLatFromPixel(event.xy),
                null,
                htmlString+event.text,
                anchor=null,
                closeButtonX=true
            );
            popup.autoSize = true;
            popup.maxSize = new OpenLayers.Size(500,300);
            map.addPopup(popup);
        }
    }
})
map.addControl(var_featureInfo);
var_featureInfo.activate();
}

/*
* -------------------------------------------------------------------------
* DEFINIR OS LAYERS DO MAPA
* --------------------------------------------------------------------------
*/
//===== BASE MAPS
//OpenStreetMap
var wms_map_osm = new OpenLayers.Layer.OSM(
"OpenStreetMap Layer"
);
/*
//Google streets is the normal map type, so we don't need to pass in a type
var mgov_google_streets = new OpenLayers.Layer.Google(
"Google Streets Layer",{attribution:"Google Streets"}
);
//Camada do "tipo" Google satellite
var mgov_google_satellite = new OpenLayers.Layer.Google(
"Google Satellite Layer",
{type: google.maps.MapTypeId.SATELLITE,attribution:"Google Satellite"}
);
*/
//
/*
* --------------------------------------------------------------------------
* DEFINIR OS "OVERLAYS MAPS"
* 1- Parâmetros (server side):
*   layers: Layers names required from server
* 2- Propriedades/Opções (client side):
*   visibility: the layer should be displayed in the map.
*   opacity: the layer's opacity.
*   isBaseLayer: whether or not the layer is a base layer.
*   displayInLayerSwitcher:  display the layer's name in the layer switcher.
* --------------------------------------------------------------------------
*/
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

var wms_layer_ride_group = new OpenLayers.Layer.WMS(
'Ride-DF',
HOSTNAME,
{layers: 'cdes:ride_group', transparent:true},{attribution:'RIDE-DF',visibility: false, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
);

//WMS LAYER: Poligono do GDF
wms_layer_pdad_pol = new OpenLayers.Layer.WMS(
'DF:RAs',
HOSTNAME,
{layers: 'cdes:ra31_df',transparent:true},{attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);

//WMS LAYER: SETOR
wms_layer_setor = new OpenLayers.Layer.WMS(
'DF:Setor',
HOSTNAME,
{layers: 'cdes:df_setor',transparent:true},{minScale:220000,attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);

//WMS LAYER: QUADRAS
wms_layer_quadras = new OpenLayers.Layer.WMS(
'DF:Quadra',
HOSTNAME,
{layers: 'cdes:df_quadra',transparent:true},{minScale:55000,attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
);

//WMS LAYER: CONJUNTO
wms_layer_conjunto = new OpenLayers.Layer.WMS(
'DF:Conjunto',
HOSTNAME,
{layers: 'cdes:df_conjunto',transparent:true},{minScale:15000,attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
);

//WMS LAYER: LOTE
wms_layer_lote = new OpenLayers.Layer.WMS(
'DF:Lote',
HOSTNAME,
{layers: 'cdes:df_lote',transparent:true},{minScale:10000,attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:.7,displayInLayerSwitcher:true}
);
//
//
/*
* --------------------------------------------------------------------------
*
* ADICIONAR OS BASE MAPS, OVERLAYS MAPS E LAYER DE EDICAO VETORIAL AO MAPA
*	
* --------------------------------------------------------------------------
*/
map.addLayer(mgov_vector_layer);
map.addLayers([wms_map_osm, wms_layer_ride_group, wms_layer_pdad_pol, wms_layer_setor, wms_layer_quadras, wms_layer_conjunto, wms_layer_lote]);
// Deixar o centro do mapa no Distrito Federal
map.setCenter(new OpenLayers.LonLat(-5330000,-1780000),10);
if(!map.getCenter()){map.zoomToMaxExtent()};
}
//
/*
* --------------------------------------------------------------------------
*
*      FUNCAO DE CONTROLE DA TRANSPARENCIA PARA O LAYER DAS RA's
*
* --------------------------------------------------------------------------
*/
function transparencia(){
            if(wms_layer_pdad_pol.opacity === 0){
                wms_layer_pdad_pol.setOpacity(.3);
            }
            else if (wms_layer_pdad_pol.opacity === .3){
                wms_layer_pdad_pol.setOpacity(.5);
            }
            else if (wms_layer_pdad_pol.opacity === .5){
                wms_layer_pdad_pol.setOpacity(.7);
            }
            else if (wms_layer_pdad_pol.opacity === .7){
                wms_layer_pdad_pol.setOpacity(1);
            }
            else {
                wms_layer_pdad_pol.setOpacity(0);
            }
}

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
   '0':{'fillColor':CHART0,'fillOpacity':1,'strokeColor':'#000000','strokeWidth':2,'pointRadius':10,'label':'${indice}','cursor':'pointer','graphicName':'square'},
   '1':{'fillColor':CHART1,'fillOpacity':1,'strokeColor':'#000000','strokeWidth':2,'pointRadius':15,'label':'${indice}','cursor':'pointer','graphicName':'triangle','labelYOffset':-8},
   '2':{'fillColor':CHART2,'fillOpacity':1,'strokeColor':'#000000','strokeWidth':3,'pointRadius':20,'label':'${indice}','cursor':'pointer','graphicName':'circle'},
   '3':{'fillColor':CHART3,'fillOpacity':1,'strokeColor':'#000000','strokeWidth':3,'pointRadius':28,'label':'${indice}','cursor':'pointer','graphicName':'star','labelYOffset':-4,'graphicTitle':'oi','fontOpacity':0}
};
// ---------------------------------------------------------------------------------------------------------------------------------------------------
if (vector_indicador != null) {
  vector_indicador.destroyFeatures();
  map.removeLayer(vector_indicador);
  protocol1.destroy();
}
else {
  vector_style_map = new OpenLayers.StyleMap({});
  vector_style_map.addUniqueValueRules('default','nivel',vsis_arraysymbolizers);
}
protocol1 = new OpenLayers.Protocol.HTTP({
                    url:'data_json/'+vsis_arrayindicadores2[vsis_arrayindicadores[identf]][1],
                    format: mgov_vector_format_json
});
vector_indicador = new OpenLayers.Layer.Vector('Indicadores',{
                     protocol: protocol1,
                     strategies:[new OpenLayers.Strategy.Fixed()],
                     visibility: true,isBaseLayer:false,displayInLayerSwitcher:true
});
vector_indicador.styleMap = vector_style_map;
map.addLayer(vector_indicador);
// esperar o carregamento do arquivo
vector_indicador.events.on({
      "loadend": function(e){
             console.log(e.object.features.length);
      fsis_visualizar_indicadores(vsis_arrayindicadores2[vsis_arrayindicadores[identf]][0]);
}});}
function fsis_visualizar_indicadores(nome_indicador){
// ----------------------------------------------------------------------------------------------------
    var i=0, infos_RA=[], quartil=[[0,"Índice Baixo"],[0,"Índice Médio-Baixo"],[0,"Índice Médio-Alto"],[0,"Índice Alto"]];
    console.log('-----  ' + vector_indicador.features[0].attributes.unidade);
    for (var i = 0,len = (vector_indicador.features).length; i < len; i++){
        infos_RA.push([vector_indicador.features[i].attributes.indice,vector_indicador.features[i].attributes.RA,
    	    vector_indicador.features[i].attributes.nivel]);
    	    // calculo dos quartis do indicador
    	    switch (infos_RA[i][2]){
    	            case 0:
    	            	quartil[0][0]++;
    	            	infos_RA[i][3]="chart0";
    		        break;
    	            case 1:
    	            	quartil[1][0]++;
    	            	infos_RA[i][3]="chart1";
    	    		break;
    	            case 2:
    	            	quartil[2][0]++;
    	            	infos_RA[i][3]="chart2";
    	            	break;
    	            case 3:
    	            	quartil[3][0]++;
    	            	infos_RA[i][3]="chart3";
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
    vector_indicador.features[0].attributes.unidade +'<br /> * Média do indicador: ' + media.toFixed(2) + '<br /> * Desvio padrão do indicador: ' + desvio_pa.toFixed(2) + '<br /><a target="_blank" href="http://www.codeplan.df.gov.br/">Fonte: PDAD-Codeplan </a><br /></style><hr />';
    document.getElementById('id_indicadores-1').innerHTML = display_text;

    // classificar o array em ordem numérica
    infos_RA.sort(function(a,b){
	return a[0]-b[0];});
    var estilo_chart;
    estilo_chart = "chart0";
    console.log(infos_RA);
    console.log(quartil);
    construir_grafico1 (infos_RA);
    construir_grafico2 (quartil);
// ----------------------------------------------------------------------------------------------------

}

ddsmoothmenu.init({
mainmenuid: "smoothmenu-ajax",
//customtheme: ["#1c5a80", "#18374a"], //override default menu CSS background values? Uncomment: ["normal_background", "hover_background"]
contentsource: ["id_container", "sisesp_menu.html"] //"markup" or ["id_container", "path_to_menu_file"]
});