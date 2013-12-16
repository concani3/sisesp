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
const QUARTILINDEFINIDO = "#000";
// Mensagens de erro da aplicação
const MENS_ERR_01 = "Erro 01: ";
const MENS_ERR_02 = "Erro 02: ";
const MENS_ERR_03 = "Erro 03: ";
const MENS_ERR_04 = "Erro 04: ";
const MENS_ERR_05 = "Erro 05: ";
const MENS_ERR_06 = "Erro 06: ";
const MENS_ERR_07 = "Erro 07: ";
const MENS_ERR_08 = "";
// Mensagens gerais da aplicação
const MENS_01 = "problemas no carregamento dos arquivos de Informações Gerais.";
const MENS_02 = "OpenStreetMap";
const MENS_03 = "Google Streets";
const MENS_04 = "Google Satellite";
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
const MENS_24 = "DF:Escolas Públicas";
const MENS_25 = "DF:Saúde Pública";
const MENS_26 = "DF:Segurança Pública";
const MENS_27 = "problemas no arquivo JSON das regiões -- falta entrada para uma região do mapa: ";
const MENS_28 = "OSGeo";
const MENS_29 = "MapQuest Open";
//
var vsis_map, vsis_populacao, vsis_percapita;
var vsis_mercator = new OpenLayers.Projection("EPSG:900913");
var vsis_geographic = new OpenLayers.Projection("EPSG:4326");
var vsis_layerindicadores = null, vsis_layerregioes = null;
var vsis_featuresregioes;
var vsis_paletaregioes = [[0,"chart0"],[1,"chart1"],[2,"chart2"],[3,"chart3"],[4,"chart4"],[5,"chart5"],[6,"chartindefinido"]]; //  indice não definido no JSON
var vsis_paletaregioes2 = [[0,QUARTIL0],[1,QUARTIL1],[2,QUARTIL2],[3,QUARTIL3],[4,QUARTIL4],[5,QUARTIL5],[6,QUARTILINDEFINIDO]]; // último elemento sempre para ser utilizado quando indice não definido no JSON
    // vsis_baseindicadores:  base de dados das pesquisas com os indicadores.
    // campos: [subdiretorio da pasta arquivos JSON que contém os indicadores, nome arquivo do menu, arquivo de populacao, arquivo renda per capita,layer da região]]
var vsis_baseindicadores = [
                            ["pdad_2011",
                             "sisesp_menupdad2011.html",
                             "2011_pdad_indicador_populacao.json",
                             "2011_pdad_indicador_renda_percapita.json",
                             "ra31_df"
                            ],
                            ["pdad_2013",
                             "sisesp_menupdad2013.html",
                             "2013_pdad_indicador_populacao.json",
                             "2013_pdad_indicador_renda_percapita.json",
                             "ra31_df"
                            ],
                            ["ride",
                             "sisesp_menuride.html",
                             "2010_ride_indicador_populacao.json",
                             "2010_ride_indicador_renda_percapita.json",
                             "ride_df"
                            ]
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
OpenLayers.Util.onImageLoadErrorColor = 'transparent';
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
vsis_map = new OpenLayers.Map();
/*
vsis_map = new OpenLayers.Map('id_map',{
    allOverlays:false,
    PanMethod: OpenLayers.Easing.Quad.easeInOut,
    panDuration:90,
    controls: vsis_controlsarray,
    maxExtent: new OpenLayers.Bounds(
    -5501341.25,
    -1961522.68,
    -5118442.68,
    -1629571.93),
    units: 'm',
    numZoomLevels: 26,
    projection: vsis_mercator,
//    displayProjection: vsis_mercator
    displayProjection: vsis_geographic
});
*/
//
/*
* -------------------------------------------------------------------------
*
*                              LAYERS
*
* --------------------------------------------------------------------------
*/
//
var vsis_layermapquest = new OpenLayers.Layer.OSM(MENS_29,
                                           ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"],
                                            {attribution: MENS_29 }
);
//Osgeo
var vsis_layerosgeo = new OpenLayers.Layer.WMS(
    MENS_28,
    'http://vmap0.tiles.osgeo.org/wms/vmap0',
    {layers: 'basic'},
    {}
);
//OpenStreetMap
var vsis_layerosm = new OpenLayers.Layer.OSM(
MENS_02
);
//
/*
//Google streets
var vsis_layerstreets = new OpenLayers.Layer.Google(
MENS_03,{attribution:MENS_03}
);
//Google satellite
var vsis_layersatellite = new OpenLayers.Layer.Google(
MENS_04,
{type: google.maps.MapTypeId.SATELLITE,attribution: MENS_04}
);
*/
//RIDE
var vsis_layerridegroup = new OpenLayers.Layer.WMS(
MENS_05,
HOSTNAME_WMS,
{layers: 'cdes:ride_group', transparent:true},{attribution:'RIDE-DF',visibility: false, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
);
//Poligono das RAs
var vsis_layerRA = new OpenLayers.Layer.WMS(
MENS_06,
HOSTNAME_WMS,
{layers: 'cdes:ra31_df',transparent:true},{attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//Malha das regiões censitárias (IBGE) do DF 
var vsis_layercenso = new OpenLayers.Layer.WMS(
'Malha censo-DF',
HOSTNAME_WMS,
{layers: 'cdes:malhacenso',transparent:true},{minScale:440000,attribution:'Malha Censitária-DF',visibility: false, isBaseLayer:false,opacity:.7,displayInLayerSwitcher:true}
);
// Densidade Populacional
var vsis_layerpopGO = new OpenLayers.Layer.WMS(
'Dens. Pop-2010/GO',
'http://www.geoservicos.ibge.gov.br/geoserver/CGEO/wms',
{layers: 'CGEO:C04_DensidPop2010_GO', transparent:true},{attribution:'Dens. População/GO',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
// Densidade Populacional
var vsis_layerpopDF = new OpenLayers.Layer.WMS(
'Dens. Pop-2010/DF',
'http://www.geoservicos.ibge.gov.br/geoserver/CGEO/wms',
{layers: 'CGEO:C04_DensidPop2010_DF', transparent:false},{attribution:'Dens. População/DF',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
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
//ESCOLAS PUBLICAS-DF
var vsis_escolaspublicasDF = new OpenLayers.Layer.WMS(
MENS_24,
HOSTNAME_WMS,
{layers: 'cdes:escolas_df',transparent:true},{minScale:220000,attribution:'DF-Escolas Públicas',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//EQUIPAMENTOS PÚBLICOS DE SAÚDE-DF
var vsis_equipamentossaudeDF = new OpenLayers.Layer.WMS(
MENS_25,
HOSTNAME_WMS,
{layers: 'cdes:saude_df',transparent:true},{minScale:220000,attribution:'DF-Saúde Pública',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//EQUIPAMENTOS DE SEGURANÇA PÚBLICA-DF
var vsis_segurancapublicaDF = new OpenLayers.Layer.WMS(
MENS_26,
HOSTNAME_WMS,
{layers: 'cdes:seguranca_df',transparent:true},{minScale:220000,attribution:'DF-Segurança Pública',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//
/*
* --------------------------------------------------------------------------
*
*     CRIAR MAPA VETORIAL DAS RAs PARA ESTILIZAÇÃO DOS INDICADORES
*
* --------------------------------------------------------------------------
*/
    var vsis_styleregioes = new OpenLayers.Style({
        'fillColor':'${ra_prefifo}',
        'strokeColor':'#000000',
        'fillOpacity':.85
    });
    vsis_layerregioes = new OpenLayers.Layer.Vector("layer Indicadores",{
        styleMap: new OpenLayers.StyleMap(vsis_styleregioes)
    });

/*
* --------------------------------------------------------------------------
*
*                       ADICIONAR OS LAYERS AO MAPA
*
* --------------------------------------------------------------------------
*/
vsis_map.addLayers([vsis_layermapquest, vsis_layerosm, vsis_layerosgeo, vsis_layerpopDF,vsis_layerpopGO,vsis_layerregioes, vsis_layerridegroup, vsis_layerRA,
                    vsis_layercenso, vsis_layersetor, vsis_layerquadras, vsis_layerconjunto, vsis_layerlote, vsis_escolaspublicasDF, vsis_equipamentossaudeDF, vsis_segurancapublicaDF]);
vsis_map.addLayer(vsis_layeredicao);
// Deixar o centro do mapa no Distrito Federal
vsis_map.setCenter(new OpenLayers.LonLat(-5330000,-1780000),10);
if(!vsis_map.getCenter()){vsis_map.zoomToMaxExtent()};
/*
vsis_map.addLayer(new OpenLayers.Layer.OSM("MapQuest Open",
                                           ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"],
                                            {attribution: "Mapquest" }
));
*/

new GeoExt.MapPanel({
        renderTo: 'id_map',
        map: vsis_map,
        border:false,
        zoom:13
});

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
} // fim funcao init()
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
