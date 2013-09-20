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
//
const EDITARATRIBUTOS = true;
const NAO_EDITARATRIBUTOS = false;
// Equipamentos: threshold para sair do modo cluster dos equipamentos públicos.
const CLUSTER_SCALE_THRESHOLD = 60000;
// Mensagens de erro da aplicação
const MENS_ERR_01 = "Erro 01: ";
const MENS_ERR_02 = "Erro 02: ";
const MENS_ERR_03 = "Erro 03: ";
const MENS_ERR_04 = "Erro 04: ";
const MENS_ERR_05 = "Erro 05: ";
const MENS_ERR_06 = "Erro 06: ";
const MENS_ERR_07 = "Erro 07: ";
//
// Mensagens gerais da aplicação
const MENS_01 = "problemas no carregamento dos arquivos de Informações Gerais.";
const MENS_02 = "OpenStreetMap";
const MENS_03 = "Google Streets";
const MENS_04 = "Google Satellite";
const MENS_05 = "DF - RIDE";
const MENS_06 = "DF - Limites RAs";
const MENS_07 = "DF - Setor";
const MENS_08 = "DF - Quadra";
const MENS_09 = "DF - Conjunto";
const MENS_10 = "DF - Lote";
const MENS_11 = "Transparência layer de Indicadores";
const MENS_12 = "Atributos Literais";
const MENS_13 = "geoinformação";
const MENS_14 = "<p class='popup'>Informações Literais:</p>";
const MENS_15 = "Features by clicking";
const MENS_16 = "arquivo ";
const MENS_17 = " não encontrado.";
const MENS_18 = "problemas no carregamento do arquivo ";
const MENS_19 = "problemas com a geometria das regiões. ";
const MENS_20 = "Indicadores Sociais";
const MENS_21 = "problemas no carregamento WFS.";
const MENS_22 = "Execução interrompida!";
const MENS_23 = "inconsistência nos dados dos indicadores ou da geometria.";
const MENS_24 = "DF:Escolas Públicas";
const MENS_25 = "DF:Saúde Pública";
const MENS_26 = "DF:Segurança Pública";
const MENS_27 = "problemas no arquivo JSON das regiões -- falta entrada para uma região do mapa: ";
const MENS_28 = "OSGeo";
const MENS_29 = "MapQuest Open";
const MENS_30 = "Equipamentos Públicos";
const MENS_31 = "Criar Ponto";
const MENS_32 = "Deletar Ponto";
const MENS_33 = "Salvar Pontos";
const MENS_34 = "Layer Comunidade";
const MENS_35 = "Layer Indicadores";
const MENS_36 = "Features salvas!  Transação completada com sucesso!";
const MENS_37 = "Não foi possivel salvar as features!  Transação cancelada: um erro ocorreu durante a operação!";
const MENS_38 = "Todos os controles associados a visualização de atributos estão desligados.";
const MENS_39 = "Controle de visualização de atributos ligado. Habilitado para o layer: ";
const MENS_40 = "Layer Básico alterado para:  ";
const MENS_41 = "DF - Malha Censo IBGE";
const MENS_42 = "Alterou característica do Layer: ";
const MENS_43 = ".  Propriedade alterada: ";
const MENS_44 = "Anterior";
const MENS_45 = "Próximo";
const MENS_46 = "Erro! Inconsistência no controle da visibilidade dos dados literais das features.  Relatar ao administrador";
const MENS_47 = "Pontos";
//
var vsis_map, vsis_populacao, vsis_percapita, vsis_botaoInfo = false,vsis_controlFeatureComunidade, vsis_featureInfo, vsis_selectEquipamentos, vsis_timeOut;
var vsis_featureSelected = null;
var vsis_mercator = new OpenLayers.Projection("EPSG:900913");
var vsis_geographic = new OpenLayers.Projection("EPSG:4326");
var vsis_layerindicadores = null, vsis_layerComunidade = null, vsis_layerregioes = null;
var vsis_featuresregioes;
var vsis_paletaregioes = [[0,"chart0"],[1,"chart1"],[2,"chart2"],[3,"chart3"],[4,"chart4"],[5,"chart5"],[6,"chartindefinido"]]; //  indice não definido no JSON
var vsis_paletaregioes2 = [[0,QUARTIL0],[1,QUARTIL1],[2,QUARTIL2],[3,QUARTIL3],[4,QUARTIL4],[5,QUARTIL5],[6,QUARTILINDEFINIDO]]; // último elemento sempre para ser utilizado quando indice não definido no JSON
    // vsis_baseindicadores:  base de dados das pesquisas com os indicadores.
    // campos: [subdiretorio da pasta arquivos JSON que contém os indicadores, nome arquivo do menu, arquivo de populacao, arquivo renda per capita,layer da região]]
// estilo para os clusters de equipamentos: [estilo para cluster, estilo para feature, layer referente ao equipamento, cor]
var vsis_listaEquipamentos = [
        [null,null,null,"#45acf2"], // escolas
        [null,null,null,"#aaa"],    // segurança
        [null,null,null,"#f24555"]  // saúde
];
//
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

/*
* --------------------------------------------------------------------------
*
* FUNCAO PRINCIPAL init()
*
* --------------------------------------------------------------------------
*/

function init() {
// definição de variáveis
var vsis_arrayEquipamentos=[];
var vsis_base;
//
//
OpenLayers.Util.onImageLoadErrorColor = 'transparent';
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

var vsis_controlsarray = [
	    vsis_navigation_control,
//	    new OpenLayers.Control.Attribution({div:document.getElementById('id_layers_info'),template:'Camadas Selecionadas: ${layers}'}),
	    new OpenLayers.Control.PanZoomBar({title:'PanZoomBar'}),
	    new OpenLayers.Control.LayerSwitcher({title: 'Menu de Layers','roundedCorner':true}),
	    new OpenLayers.Control.Permalink(),
	    new OpenLayers.Control.MousePosition({prefix:'Mouse=   lon: ',separator:',    lat: ',numDigits:4,div:document.getElementById('id_mouse')}),
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
    maxExtent: new OpenLayers.Bounds(
    -5501341.25,
    -1961522.68,
    -5118442.68,
    -1629571.93),
    units: 'm',
    numZoomLevels: 26,
    projection: vsis_mercator,
//              displayProjection: vsis_mercator
    displayProjection: vsis_geographic,
    eventListeners: {
                    'changebaselayer':fsis_changeLayerBase
    }
});
function fsis_changeLayerBase(e){
    fsis_mostrarMsg(MENS_40 + e.layer.attribution);
}
//
/*
* -------------------------------------------------------------------------
*
*                           LAYER DA COMUNIDADE:
*        CRIAR LAYER, PAINEL PARA EDIÇÃO DAS FEATURES E CONTROLES
*
* --------------------------------------------------------------------------
*/
/*
                Controle para salvar as features  novas ou as modificadas:
                - OpenLayers.Strategy: strategy class para layer vetorial abstrato.  Não instanciado diretamente, mas através de uma subclasse.
                - OpenLayers.Strategy.Save:  uma strategy para commit das novas features ou das modificadas.
                - por default, a strategy espera por uma chamada "save" para salvar (persistir) as mudanças.
                - quando da criação do layer da comunidade logo adiante, será associado esta strategy a este layer.
*/
var vsis_save = new OpenLayers.Strategy.Save();
vsis_save.events.register("success", '', fsis_mostrarMensSucesso);
vsis_save.events.register("fail", '', fsis_mostrarMensInsucesso);
var vsis_botaoSave = new OpenLayers.Control.Button({
/*                      Quando botão clicado, a função trigger() é executada. Dispara a função "save" para fazer o commit das features não salvas
                        relativas ao layer abstrato vsis_save.
*/
        title: MENS_33,
        trigger: function() {vsis_save.save()},
        displayClass: "olControlSaveFeatures"
});
function fsis_mostrarMensSucesso(){fsis_mostrarMsg(MENS_36)};
function fsis_mostrarMensInsucesso(){fsis_mostrarMsg(MENS_37)};
//
//              criar o layer da comunidade
vsis_layerComunidade = new OpenLayers.Layer.Vector(MENS_34, {
        strategies: [new OpenLayers.Strategy.BBOX(), vsis_save],
        projection: new OpenLayers.Projection("EPSG:4326"),
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.0.0",
            srsName: "EPSG:4326",
            url: "http://50.116.27.239:8080/geoserver/wfs/",
            featureNS :  "http://50.116.27.239/catalogcdes",
            featureType: "comunidade",
            geometryName: "the_geom",
            schema: "http://50.116.27.239:8080/geoserver/wfs/DescribeFeatureType?version=1.0.0&typename=cdes:comunidade",
        }),
        visibility:true,
        attribution:"Comunidade",
        eventListeners:{
                        "featureselected":fsis_selectedFeature,
                        "featureunselected":fsis_limparAreaIndicadores
        }
});
//
//                Tratamento para select/unselect features do layer da comunidade
function fsis_selectedFeature(e){
        vsis_featureSelected = e; // guarda a identificação da feature selecionada
        fsis_listarAtributosSelected(MENS_47,EDITARATRIBUTOS);
}

//              Definir os estilos das features pertencente ao layer da comunidade
vsis_layerComunidade.styleMap = new OpenLayers.StyleMap({ 
                                'default':new OpenLayers.Style({
                                                pointRadius:5,
                                                fillOpacity:0.7,
                                                fillColor:"#E31818",
                                                strokeColor:"#18E385",
                                                strokeWidth:2,
                                                graphicName:'triangle'
                                }),
                                'select':new OpenLayers.Style({
                                                pointRadius:12,
                                                fillOpacity:0.3,
                                                fillColor:"#E31818",
                                                strokeColor:"#18E385",
                                                strokeWidth:4,
                                                graphicName:'triangle'
                                })
});
//              Definir o controle de seleção da feature.  A ativação do controle será feita mais adiante
vsis_controlFeatureComunidade = new OpenLayers.Control.SelectFeature(
                vsis_layerComunidade,
                {
                        multiple: false,
                        toggle: true,
                        toggleKey: 'ctrlKey'
                        // ,multipleKey: 'shiftKey'
                }
);
/*
    var edit = new OpenLayers.Control.ModifyFeature(vsis_layerComunidade, {
        title: "Modificar Feature",
        displayClass: "olControlModifyFeature"
    });
*/
//
//              Criar um painel de edição
var vsis_panel = new OpenLayers.Control.Panel({
        displayClass: 'customEditingToolbar',
        allowDepress: true
});
//              Controle para marcar novo ponto no mapa
var vsis_draw = new OpenLayers.Control.DrawFeature(
    vsis_layerComunidade , OpenLayers.Handler.Point,
    {
        title: MENS_31,
        displayClass: "olControlDrawFeaturePoint",
        multi: false
//        eventListeners:{"beforefeatureadded":console.log("oi")}
    }
);
//              controle para deletar ponto inserido no mapa
var vsis_deleteFeature = OpenLayers.Class(OpenLayers.Control, {
    initialize: function(layer, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        this.layer = layer;
        this.handler = new OpenLayers.Handler.Feature(
            this, layer, {click: this.clickFeature}
        );
    },
    clickFeature: function(feature) {
        // se a feature não tem uma fid, destrui-la
        if(feature.fid == undefined) {
            this.layer.destroyFeatures([feature]);
        } else {
            feature.state = OpenLayers.State.DELETE;
            this.layer.events.triggerEvent("afterfeaturemodified", 
                                           {feature: feature});
            feature.renderIntent = "select";
            this.layer.drawFeature(feature);
        }
    },
    setMap: function(map) {
        this.handler.setMap(map);
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },
    CLASS_NAME: "OpenLayers.Control.DeleteFeature"
});
var vsis_del =  new vsis_deleteFeature(vsis_layerComunidade , {title: MENS_32});

// Controles para informações literais (POPUP)
vsis_featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
    url: HOSTNAME_WMS,
    title: "",
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
var vsis_controlpopup = new OpenLayers.Control.Button({
    displayClass:'olControlButtonInfo',
//    type:2,
    title:MENS_12,
    eventListeners:{
        'activate':fsis_ativarInfo,
        'deactivate':fsis_desativarInfo
    },
    type: OpenLayers.Control.TYPE_TOOL
});
function fsis_desativarInfo(){
    vsis_botaoInfo = false;
    fsis_selecionarFeature();
    fsis_mostrarMsg(MENS_38);
};
function fsis_ativarInfo(){
    vsis_botaoInfo = true;
    fsis_selecionarFeature();
}
//
// Adicionar ao mapa o painel e os controles (e ativa-los)
vsis_panel.addControls([vsis_featureInfo,vsis_botaoSave,vsis_draw,vsis_del,vsis_controlpopup,vsis_controlFeatureComunidade]);
vsis_map.addControl(vsis_panel);
//
/*
* -------------------------------------------------------------------------
*
*                              LAYERS RASTER
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
    {attribution:"OSGeo"}
);
//OpenStreetMap
var vsis_layerosm = new OpenLayers.Layer.OSM(
MENS_02
);
//
//Google streets
var vsis_layerstreets = new OpenLayers.Layer.Google(
MENS_03,{attribution:MENS_03}
);
//Google satellite
var vsis_layersatellite = new OpenLayers.Layer.Google(
MENS_04,
{type: google.maps.MapTypeId.SATELLITE,attribution: MENS_04}
);
//RIDE
var vsis_layerridegroup = new OpenLayers.Layer.WMS(
MENS_05,
HOSTNAME_WMS,
{layers: 'cdes:ride_group', transparent:true},{attribution:'DF - RIDE',visibility: false, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
);
//Poligono das RAs
var vsis_layerRA = new OpenLayers.Layer.WMS(
MENS_06,
HOSTNAME_WMS,
{layers: 'cdes:ra31_df',transparent:true},{attribution:'DF - Limites RAs',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//Malha das regiões censitárias (IBGE) do DF 
var vsis_layercenso = new OpenLayers.Layer.WMS(
MENS_41,
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
/*
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
*/
//
/*
* -------------------------------------------------------------------------
*
*                              LAYERS VETORIAIS
*
* --------------------------------------------------------------------------
//
*     CRIAR MAPA VETORIAL DAS RAs PARA ESTILIZAÇÃO DOS INDICADORES
*/
var vsis_styleregioes = new OpenLayers.Style({
        'fillColor':'${ra_prefifo}',
        'strokeColor':'#000000',
        'fillOpacity':.85
});
vsis_layerregioes = new OpenLayers.Layer.Vector(MENS_35,{
        styleMap: new OpenLayers.StyleMap(vsis_styleregioes),
        attribution:"Indicadores"
});

/*
* --------------------------------------------------------------------------
*
*                       ADICIONAR OS LAYERS AO MAPA
*
* --------------------------------------------------------------------------
*/
vsis_map.addLayers([vsis_layermapquest, vsis_layerosm, vsis_layerosgeo, vsis_layerstreets,vsis_layersatellite, vsis_layerpopDF,vsis_layerpopGO,vsis_layerregioes, vsis_layerridegroup, 
                    vsis_layerRA, vsis_layercenso, vsis_layersetor, vsis_layerquadras, vsis_layerconjunto, vsis_layerlote]);
vsis_map.addLayer(vsis_layerComunidade);
// Deixar o centro do mapa no Distrito Federal
vsis_map.setCenter(new OpenLayers.LonLat(-5330000,-1780000),10);
if(!vsis_map.getCenter()){vsis_map.zoomToMaxExtent()};
//
/*
* --------------------------------------------------------------------------
*
*                       EQUIPAMENTOS PÚBLICOS
*
* --------------------------------------------------------------------------
*/
var vsis_previousMapScale;
vsis_listaEquipamentos[0][2] = new OpenLayers.Layer.Vector(MENS_24,{
        visibility: false, // Com isto as features só serão carregadas quando o usuário selecionar o layer
        isBaseLayer:false,
        opacity:1,
        displayInLayerSwitcher:true,
        attribution:MENS_24,
        strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Cluster({distance:50,threshold:1})],
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            srsName: "EPSG:900913",
            url: HOSTNAME_WFS,
            featureNS : HOSTNAME + "/catalogcdes",
            featureType: "escolas_df",
            geometryName: "the_geom"
        }),
        filter:new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                property:'situacao',
                value:'VAGO'
        })
});
vsis_listaEquipamentos[1][2] = new OpenLayers.Layer.Vector(MENS_26,{
        visibility: false, // Com isto as features só serão carregadas quando o usuário selecionar o layer
        isBaseLayer:false,
        opacity:1,
        displayInLayerSwitcher:true,
        attribution:MENS_26,
        strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Cluster({distance:50,threshold:1})],
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            srsName: "EPSG:900913",
            url: HOSTNAME_WFS,
            featureNS : HOSTNAME + "/catalogcdes",
            featureType: "seguranca_df",
            geometryName: "the_geom"
        })
});
vsis_listaEquipamentos[2][2] = new OpenLayers.Layer.Vector(MENS_25,{
        visibility: false, // Com isto as features só serão carregadas quando o usuário selecionar o layer
        isBaseLayer:false,
        opacity:1,
        displayInLayerSwitcher:true,
        attribution:MENS_25,
        strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Cluster({distance:50,threshold:1})],
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            srsName: "EPSG:900913",
            url: HOSTNAME_WFS,
            featureNS : HOSTNAME + "/catalogcdes",
            featureType: "saude_df",
            geometryName: "the_geom"
        }),
        filter:new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                property:'situacao',
                value:'VAGO'
        })
});
for (var i in vsis_listaEquipamentos){
    vsis_listaEquipamentos[i][0] =  new OpenLayers.StyleMap({
                                    'default': new OpenLayers.Style({
                                            strokeColor:"#E8E40F",
                                            fillColor:vsis_listaEquipamentos[i][3],
                                            pointRadius:'${vsis_radiusFunction}',
                                            label:"${count}"
                                    },{
                                        context:{
                                            vsis_radiusFunction: function(feature){
                                            var count = feature.attributes.count;
                                            var radius = Math.max(1.5 * count + 3 ,6);
                                            if (radius > 30) radius = 30;
                                            return radius;
                                            }
                                        }
                                    })
    });
    vsis_listaEquipamentos[i][1] = new OpenLayers.StyleMap({
                                                            'default': new OpenLayers.Style({'fillColor':vsis_listaEquipamentos[i][3]}),
                                                            'select': new OpenLayers.Style({'strokeWidth':6,'fillOpacity':.4})
    });
} // for
//
// adicionar layers ao mapa
for (var i in vsis_listaEquipamentos){
    vsis_listaEquipamentos[i][2].styleMap = vsis_listaEquipamentos[i][0];
    vsis_listaEquipamentos[i][2].events.register('visibilitychanged', this, fsis_evMudouVisibilidade);
    vsis_listaEquipamentos[i][2].events.register('featureselected', this, fsis_evFeatureSelected);
    vsis_listaEquipamentos[i][2].events.register('featureunselected', this, fsis_limparAreaIndicadores);
    vsis_map.addLayer(vsis_listaEquipamentos[i][2]);
    vsis_arrayEquipamentos.push(vsis_listaEquipamentos[i][2]);
}
vsis_selectEquipamentos = new OpenLayers.Control.SelectFeature(
                                                    vsis_arrayEquipamentos,
                                                    {
                                                        multiple:false,
                                                        togle:false,
                                                        hover:false,
                                                        toggleKey:'ctrlKey',
                                                        multipleKey:'shiftKey',
                                                        box:false
                                                    }
);
//vsis_map.addControls([vsis_selectEquipamentos,vsis_panel]);
vsis_map.addControl(vsis_selectEquipamentos);
vsis_selectEquipamentos.deactivate();
//
function fsis_evFeatureSelected(e){
    vsis_featureSelected = e;   // guardar a feature selecionada xxxxxxxxxxxxx
    fsis_listarAtributosSelected(MENS_30,NAO_EDITARATRIBUTOS);
}
function fsis_listarAtributosSelected(mens,editarAtributos){
    fsis_limparAreaAtributos();
    mens += ' - '+ vsis_featureSelected.feature.layer.attribution;
    document.getElementById('id_indicadores-titulo').innerHTML = mens;
    fsis_montarTabelaAtributos(editarAtributos);
}

//


//
function fsis_evMudouVisibilidade(e) {
    if (vsis_map.getScale() < CLUSTER_SCALE_THRESHOLD) {
        fsis_featuresSemCluster();
    }
    else {
        fsis_featuresComCluster();
    }
};
var vsis_previousMapScale = vsis_map.getScale();
vsis_map.events.register('zoomend', vsis_map, function() {
            if ((vsis_previousMapScale > CLUSTER_SCALE_THRESHOLD) && (this.getScale() < CLUSTER_SCALE_THRESHOLD)) {fsis_featuresSemCluster()};
            if ((vsis_previousMapScale < CLUSTER_SCALE_THRESHOLD) && (this.getScale() > CLUSTER_SCALE_THRESHOLD)) {fsis_featuresComCluster()};
            vsis_previousMapScale = this.getScale();
});
function fsis_featuresComCluster(){
        for (var i in vsis_listaEquipamentos){
            vsis_listaEquipamentos[i][2].strategies[1].activate();
            vsis_listaEquipamentos[i][2].styleMap = vsis_listaEquipamentos[i][0];
            vsis_listaEquipamentos[i][2].refresh({force: true});
        }
//        vsis_selectEquipamentos.deactivate();
        fsis_selecionarFeature();
}


function fsis_featuresSemCluster(){
        for (var i in vsis_listaEquipamentos){
            vsis_listaEquipamentos[i][2].strategies[1].deactivate();
            vsis_listaEquipamentos[i][2].styleMap = vsis_listaEquipamentos[i][1];
            vsis_listaEquipamentos[i][2].refresh({force: true});
        }
        fsis_selecionarFeature();
}
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
    'previousOptions': {'title': MENS_44},
    'nextOptions':     {'title': MENS_45}
});
vsis_panel.addControls([vsis_history.next,vsis_history.previous]);
vsis_map.addControls([vsis_history,vsis_panel]);
//
/*
* --------------------------------------------------------------------------
*
*                     CONTROLE TRANSPARÊNCIA LAYER INDICADORES-DF
*
* --------------------------------------------------------------------------
*/
var vsis_controltransparencia = new OpenLayers.Control.Button({
    displayClass: 'olControlTransparencia',
    trigger: fsis_transparencia,
    type:1,
    title:MENS_11
});
var vsis_paineltransparencia = new OpenLayers.Control.Panel({displayClass:'olControlPanelTransparencia'});
vsis_paineltransparencia.addControls([vsis_controltransparencia]);
vsis_map.addControl(vsis_paineltransparencia);
//

//
/*
* --------------------------------------------------------------------------
*
*           INFORMAÇÕES GERAIS DAS RAs PARA MONTAGEM DE GRÁFICOS DE
*                           CORRELAÇÃO DE INDICADORES
*
* --------------------------------------------------------------------------
*/
    if (!fsis_infogerais()){return false;}

//

/*
* --------------------------------------------------------------------------
*
*      FUNCAO DE CONTROLE DA TRANSPARENCIA PARA O LAYER DOS INDICADORES
*
* --------------------------------------------------------------------------
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
/*
* --------------------------------------------------------------------------
*
*                      EDITAR ATRIBUTOS DE LAYER VETORIAL COMUNIDADE
*
* --------------------------------------------------------------------------
*/
// Utilizado para os atributos do Layer Vetorial da Comunidade
function fsis_editarAtributosComunidade(){
    var resp = showModalDialog("./html/sisesp_formularioFeature.html",
                    ["Atributos da Feature","Nome","Descrição"],"dialogwidth:550;dialogheight:340;resizable:no;status:no;scroll:no;dialogLeft:350;dialogTop:280;");
    if (resp != null){
        vsis_layerComunidade.selectedFeatures[0].attributes.nome = resp[0];
        vsis_layerComunidade.selectedFeatures[0].attributes.descricao = resp[1];
        vsis_layerComunidade.selectedFeatures[0].attributes.comentario = resp[2];
        vsis_layerComunidade.selectedFeatures[0].attributes.categoria = resp[3];
        if (vsis_layerComunidade.selectedFeatures[0].state == null ){
            vsis_layerComunidade.selectedFeatures[0].state = OpenLayers.State.UPDATE; // preparar status para Strategy.Save()
        }
        fsis_montarTabelaAtributos(EDITARATRIBUTOS); // xxxxxx
    }
}
function fsis_montarTabelaAtributos(editarAtributos){
    fsis_limparAreaAtributos();
    $("<p></p><table><tr><th>Campo</th><th>Atributo</th></tr>").appendTo("#id_indicadores-1");
    for (var i in vsis_featureSelected.feature.attributes){
        $("<tr><td>"+i+"</td><td>"+vsis_featureSelected.feature.attributes[i]+"</td></tr>").appendTo("#id_indicadores-1 table");
    }
    if (editarAtributos){
        $("<tr><th></th><th><button class='myButton3' onclick='fsis_editarAtributosComunidade()'>Editar</button></th></tr>").appendTo("#id_indicadores-1 table");
    }
}
function fsis_limparAreaIndicadores(){
    $("#id_indicadores-1").empty();
    $("#id_indicadores-2").empty();
    $("#id_indicadores-titulo").empty();
}
function fsis_limparAreaAtributos(){
    $("#id_indicadores-1").empty();
    $("#id_indicadores-2").empty();
}
//
/*
* --------------------------------------------------------------------------
*
*  FUNCAO PARA IMPRIMIR MENSAGENS DE CONTROLE/STATUS E SEU CONTROLE DE TEMPO
*
* --------------------------------------------------------------------------
*/

function fsis_mostrarMsg(mensagemstr) {
            clearTimeout(vsis_timeOut);
            document.getElementById("id_layers_info").innerHTML = mensagemstr;
            vsis_timeOut = setTimeout("document.getElementById('id_layers_info').innerHTML = ''",8000);
}
/*
* --------------------------------------------------------------------------
*
*           REGRAS GERAIS PARA O "SELECT FEATURE" DO CONJUNTO
*               DE LAYERS EXISTENTES (raster e vetoriais)
*
* --------------------------------------------------------------------------
*
vsis_featureInfo - POPUP para visualização dos atributos dos layers das camadas WMS
vsis_controlFeatureComunidade - Controle para visualização dos atributos das features do layer da Comunidade

*/
function fsis_selecionarFeature(){
    if (!vsis_botaoInfo){
        vsis_controlFeatureComunidade.deactivate();
        vsis_featureInfo.deactivate();
        vsis_selectEquipamentos.deactivate();
        fsis_mostrarMsg(MENS_38);
    }
    else {
        var e = document.getElementById("id_infos");
        if (e.selectedIndex == 0) {
//           "WMS"
            vsis_controlFeatureComunidade.deactivate();
            vsis_selectEquipamentos.deactivate();
            vsis_featureInfo.activate();
            fsis_mostrarMsg(MENS_39 + e.options[e.selectedIndex].innerHTML);
        }
        else if (e.selectedIndex == 1) {
//           "Comunidade"
            vsis_featureInfo.deactivate();
            vsis_selectEquipamentos.deactivate();
            vsis_controlFeatureComunidade.activate();
            fsis_mostrarMsg(MENS_39 + e.options[e.selectedIndex].innerHTML);
        }
        else if (e.selectedIndex == 2) {
//           "Equipamentos"
            vsis_featureInfo.deactivate();
            vsis_controlFeatureComunidade.deactivate();
            if (vsis_map.getScale() < CLUSTER_SCALE_THRESHOLD){
                vsis_selectEquipamentos.activate();
                fsis_mostrarMsg(MENS_39 + e.options[e.selectedIndex].innerHTML);
            }
            else {
                vsis_selectEquipamentos.deactivate();
                fsis_mostrarMsg(MENS_38);
            }
        }
        else { alert(MENS_46)}
    }
}
//
/* ************************************************************* */
function fsis_infogerais(){
    var vsis_semerro = true;
    vsis_base = vsis_baseindicadores[document.getElementById("Items").selectedIndex];
    fsis_infogeraispopulacao(); // buscar populacao de cada região
    fsis_infogeraispercapita(); // buscar renda per capita de cada região
    fsis_infogeraisgeometria(); // buscar a geometria da região
    return true;
    function fsis_infogeraispopulacao(){
        var vsis_protocol2 = new OpenLayers.Protocol.HTTP({
                    url:PASTA_JSON + vsis_base[0] + '/'+ vsis_base[2],
                    format: new OpenLayers.Format.JSON({})
        });
        vsis_populacao = vsis_protocol2.read({callback:_CallBackpopulacao});
        function _CallBackpopulacao(resp){
            try{
                if (resp.features == null) throw MENS_01 + MENS_22;
                if (resp.error != null) throw MENS_01 + MENS_22;
            }
            catch(err){
                if (vsis_semerro == true){
                    vsis_semerro = false;
                    //fsis_limparpainel();
                    window.alert(MENS_ERR_02 + err);
                }
            }
        }
    } // fim função fsis_infogeraispopulacao

    function fsis_infogeraispercapita(){
        var vsis_protocol2 = new OpenLayers.Protocol.HTTP({
                url:PASTA_JSON + vsis_base[0] + '/' + vsis_base[3],
                format: new OpenLayers.Format.JSON({})
        });
        vsis_percapita = vsis_protocol2.read({callback:_CallBackpercapita});
        function  _CallBackpercapita(resp){
            try{
                if (resp.features == null) throw MENS_01 + MENS_22;
                if (resp.error != null) throw MENS_01 + MENS_22
            }
            catch(err){
                if (vsis_semerro == true){
                    vsis_semerro = false;
                    //fsis_limparpainel();
                    window.alert(MENS_ERR_03 + err);
                }
            }
        }
    } // fim função fsis_infogeraispercapita
    
    function fsis_infogeraisgeometria(){
        var vsis_protocolo = new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            url: HOSTNAME_WFS,
            featureType: vsis_base[4],
            featureNS: HOSTNAME + "/catalogcdes",
            srsName: "EPSG:900913",
        });
        vsis_featuresregioes = vsis_protocolo.read({callback:_CallBackgeometria});
        function _CallBackgeometria (resp) {
            try{
                if (resp.features == null) throw MENS_21 + MENS_22;
                if (resp.error != null) throw MENS_21 + MENS_22;
            }
            catch(err){
                if (vsis_semerro == true){
                    vsis_semerro = false;
                    //fsis_limparpainel();
                    window.alert(MENS_ERR_01 + err);
                }
            }

        }
    }  // fim função fsis_infogeraisgeometria
} // fim função fsis_infogerais()
/*
* --------------------------------------------------------------------------
*
* FUNCAO PARA PLOTAGEM DE GRÁFICOS DE INDICADORES DAS RAs E MAPA ESTILIZADO
*
* --------------------------------------------------------------------------
*/
function fsis_indicadores(identf){
    var vsis_protocol1, vsis_indices;
    vsis_layerregioes.setVisibility(true);
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
        // Variáveis locais:
        var vsis_limiarquartis = [], vsis_infosregioes=[],vsis_infosgraficos=[],vsis_regioesnoquartil=[], vsis_media, vsis_total=0, vsis_desvio, vsis_indicepercapita;
        var vsis_classespaleta = ["a","b","c","d","e","f"];  /* sistema para até 6 quartis */
        //
        try{
            if (vsis_indices.features == null) throw MENS_16 + identf + MENS_17 + MENS_22;
            if (vsis_indices.error != null) throw MENS_18 + identf + '. '+ MENS_22;
            if (vsis_featuresregioes.features == null) throw MENS_19 + MENS_22;
        }
        catch(err){
            window.alert(MENS_ERR_04 + err);
            return false; // retorna, não continuando a execução da função fsis_indicadores
        }
        // PARTE-1: iniciar as informações dos quartis
            // vsis_limiarquartis: limiar dos quartis, definido no arquivo JSON do indicador escolhido;
            for (var i = 0, len = (vsis_indices.features.indicador.quartis).length; i < len; i++){
                vsis_limiarquartis.push([vsis_indices.features.indicador.quartis[i].qi,vsis_indices.features.indicador.quartis[i].qs]);
            }
        // PARTE-2: preparar as informações para estilizar o mapa, segundo os estilos do quartil
            for (var i = 0, len = ( vsis_indices.features.indices).length; i < len; i++ ){
                // laço maior dentro do arquivo JSON do indicador escolhido pelo usuário
                // uma passagem para casa região presente no arquivo JSON deste indicador
                //
                // verificar se o índice da região veio definido no arquivo JSON
                if ( vsis_indices.features.indices[i].indice < 0 ) {
                    // Índice não veio definido no arquivo JSON.
                    vsis_infosregioes.push([
                                        vsis_indices.features.indices[i].indice,
                                        vsis_indices.features.indices[i].RA,
                                        vsis_indices.features.indices[i].romano,
                                        vsis_paletaregioes.length-1, // quartil: classifico no último quartil
                                        vsis_paletaregioes[vsis_paletaregioes.length-1][1]
                    ]);
                }
                else {
                    // Índice veio definido normalmente no arquivo JSON.
                    for (var j = 0; j < vsis_indices.features.indicador.num_quartis; j++) {
                        // vsis_infosregioes: composta por 5 campos: [ [indice,nome da região, romano, quartil,style],[...] ];
                        if ( vsis_indices.features.indices[i].indice <= vsis_limiarquartis[j][1] ) {
                                vsis_infosregioes.push([
                                                    vsis_indices.features.indices[i].indice,
                                                    vsis_indices.features.indices[i].RA, 
                                                    vsis_indices.features.indices[i].romano,
                                                    j, // quartil
                                                    vsis_paletaregioes[j][1]
                                ]);
                                break;
                        }
                
                    }
                }
            }
        // fim da PARTE-2
        // PARTE-3: preparar as informações para construir os infograficos, segundo os estilos do quartil
            // zerar a contagem das regiões em cada quartil
            for (var i in vsis_indices.features.indicador.quartis) vsis_regioesnoquartil.push([0,"",0]);
            // laço: uma passagem para casa região presente no arquivo JSON do indicador escolhido pelo usuário
            rot_regioesindice: for (var i in vsis_indices.features.indices ){
                // verificar se o índice da região veio definido no arquivo JSON
                if ( vsis_indices.features.indices[i].indice < 0 ) {
                    // Índice não veio definido no arquivo JSON.
                    continue rot_regioesindice;
                }
                // identificação da renda percapita da região
                for (var m in vsis_percapita.features.indices){
                    if ( vsis_indices.features.indices[i].romano == vsis_percapita.features.indices[m].romano ){
                        vsis_indicepercapita = vsis_percapita.features.indices[m].indice;
                        break;
                    }
                }
                // identificação de cada região em relação aos quartis.
                for (var j = 0; j < vsis_indices.features.indicador.num_quartis; j++) {
                    if ( vsis_indices.features.indices[i].indice <= vsis_limiarquartis[j][1] ) {
                        vsis_infosgraficos.push([
                                                    vsis_indices.features.indices[i].indice,
                                                    vsis_indices.features.indices[i].RA,
                                                    vsis_indices.features.indices[i].romano,
                                                    j,
                                                    vsis_paletaregioes[j][1],
                                                    vsis_indicepercapita
                        ]);
                    vsis_regioesnoquartil[j][0]++;
                    break;
                    }
                }
                // contabiliza o total de população que reside em cada quartil
                //              mas primeiro verifica se o índice realmente existe para a região em tratamento
                if ( vsis_indices.features.indices[i].indice >= 0) {
                    // neste caso o índice existe.  Somar a população.
                    for (var k = 0; k < vsis_populacao.features.indices.length; k++){
                        if ( vsis_indices.features.indices[i].romano == vsis_populacao.features.indices[k].romano ){
                            vsis_regioesnoquartil[j][2] += vsis_populacao.features.indices[k].indice;
                            break;
                        }
                    }
                }
            }
            // Estatisticas e preparação da visualização:
            //      - média dos índices das regiões (para as regiões com indices que existem);
            for (var i= 0;i < vsis_infosgraficos.length;i++) vsis_total += vsis_infosgraficos[i][0];
            vsis_media = vsis_total/vsis_infosgraficos.length;
            //      - desvio padrão dos índices das regiões (para as regiões com indices que existem);
            vsis_total = 0;
            for (i = 0; i < vsis_infosgraficos.length; i++){
                vsis_desvio = vsis_infosgraficos[i][0] - vsis_media;
                vsis_total += vsis_desvio * vsis_desvio;
            }
            vsis_desvio = Math.sqrt(vsis_total/vsis_infosgraficos.length);
            vsis_infosgraficos.sort(function(a,b){return a[0]-b[0];});
            // Cabeçalho textual da área de indicadores
            //      - para gráficos de índices desagregados e agregados
            // width="20" height="20"
            const MENS1 = vsis_indices.features.indicador.titulo.substr(0,52);
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
            fsis_estilizarregioes(vsis_infosregioes);
            construir_grafico1 (vsis_infosgraficos);
            construir_grafico2 (vsis_regioesnoquartil);
            construir_grafico3 (vsis_regioesnoquartil);
            construir_grafico4 (vsis_infosgraficos);
    } // fim callback

} // Fim função fsis_indicadores()


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


function fsis_estilizarregioes(vsis_infosregioes){
    //vsis_infosregioes: composta por 5 campos: [ [indice,nome da região, romano, quartil,style,[...] ];
    for (var i=0; i < vsis_featuresregioes.features.length; i++){
        for (var j=0; j < vsis_infosregioes.length; j++){
            if (vsis_featuresregioes.features[i].attributes.romano == vsis_infosregioes[j][2]){
                vsis_featuresregioes.features[i].attributes.ra_prefifo = vsis_paletaregioes2[vsis_infosregioes[j][3]][1];
                break;
            }
        }
        try{
            if (j == vsis_infosregioes.length){
                vsis_featuresregioes.features[i].attributes.ra_prefifo = QUARTILINDEFINIDO; /* Preto: para estilizar região do mapa referente à RA que não fora encontrada suas informações */
                throw MENS_27 + vsis_featuresregioes.features[i].attributes.nome;
            }
        }
        catch(err){
            window.alert(MENS_ERR_07 + err);
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
contentsource: ["id_menuIndicadores", PASTA_HTML + vsis_baseindicadores[0][1]] //"markup" or ["id_menuIndicadores", "path_to_menu_file"]
});
