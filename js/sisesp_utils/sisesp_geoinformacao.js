//
/*
* --------------------------------------------------------------------------
*
* DEFINICOES GLOBAIS
*
* --------------------------------------------------------------------------
*/
OpenLayers.Lang.setCode("pt-BR");
const HOSTNAME = "http://50.116.27.239";
const HOSTNAME_WMS = HOSTNAME + ":8080/geoserver/wms/";
const HOSTNAME_WFS = HOSTNAME + ":8080/geoserver/wfs/";

var vsis_map, vsis_populacaoDF, vsis_percapitaDF;
var vsis_mercator = new OpenLayers.Projection("EPSG:900913");
var vsis_geographic = new OpenLayers.Projection("EPSG:4326");
var vsis_layerindicadores = null, vsis_layerregioes = null;
var vsis_featuresregioes;
// cores para os graficos de indicadores
const QUARTIL0 = "#FFF68F";
const QUARTIL1 = "#EABE53";
const QUARTIL2 = "#B1D4AF";
const QUARTIL3 = "#7E9B26";
const QUARTIL4 = "#E48164";
const QUARTIL5 = "#E92922";

var vsis_paletaregioes = [[0,"chart0"],[1,"chart1"],[2,"chart2"],[3,"chart3"],[4,"chart4"],[5,"chart5"]];
var vsis_paletaregioes2 = [[0,QUARTIL0],[1,QUARTIL1],[2,QUARTIL2],[3,QUARTIL3],[4,QUARTIL4],[5,QUARTIL5]];
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
	    new OpenLayers.Control.Attribution({div:document.getElementById('id_layers_info'),template:'Camadas Selecionadas: ${layers}'}),
	    new OpenLayers.Control.PanZoomBar({}),
	    new OpenLayers.Control.LayerSwitcher({title: 'Menu de Layers','roundedCorner':true}),
	    new OpenLayers.Control.Permalink(),
	    new OpenLayers.Control.MousePosition({prefix:'Mouse=   lon: ',separator:',    lat: ',numDigits:4,div:document.getElementById('id_mouse')}),
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
    panDuration:90,
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
HOSTNAME_WMS,
{layers: 'cdes:ride_group', transparent:true},{attribution:'RIDE-DF',visibility: false, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
);
//Poligono das RAs
var vsis_layerRA = new OpenLayers.Layer.WMS(
'DF:RAs',
HOSTNAME_WMS,
{layers: 'cdes:ra31_df',transparent:true},{attribution:'RA-Limites',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//WMS LAYER: SETOR
var vsis_layersetor = new OpenLayers.Layer.WMS(
'DF:Setor',
HOSTNAME_WMS,
{layers: 'cdes:df_setor',transparent:true},{minScale:220000,attribution:'DF-Setores',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
);
//WMS LAYER: QUADRAS
var vsis_layerquadras = new OpenLayers.Layer.WMS(
'DF:Quadra',
HOSTNAME_WMS,
{layers: 'cdes:df_quadra',transparent:true},{minScale:55000,attribution:'DF-Quadras',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
);
//WMS LAYER: CONJUNTO
var vsis_layerconjunto = new OpenLayers.Layer.WMS(
'DF:Conjunto',
HOSTNAME_WMS,
{layers: 'cdes:df_conjunto',transparent:true},{minScale:15000,attribution:'DF-Conjuntos',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
);
//WMS LAYER: LOTE
var vsis_layerlote = new OpenLayers.Layer.WMS(
'DF:Lote',
HOSTNAME_WMS,
{layers: 'cdes:df_lote',transparent:true},{minScale:10000,attribution:'DF-Lotes',visibility: false, isBaseLayer:false,opacity:.7,displayInLayerSwitcher:true}
);
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
//    type:2,
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
	url: HOSTNAME_WMS,
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
*           INFORMAÇÃO DA POPULAÇÃO DO DF POR REGIÃO ADMINISTRATIVA
*
* --------------------------------------------------------------------------
*/
    var vsis_protocol2 = new OpenLayers.Protocol.HTTP({
                    url:'data_json/data_indicador_populacao.json',
                    format: new OpenLayers.Format.JSON({})
    });
/*
    vsis_layerindicadores = new OpenLayers.Layer.Vector('Indicadores',{
                    protocol: vsis_protocol1,
                    strategies:[new OpenLayers.Strategy.Fixed()],
                    visibility:true,isBaseLayer:false,displayInLayerSwitcher:true
    });
*/
    vsis_populacaoDF = vsis_protocol2.read({callback:_CallBack3});
    function _CallBack3(){
       vsis_protocol2 = new OpenLayers.Protocol.HTTP({
                    url:'data_json/data_indicador_renda_percapita.json',
                    format: new OpenLayers.Format.JSON({})
        });
        vsis_percapitaDF = vsis_protocol2.read({callback:_CallBack4});
        function  _CallBack4(){
            //console.log(vsis_percapitaDF);
        }
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
        if (resp.features == null) throw "OooopS!\nErro no carregamento WFS";
        if (resp.error != null) throw "OooopS!\nErro no carregamento WFS";}
        catch(err){
            window.alert("Erro: " + err + ".");
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
}  // Fim função init()
//
/*
* --------------------------------------------------------------------------
*
* FUNCAO PARA PLOTAGEM DE GRÁFICOS DE INDICADORES DAS RAs E MAPA ESTILIZADO
*
* --------------------------------------------------------------------------
*/
function fsis_indicadores(identf){
    var vsis_protocol1, vsis_indices;
    vsis_protocol1 = new OpenLayers.Protocol.HTTP({
                    url:'data_json/'+identf,
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
        if (vsis_indices.features == null) throw "OooopS!\nArquivo " + identf + " não encontrado";
        if (vsis_indices.error != null) throw "OooopS!\nErro no carregamento do arquivo " + identf;
        if (vsis_featuresregioes.features == null) throw "OooopS!\nGeometria das regiões com problema";}
        catch(err){
            window.alert("Erro: " + err + ".");
            return false;
        }
        // Variáveis locais:
        var vsis_limiarquartis = [], vsis_infosRA=[], vsis_RAsquartil=[], vsis_media, vsis_total=0, vsis_desvio, vsis_indicepercapita;
        var vsis_classespaleta = ["a","b","c","d","e","f"];  /* sistema para até 6 quartis */
        // Quartis:
        //     - classificacao das RAs dentro dos limiares dos quartis;
        //     - vsis_infosRA será composto por: [[indice,nome da RA, romano, quartil,style],[...],....];
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
                    vsis_indices.features.indicador.unidade.substr(0,77) +'<br /> * Média do indicador: ' + vsis_media.toFixed(2) + 
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
*           FUNCAO DE CONTROLE DAS MARCAS DE INDICADORES
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

ddsmoothmenu.init({
mainmenuid: "smoothmenu-ajax",
//customtheme: ["#1c5a80", "#18374a"], //override default menu CSS background values? Uncomment: ["normal_background", "hover_background"]
contentsource: ["id_container", "sisesp_menu.html"] //"markup" or ["id_container", "path_to_menu_file"]
});
