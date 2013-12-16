//
/*
         DEFINICÃO DA VARIÁVEL GLOBAL DE STATUS
*/
var vsis_dados = {
                populacao : {},
                percapita : {},
                feature_info : {},
                select_equipamentos : {},
                botao_info : false,
                control_feature_comunidade : {},
                map : {},
                feature_selected : null,
                features_regioes : {},
                layer_regioes : {},
                layer_comunidade : {},
                layer_indicadores : {},
                base_indicadores : {},
                hostname : null,
                hostname_wms : null,
                pasta_html : null,
                hostname_wfs : null,
                pasta_json : null,
                formulario_comunidade : null
};
/*
* --------------------------------------------------------------------------
*
*       FUNCAO PRINCIPAL fsis_principal()
*
* --------------------------------------------------------------------------
*/
function fsis_principal(p_acao, p_indicador) {
     'use strict';
    // cores para os graficos de indicadores
    var QUARTIL0 = "#ffd173";
    var QUARTIL1 = "#ffab00";
    var QUARTIL2 = "#bf9030";
    var QUARTIL3 = "#a66f00";
    var QUARTIL4 = "#a64800";
    var QUARTIL5 = "#bf3030";
    var QUARTILINDEFINIDO = "#C5B5B5";
    //
    var EDITARATRIBUTOS = true;
    var NAO_EDITARATRIBUTOS = false;
    var CLUSTER_SCALE_THRESHOLD = 60000;     // threshold para sair do modo cluster layers dos equipamentos públicos.
    // Mensagens de erro da aplicação
    var MENS_ERR_01 = "Erro 01: ";
    var MENS_ERR_02 = "Erro 02: ";
    var MENS_ERR_03 = "Erro 03: ";
    var MENS_ERR_04 = "Erro 04: ";
    var MENS_ERR_05 = "Erro 05: ";
    var MENS_ERR_06 = "Erro 06: ";
    var MENS_ERR_07 = "Erro 07: ";
    var MENS_ERR_08 = "Erro 08: ";
    var MENS_ERR_09 = "Erro 09: ";
    // Mensagens gerais da aplicação
    var MENS_01 = "problemas no carregamento dos arquivos de Informações Gerais.";
    var MENS_02 = "OpenStreetMap";
    var MENS_03 = "Google Streets";
    var MENS_04 = "Google Satellite";
    var MENS_05 = "DF - RIDE";
    var MENS_06 = "DF - Limites RAs";
    var MENS_07 = "DF - Setor";
    var MENS_08 = "DF - Quadra";
    var MENS_09 = "DF - Conjunto";
    var MENS_10 = "DF - Lote";
    var MENS_11 = "Transparência layer de Indicadores";
    var MENS_12 = "Atributos Literais";
    var MENS_13 = "geoinformação";
    var MENS_14 = "<p class='popup'>Informações Literais:</p>";
    var MENS_15 = "Features by clicking";
    var MENS_16 = "arquivo ";
    var MENS_17 = " não encontrado.";
    var MENS_18 = "problemas no carregamento do arquivo ";
    var MENS_19 = "problemas com a geometria das regiões. ";
    var MENS_20 = "Indicadores Sociais";
    var MENS_21 = "problemas no carregamento WFS.";
    var MENS_22 = "Execução interrompida!";
    var MENS_23 = "inconsistência nos dados dos indicadores ou da geometria. ";
    var MENS_24 = "DF:Escolas Públicas";
    var MENS_25 = "DF:Saúde Pública";
    var MENS_26 = "DF:Segurança Pública";
    var MENS_27 = "problemas no arquivo JSON das regiões -- falta entrada para uma região do mapa: ";
    var MENS_28 = "OSGeo";
    var MENS_29 = "MapQuest Open";
    var MENS_30 = "Equipamentos Públicos";
    var MENS_31 = "Criar Ponto";
    var MENS_32 = "Deletar Ponto";
    var MENS_33 = "Salvar Pontos";
    var MENS_34 = "Layer Comunidade";
    var MENS_35 = "Layer Indicadores";
    var MENS_36 = "Features salvas!  Transação completada com sucesso!";
    var MENS_37 = "Não foi possivel salvar as features!  Transação cancelada: um erro ocorreu durante a operação!";
    var MENS_38 = "Todos os controles associados a visualização de atributos estão desligados.";
    var MENS_39 = "Controle de visualização de atributos ligado. Habilitado para o layer: ";
    var MENS_40 = "Layer Básico alterado para:  ";
    var MENS_41 = "DF - Malha Censo IBGE";
    var MENS_42 = "Alterou característica do Layer: ";
    var MENS_43 = ".  Propriedade alterada: ";
    var MENS_44 = "Anterior";
    var MENS_45 = "Próximo";
    var MENS_46 = "Erro! Inconsistência no controle da visibilidade dos dados literais das features.  Relatar ao administrador";
    var MENS_47 = "Pontos";
    var MENS_48 = "pedido de ação desconhecida!";
    var MENS_49 = "% População do DF por Faixa";
    var MENS_50 = "Quantidade RAs por Faixa";
    var MENS_51 = "Renda Per Capita(y) x Indicador(x)";
    var MENS_52 = "Atributos da Feature";
    var MENS_53 = "Nome";
    var MENS_54 = "Descrição";
    var MENS_55 = "Campo";
    var MENS_56 = "Atributo";
    var MENS_57 = "Editar";
    var MENS_58 = "para plotagem dos Infográficos exige-se a presença da biblioteca d3.js";
    var MENS_59 = "Sobre o indicador";
    var MENS_60 = "Média";
    var MENS_61 = "Desvio padrão";
    var MENS_62 = "Descrição";
    var MENS_63 = "Ano";
    var MENS_64 = "Fonte";
    var MENS_65 = "Medida";
    //
    var vsis_paletaregioes = [
                                [0,"chart0"],
                                [1,"chart1"],
                                [2,"chart2"],
                                [3,"chart3"],
                                [4,"chart4"],
                                [5,"chart5"],
                                [6,"chartindefinido"]], //  6 - indice não definido no JSON
        vsis_paletaregioes2 = [
                                [0,QUARTIL0],
                                [1,QUARTIL1],
                                [2,QUARTIL2],
                                [3,QUARTIL3],
                                [4,QUARTIL4],
                                [5,QUARTIL5],
                                [6,QUARTILINDEFINIDO]]; // último elemento sempre para ser utilizado quando indice não definido no JSON
    var vsis_lista_equipamentos = [  // estilo para clusters de equipamentos: [estilo para cluster, estilo para feature, layer referente ao equipamento, cor]
                                [null,null,null,"#45acf2"], // escolas
                                [null,null,null,"#aaa"],    // segurança
                                [null,null,null,"#f24555"]];  // saúde
    //
    switch(p_acao) {
        case    'BASEDADOS':
            fsis_buscarInfosRegiao();
            return;
        case    'LIMPARPAINEL':
            return fsis_limparPainel();
        case    'SELECIONARFEATURE':
            fsis_selecionarFeature();
            return;
        case    'EDITARATRIBUTOS':
            fsis_editarAtributosComunidade();
            return;
        case    'ESPACIALIZARINDICADOR':
            fsis_construirInfograficos(p_indicador);
            return;
        case    'INICIAR':
            break;
        default:
            window.alert(MENS_ERR_08 + MENS_48);
            return;
    }
    /*
                       INICIAÇÃO DA APLICAÇÃO
            Criação dos objetos, controles e iniciação de variáveis.
    *
    *
            Primeiro passo: iniciação de variáveis e declaração das variáveis auxiliares locais
    *
    */
    vsis_dados.base_indicadores    = [       // base de dados dos indicadores (ou PROCESSOS e OCORRENCIAS).
                                // campos: [subdiretorio da pasta arquivos JSON que contém os indicadores, nome arquivo do menu, 
                                //          arquivo de populacao, arquivo renda per capita,layer da região]]
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
                            ],
                            ["conferencias-2013",
                             "sisesp_menuconferencias2013.html",
                             "2013_pdad_indicador_populacao.json",
                             "2013_pdad_indicador_renda_percapita.json",
                             "ra31_df"
                            ]];
    // iniciação de endereços: URLs e pastas                            
    vsis_dados.hostname = "http://50.116.27.239";
    vsis_dados.hostname_wms = vsis_dados.hostname + ":8080/geoserver/wms/";
    vsis_dados.pasta_html = "html/"; // subdiretorio abaixo pasta raiz para arquivos html (como os de menus. Exceção: index.html, que fica pasta raiz).
    vsis_dados.hostname_wfs = vsis_dados.hostname + ":8080/geoserver/wfs/";
    vsis_dados.pasta_json = "data_json/"; // subdiretório abaixo pasta raiz para arquivos JSON
    vsis_dados.formulario_comunidade = "sisesp_formularioFeature.html";    
    //  variáveis locais e temporárias
    var vsis_layers_basicos = [],
        vsis_layers_overlays = [],
        vsis_array_equipamentos = [],
        vsis_base,
        vsis_previous_map_scale,
        vsis_save,
        vsis_controls_array,
        vsis_botao_save,
        vsis_draw,
        vsis_deleteFeature,
        vsis_del,
        vsis_control_popup,
        vsis_history,
        vsis_panel,
        vsis_painel_transparencia,
        vsis_timeOut;
    //
    var vsis_mercator =   new OpenLayers.Projection("EPSG:900913"),
        vsis_geographic = new OpenLayers.Projection("EPSG:4326");
    //
    OpenLayers.Lang.setCode("pt-BR");
    OpenLayers.Util.onImageLoadErrorColor = 'transparent';
    (function() {
            $('#Items').selectbox();
    }());
    //          Iniciação de menu de Indicadores
    ddsmoothmenu.init({
        mainmenuid: "smoothmenu-ajax",
        //customtheme: ["#1c5a80", "#18374a"], //override default menu CSS background values? Uncomment: ["normal_background", "hover_background"]
        contentsource: ["id_menuIndicadores", vsis_dados.pasta_html + vsis_dados.base_indicadores[0][1]] //"markup" or ["id_menuIndicadores", "path_to_menu_file"]
    });
    //
    /*
    * DEFINIR OS CONTROLES DE NAVEGAÇÃO SOBRE O MAPA
    *  1 - Propiedades utilizadas:
    *       prefix: a string to be prepended to the current pointers coordinates when it is rendered. 
    *       separator: a string to be used to seperate the two coordinates from each other. 
    *       numDigits: the number of digits each coordinate shall have when being rendered, Defaults to 5.
    *       div: element that contains the control, if not present the control is placed inside the map.
    *
    */
    // SphericalMercator - name given to the projection used by the commercial API providers, such as Google and OpenStreetMap.
    // It has been given the code EPSG:3857, though OpenLayers still uses the older, unofficial EPSG:900913.
    vsis_controls_array = [
            new OpenLayers.Control.Navigation({}),
            //          new OpenLayers.Control.Attribution({div:document.getElementById('id_layers_info'),template:'Camadas Selecionadas: ${layers}'}),
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
    *
                           CRIAR O MAPA
    *
    */
    vsis_dados.map = new OpenLayers.Map('id_map',{
        allOverlays:false,
        PanMethod: OpenLayers.Easing.Quad.easeInOut,
        panDuration:90,
        controls: vsis_controls_array,
        maxExtent: new OpenLayers.Bounds(
            -5501341.25,
            -1961522.68,
            -5118442.68,
            -1629571.93),
        units: 'm',
        numZoomLevels: 26,
        projection: vsis_mercator,
        displayProjection: vsis_geographic,
        eventListeners: {
                    'changebaselayer':fsis_changeLayerBase
        }
    });
    //
    /*
            Notificação da alteração do layer base do mapa
    */
    function fsis_changeLayerBase(p_event){
        fsis_mostrarMsg(MENS_40 + p_event.layer.attribution);
    }
    //
    /*
    *           ADICIONAR "HISTORY CONTROL" PARA O MAPA
    */
    vsis_panel = new OpenLayers.Control.Panel({div:document.getElementById('id_history')});
    vsis_history = new OpenLayers.Control.NavigationHistory({
        'previousOptions': {'title': MENS_44},
        'nextOptions':     {'title': MENS_45}
    });
    vsis_panel.addControls([vsis_history.next,vsis_history.previous]);
    vsis_dados.map.addControls([vsis_history,vsis_panel]);
    /*
    *
        ADICIONAR CONTROLE TRANSPARÊNCIA PARA LAYER DE INDICADORES
    *
    */
    vsis_painel_transparencia = new OpenLayers.Control.Panel({displayClass:'olControlPanelTransparencia'});
    vsis_painel_transparencia.addControls([new OpenLayers.Control.Button({
                                            displayClass: 'olControlTransparencia',
                                            trigger: fsis_transparencia,
                                            type:1,
                                            title:MENS_11
                                            })
    ]);
    vsis_dados.map.addControl(vsis_painel_transparencia);
    //
    /*
    *                              LAYERS
    *                     criar layers e adioná-los ao mapa
    */
    //
    fsis_criarLayersRaster();
    fsis_criarLayersVetoriais();
    //
    /*
                          EQUIPAMENTOS PÚBLICOS
                  criar layers dos equipamentos públicos
                      adicionar os layers ao mapa
    */
    vsis_lista_equipamentos[0][2] = new OpenLayers.Layer.Vector(MENS_24,{
        visibility: false, // Com isto as features só serão carregadas quando o usuário selecionar o layer
        isBaseLayer:false,
        opacity:1,
        displayInLayerSwitcher:true,
        attribution:MENS_24,
        strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Cluster({distance:50,threshold:1})],
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            srsName: "EPSG:900913",
            url: vsis_dados.hostname_wfs,
            featureNS : vsis_dados.hostname + "/catalogcdes",
            featureType: "escolas_df",
            geometryName: "the_geom"
        }),
        filter:new OpenLayers.Filter.Comparison({       // filtro: para separar os terrenos da Secretaria de Educação dos equipamentos escolares realmente existentes.
                type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                property:'situacao',
                value:'VAGO'
        })
    });
    vsis_lista_equipamentos[1][2] = new OpenLayers.Layer.Vector(MENS_26,{
        visibility: false, // Com isto as features só serão carregadas quando o usuário selecionar o layer
        isBaseLayer:false,
        opacity:1,
        displayInLayerSwitcher:true,
        attribution:MENS_26,
        strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Cluster({distance:50,threshold:1})],
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            srsName: "EPSG:900913",
            url: vsis_dados.hostname_wfs,
            featureNS : vsis_dados.hostname + "/catalogcdes",
            featureType: "seguranca_df",
            geometryName: "the_geom"
        })
    });
    vsis_lista_equipamentos[2][2] = new OpenLayers.Layer.Vector(MENS_25,{
        visibility: false, // Com isto as features só serão carregadas quando o usuário selecionar o layer
        isBaseLayer:false,
        opacity:1,
        displayInLayerSwitcher:true,
        attribution:MENS_25,
        strategies: [new OpenLayers.Strategy.BBOX(), new OpenLayers.Strategy.Cluster({distance:50,threshold:1})],
        protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            srsName: "EPSG:900913",
            url: vsis_dados.hostname_wfs,
            featureNS : vsis_dados.hostname + "/catalogcdes",
            featureType: "saude_df",
            geometryName: "the_geom"
        }),
        filter:new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                property:'situacao',
                value:'VAGO'
        })
    });
    for (var i in vsis_lista_equipamentos){
        vsis_lista_equipamentos[i][0] =  new OpenLayers.StyleMap({
                                    'default': new OpenLayers.Style({
                                            strokeColor:"#E8E40F",
                                            fillColor:vsis_lista_equipamentos[i][3],
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
    vsis_lista_equipamentos[i][1] = new OpenLayers.StyleMap({
                                     'default': new OpenLayers.Style({'fillColor':vsis_lista_equipamentos[i][3]}),
                                     'select': new OpenLayers.Style({'strokeWidth':6,'fillOpacity':.4})
    });
    } // for
    //
    // adicionar layers ao mapa
    for (var i in vsis_lista_equipamentos){
        vsis_lista_equipamentos[i][2].styleMap = vsis_lista_equipamentos[i][0];
        vsis_lista_equipamentos[i][2].events.register('visibilitychanged', this, fsis_evMudouVisibilidade);
        vsis_lista_equipamentos[i][2].events.register('featureselected', this, fsis_evFeatureSelected);
        vsis_lista_equipamentos[i][2].events.register('featureunselected', this, fsis_limparAreaIndicadores);
        vsis_dados.map.addLayer(vsis_lista_equipamentos[i][2]);
        vsis_array_equipamentos.push(vsis_lista_equipamentos[i][2]);
    }
    vsis_dados.select_equipamentos = new OpenLayers.Control.SelectFeature(
                                                    vsis_array_equipamentos,
                                                    {
                                                        multiple:false,
                                                        togle:false,
                                                        hover:false,
                                                        toggleKey:'ctrlKey',
                                                        multipleKey:'shiftKey',
                                                        box:false
                                                    }
    );
    vsis_dados.map.addControl(vsis_dados.select_equipamentos);
    vsis_dados.select_equipamentos.deactivate();
    //
    function fsis_evFeatureSelected(p_event){
        vsis_dados.feature_selected = p_event;   // guardar a feature selecionada
        fsis_listarAtributosSelected(MENS_30,NAO_EDITARATRIBUTOS);
    }
    function fsis_listarAtributosSelected(mens,editarAtributos){
        fsis_limparAreaAtributos();
        mens += ' - '+ vsis_dados.feature_selected.feature.layer.attribution;
        document.getElementById('id_indicadores-titulo').innerHTML = mens;
        fsis_montarTabelaAtributos(editarAtributos);
    }
    //
    function fsis_evMudouVisibilidade(p_event) {
        if (vsis_dados.map.getScale() < CLUSTER_SCALE_THRESHOLD) {
            fsis_featuresSemCluster();
        }
        else {
            fsis_featuresComCluster();
        }
    };
    vsis_previous_map_scale = vsis_dados.map.getScale();
    vsis_dados.map.events.register('zoomend', vsis_dados.map, function() {
            if ((vsis_previous_map_scale > CLUSTER_SCALE_THRESHOLD) && (this.getScale() < CLUSTER_SCALE_THRESHOLD)) {fsis_featuresSemCluster()};
            if ((vsis_previous_map_scale < CLUSTER_SCALE_THRESHOLD) && (this.getScale() > CLUSTER_SCALE_THRESHOLD)) {fsis_featuresComCluster()};
            vsis_previous_map_scale = this.getScale();
    });
    function fsis_featuresComCluster(){
        for (var i in vsis_lista_equipamentos){
            vsis_lista_equipamentos[i][2].strategies[1].activate();
            vsis_lista_equipamentos[i][2].styleMap = vsis_lista_equipamentos[i][0];
            vsis_lista_equipamentos[i][2].refresh({force: true});
        }
        fsis_selecionarFeature();
    }
    //
    function fsis_featuresSemCluster(){
        for (var i in vsis_lista_equipamentos){
            vsis_lista_equipamentos[i][2].strategies[1].deactivate();
            vsis_lista_equipamentos[i][2].styleMap = vsis_lista_equipamentos[i][1];
            vsis_lista_equipamentos[i][2].refresh({force: true});
        }
        fsis_selecionarFeature();
    }
    //
    /*
    *
               INFORMAÇÕES GERAIS DAS RAs PARA MONTAGEM DE GRÁFICOS DE
                               CORRELAÇÃO DE INDICADORES
    *
    */
    if (!fsis_buscarInfosRegiao()){return false;}
    //
    /*
    * --------------------------------------------------------------------------
    *
                                CRIAR OS LAYERS RASTER
    *
    * --------------------------------------------------------------------------
    */
    function fsis_criarLayersRaster() {
        vsis_layers_basicos[0] = new OpenLayers.Layer.OSM(MENS_29,
                                           ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                                            "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"],
                                            {attribution: MENS_29 }
        );
        //Osgeo
        vsis_layers_basicos[1] = new OpenLayers.Layer.WMS(
        MENS_28,
        'http://vmap0.tiles.osgeo.org/wms/vmap0',
        {layers: 'basic'},
        {attribution:"OSGeo"}
        );
        //OpenStreetMap
        vsis_layers_basicos[2] = new OpenLayers.Layer.OSM(
                MENS_02
        );
        //
        //Google streets
        vsis_layers_basicos[3] = new OpenLayers.Layer.Google(
                MENS_03,{attribution:MENS_03}
        );
        //Google satellite
        vsis_layers_basicos[4] = new OpenLayers.Layer.Google(
                MENS_04,
                {type: google.maps.MapTypeId.SATELLITE,attribution: MENS_04}
        );
        // Densidade Populacional
        vsis_layers_overlays[0] = new OpenLayers.Layer.WMS(
                'Dens. Pop-2010/DF',
                'http://www.geoservicos.ibge.gov.br/geoserver/CGEO/wms',
                {layers: 'CGEO:C04_DensidPop2010_DF', transparent:false},{attribution:'Dens. População/DF',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
        );        
        // Densidade Populacional
        vsis_layers_overlays[1] = new OpenLayers.Layer.WMS(
                'Dens. Pop-2010/GO',
                'http://www.geoservicos.ibge.gov.br/geoserver/CGEO/wms',
                {layers: 'CGEO:C04_DensidPop2010_GO', transparent:true},{attribution:'Dens. População/GO',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
        );
        //RIDE
        vsis_layers_overlays[2] = new OpenLayers.Layer.WMS(
                MENS_05,
                vsis_dados.hostname_wms,
                {layers: 'cdes:ride_group', transparent:true},{attribution:'DF - RIDE',visibility: false, isBaseLayer:false,opacity:.5,displayInLayerSwitcher:true}
        );
        //Poligono das RAs
        vsis_layers_overlays[3] = new OpenLayers.Layer.WMS(
                MENS_06,
                vsis_dados.hostname_wms,
                {layers: 'cdes:ra31_df',transparent:true},{attribution:'DF - Limites RAs',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
        );
        //Malha das regiões censitárias (IBGE) do DF 
        vsis_layers_overlays[4] = new OpenLayers.Layer.WMS(
                MENS_41,
                vsis_dados.hostname_wms,
                {layers: 'cdes:malhacenso',transparent:true},{minScale:440000,attribution:'Malha Censitária-DF',visibility: false, isBaseLayer:false,opacity:.7,displayInLayerSwitcher:true}
        );
        //WMS LAYER: SETOR
        vsis_layers_overlays[5] = new OpenLayers.Layer.WMS(
                MENS_07,
                vsis_dados.hostname_wms,
                {layers: 'cdes:df_setor',transparent:true},{minScale:220000,attribution:'DF-Setores',visibility: false, isBaseLayer:false,opacity:1,displayInLayerSwitcher:true}
        );
        //WMS LAYER: QUADRAS
        vsis_layers_overlays[6] = new OpenLayers.Layer.WMS(
                MENS_08,
                vsis_dados.hostname_wms,
                {layers: 'cdes:df_quadra',transparent:true},{minScale:55000,attribution:'DF-Quadras',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
        );
        //WMS LAYER: CONJUNTO
        vsis_layers_overlays[7] = new OpenLayers.Layer.WMS(
                MENS_09,
                vsis_dados.hostname_wms,
                {layers: 'cdes:df_conjunto',transparent:true},{minScale:15000,attribution:'DF-Conjuntos',visibility: false, isBaseLayer:false,opacity:.6,displayInLayerSwitcher:true}
        );
        //WMS LAYER: LOTE
        vsis_layers_overlays[8] = new OpenLayers.Layer.WMS(
                MENS_10,
                vsis_dados.hostname_wms,
                {layers: 'cdes:df_lote',transparent:true},{minScale:10000,attribution:'DF-Lotes',visibility: false, isBaseLayer:false,opacity:.7,displayInLayerSwitcher:true}
        );
        //
        // Adicionar layers raster básicos
        for (var i in vsis_layers_basicos) {
            vsis_dados.map.addLayer(vsis_layers_basicos[i])
        };
        // Adicionar layers raster overlays
        for (i in vsis_layers_overlays) {
            vsis_dados.map.addLayer(vsis_layers_overlays[i])
        };
    };
    //
    /*
    * -------------------------------------------------------------------------
    *
                            CRIAR LAYERS VETORIAIS:
                    LAYER DA COMUNIDADE E LAYER DOS INDICADORES
    *
    * --------------------------------------------------------------------------
    */
    function    fsis_criarLayersVetoriais() {
        /*
                          1- LAYER DA COMUNIDADE:
        CRIAR LAYER, PAINEL PARA EDIÇÃO DAS FEATURES E CONTROLES

        Controle para salvar as features  novas ou as modificadas:
            - OpenLayers.Strategy: strategy class para layer vetorial abstrato.  Não instanciado diretamente, mas através de uma subclasse.
            - OpenLayers.Strategy.Save:  uma strategy para commit das novas features ou das modificadas.
            - por default, a strategy espera por uma chamada "save" para salvar (persistir) as mudanças.
            - quando da criação do layer da comunidade logo adiante, será associado esta strategy a este layer.
        */
        vsis_save = new OpenLayers.Strategy.Save();
        vsis_save.events.register("success", '', fsis_mostrarMensSucesso);
        vsis_save.events.register("fail", '', fsis_mostrarMensInsucesso);
        vsis_botao_save = new OpenLayers.Control.Button({
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
        vsis_dados.layer_comunidade = new OpenLayers.Layer.Vector(MENS_34, {
            strategies: [new OpenLayers.Strategy.BBOX(), vsis_save],
            projection: vsis_geographic,
            protocol: new OpenLayers.Protocol.WFS({
                version: "1.0.0",
                srsName: "EPSG:4326",
                url: vsis_dados.hostname_wfs,
                featureNS :  vsis_dados.hostname + "/catalogcdes",
                featureType: "comunidade",
                geometryName: "the_geom",
                schema: vsis_dados.hostname_wfs + "/DescribeFeatureType?version=1.0.0&typename=cdes:comunidade",
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
            vsis_dados.feature_selected = e; // guarda a identificação da feature selecionada
            fsis_listarAtributosSelected(MENS_47,EDITARATRIBUTOS);
        }
        //              Definir os estilos das features pertencente ao layer da comunidade
        vsis_dados.layer_comunidade.styleMap = new OpenLayers.StyleMap({ 
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
        vsis_dados.control_feature_comunidade = new OpenLayers.Control.SelectFeature(
                vsis_dados.layer_comunidade,
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
        vsis_panel = new OpenLayers.Control.Panel({
            displayClass: 'customEditingToolbar',
            allowDepress: true
        });
        //              Controle para marcar novo ponto no mapa
        vsis_draw = new OpenLayers.Control.DrawFeature(
            vsis_dados.layer_comunidade , OpenLayers.Handler.Point,
            {
                title: MENS_31,
                displayClass: "olControlDrawFeaturePoint",
                multi: false
            }
        );
        //              controle para deletar ponto inserido no mapa
        vsis_deleteFeature = OpenLayers.Class(OpenLayers.Control, {
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
                    this.layer.events.triggerEvent("afterfeaturemodified",{feature: feature});
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
        vsis_del =  new vsis_deleteFeature(vsis_dados.layer_comunidade , {title: MENS_32});
        // Controles para informações literais (POPUP)
        vsis_dados.feature_info = new OpenLayers.Control.WMSGetFeatureInfo({
            url: vsis_dados.hostname_wms,
            title: "",
            queryVisible: true,
            eventListeners: {
                "getfeatureinfo": function(event) {
                    var htmlString = MENS_14;
                    var anchor, closeButtonX;
                    var popup = new OpenLayers.Popup.FramedCloud(
                        MENS_13,
                        vsis_dados.map.getLonLatFromPixel(event.xy),
                        null,
                        htmlString+event.text,
                        anchor=null,
                        closeButtonX=true
                    );
                    popup.autoSize = true;
                    popup.maxSize = new OpenLayers.Size(500,300);
                    vsis_dados.map.addPopup(popup);
                }
            }
        });
        vsis_control_popup = new OpenLayers.Control.Button({
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
            vsis_dados.botao_info = false;
            fsis_selecionarFeature();
            fsis_mostrarMsg(MENS_38);
        };
        function fsis_ativarInfo(){
            vsis_dados.botao_info = true;
            fsis_selecionarFeature();
        }
        //
        // Adicionar ao mapa o painel e os controles (e ativa-los)
        vsis_panel.addControls([vsis_dados.feature_info,vsis_botao_save,vsis_draw,vsis_del,vsis_control_popup,vsis_dados.control_feature_comunidade]);
        vsis_dados.map.addControl(vsis_panel);
        //
        /*
            2- LAYER VETORIAL DAS RAs PARA ESTILIZAÇÃO DOS INDICADORES
        */
        vsis_dados.layer_regioes = new OpenLayers.Layer.Vector(MENS_35,{
            styleMap: new OpenLayers.StyleMap(
                new OpenLayers.Style({
                    'fillColor':'${ra_prefifo}',
                    'strokeColor':'#000000',
                    'fillOpacity':1
                })
            ),
            attribution:"Indicadores"
        });
        //
        vsis_dados.map.addLayers([vsis_dados.layer_comunidade, vsis_dados.layer_regioes]);
        // Deixar o centro do mapa no Distrito Federal
        vsis_dados.map.setCenter(new OpenLayers.LonLat(-5330000,-1780000),10);
        if (!vsis_dados.map.getCenter()){vsis_dados.map.zoomToMaxExtent()};
    } // fim função fsis_criarLayersVetoriais
    //
    /*
    * --------------------------------------------------------------------------
    *
    *      FUNCAO DE CONTROLE DA TRANSPARENCIA PARA O LAYER DOS INDICADORES
    *
    * --------------------------------------------------------------------------
    */
    //  Chamada por click do usuário no botão disponível sobre o mapa
    function fsis_transparencia(){
            if(vsis_dados.layer_regioes.opacity === 0){
                vsis_dados.layer_regioes.setOpacity(.3);
            }
            else if (vsis_dados.layer_regioes.opacity === .3){
                vsis_dados.layer_regioes.setOpacity(.5);
            }
            else if (vsis_dados.layer_regioes.opacity === .5){
                vsis_dados.layer_regioes.setOpacity(.7);
            }
            else if (vsis_dados.layer_regioes.opacity === .7){
                vsis_dados.layer_regioes.setOpacity(1);
            }
            else {
                vsis_dados.layer_regioes.setOpacity(0);
            }
    }
    /*
    * --------------------------------------------------------------------------
    *
      BUSCAR INFORMAÇÕES BÁSICAS DA REGIÃO A SER TRABALHADA COM OS INFOGRÁFICOS
                      População, renda per capita e a geometria
    *
    * --------------------------------------------------------------------------
    */
    function fsis_buscarInfosRegiao(){
        var vsis_semerro = true;
        vsis_base = vsis_dados.base_indicadores[document.getElementById("Items").selectedIndex];
        //
        fsis_buscarPopulacao(); // buscar populacao de cada região
        fsis_buscarPercapita(); // buscar renda per capita de cada região
        fsis_buscarGeometria(); // buscar a geometria da região
        //
        return true;
        //
        /*
            Buscar populacao das regiões a serem mostradas nos Infográficos
        */
        function fsis_buscarPopulacao(){
            var vsis_protocol2 = new OpenLayers.Protocol.HTTP({
                    url:vsis_dados.pasta_json + vsis_base[0] + '/'+ vsis_base[2],
                    format: new OpenLayers.Format.JSON({})
            });
            vsis_dados.populacao = vsis_protocol2.read({callback:_CallBackpopulacao});
            function _CallBackpopulacao(p_resp){
                try{
                    if (p_resp.features == null) throw MENS_01 + MENS_22;
                    if (p_resp.error != null) throw MENS_01 + MENS_22;
                }
                catch(p_err){
                    if (vsis_semerro == true){
                        vsis_semerro = false;
                        window.alert(MENS_ERR_02 + p_err);
                    }
                }
            }
        } // fim função fsis_infogeraispopulacao
        //
        /*
            Buscar renda per capita das regioes a serem mostradas nos Infográficos
        */
        function fsis_buscarPercapita(){
            var vsis_protocol2 = new OpenLayers.Protocol.HTTP({
                url:vsis_dados.pasta_json + vsis_base[0] + '/' + vsis_base[3],
                format: new OpenLayers.Format.JSON({})
            });
            vsis_dados.percapita = vsis_protocol2.read({callback:_CallBackpercapita});
            function  _CallBackpercapita(p_resp){
                try{
                    if (p_resp.features == null) throw MENS_01 + MENS_22;
                    if (p_resp.error != null) throw MENS_01 + MENS_22
                }
                catch(p_err){
                    if (vsis_semerro == true){
                        vsis_semerro = false;
                        window.alert(MENS_ERR_03 + p_err);
                    }
                }
            }
        } // fim função fsis_infogeraispercapita
        //
        /*
            Buscar a geometria das regioes a serem trabalhadas com os Infográficos
        */
        function fsis_buscarGeometria(){
            var vsis_protocolo = new OpenLayers.Protocol.WFS({
                version: "1.1.0",
                url: vsis_dados.hostname_wfs,
                featureType: vsis_base[4],
                featureNS: vsis_dados.hostname + "/catalogcdes",
                srsName: "EPSG:900913",
            });
            vsis_dados.features_regioes = vsis_protocolo.read({callback:_CallBackgeometria});
            function _CallBackgeometria (p_resp) {
                try{
                    if (p_resp.features == null) throw MENS_21 + MENS_22;
                    if (p_resp.error != null) throw MENS_21 + MENS_22;
                }
                catch(p_err){
                    if (vsis_semerro == true){
                        vsis_semerro = false;
                        window.alert(MENS_ERR_01 + p_err);
                    }
                }

            }
        }  // fim função fsis_infogeraisgeometria
    } // fim função fsis_buscarInfosRegiao()
    //
    /*
    * --------------------------------------------------------------------------
    *
                    FUNCAO PARA CONSTRUIR OS INFOGRAFICOS
    *
    * --------------------------------------------------------------------------
    */
    function fsis_construirInfograficos(identf){
        var vsis_protocol1;
        vsis_dados.layer_regioes.setVisibility(true);
        fsis_limparPainel();
        vsis_base = vsis_dados.base_indicadores[document.getElementById("Items").selectedIndex][0];
        vsis_protocol1 = new OpenLayers.Protocol.HTTP({
                    url:vsis_dados.pasta_json + vsis_base + '/' + identf,
                    format: new OpenLayers.Format.JSON({})
        });
        vsis_dados.layer_indicadores = new OpenLayers.Layer.Vector('Indicadores',{
                    protocol: vsis_protocol1,
                    strategies:[new OpenLayers.Strategy.Fixed()],
                    visibility:true,isBaseLayer:false,displayInLayerSwitcher:true
        });
        //        vsis_protocol1.read({callback: _callBack2});
        vsis_protocol1.read({callback: fsis_callBack2});
        //
        function fsis_callBack2 (p_indices) {
            // Variáveis locais:
            var vsis_limiarquartis = [], vsis_infosregioes=[],vsis_infosgraficos=[],vsis_regioesnoquartil=[], vsis_media, vsis_total=0, vsis_desvio, vsis_indicepercapita;
            var vsis_classespaleta = ["a","b","c","d","e","f"];  // até 6 faixas de classificação
            //
            try{
                if (p_indices.features == null) throw MENS_16 + identf + MENS_17 + MENS_22;
                if (p_indices.error != null) throw MENS_18 + identf + '. '+ MENS_22;
                if (vsis_dados.features_regioes.features == null) throw MENS_19 + MENS_22;
            }
            catch(p_err){
                window.alert(MENS_ERR_04 + p_err);
                return false; // retorna, não continuando a execução da função fsis_indicadores
            }
            // PARTE-1: iniciar as informações dos segmentos
            // vsis_limiarquartis: limiar dos quartis, definido no arquivo JSON do indicador escolhido;
            for (var i = 0, len = (p_indices.features.indicador.quartis).length; i < len; i++){
                vsis_limiarquartis.push([p_indices.features.indicador.quartis[i].qi,p_indices.features.indicador.quartis[i].qs]);
            }
            // PARTE-2: preparar as informações para estilizar o mapa, segundo os estilos do quartil
            for (var i = 0, len = ( p_indices.features.indices).length; i < len; i++ ){
                // laço maior dentro do arquivo JSON do indicador escolhido pelo usuário
                // uma passagem para casa região presente no arquivo JSON deste indicador
                //
                // verificar se o índice da região veio definido no arquivo JSON
                if ( p_indices.features.indices[i].indice < 0 ) {
                    // Índice não veio definido no arquivo JSON.
                    vsis_infosregioes.push([
                                        p_indices.features.indices[i].indice,
                                        p_indices.features.indices[i].RA,
                                        p_indices.features.indices[i].romano,
                                        vsis_paletaregioes.length-1, // quartil: classifico no último quartil
                                        vsis_paletaregioes[vsis_paletaregioes.length-1][1]
                    ]);
                }
                else {
                    // Índice veio definido normalmente no arquivo JSON.
                    for (var j = 0; j < p_indices.features.indicador.num_quartis; j++) {
                        // vsis_infosregioes: composta por 5 campos: [ [indice,nome da região, romano, quartil,style],[...] ];
                        if ( p_indices.features.indices[i].indice <= vsis_limiarquartis[j][1] ) {
                                vsis_infosregioes.push([
                                                    p_indices.features.indices[i].indice,
                                                    p_indices.features.indices[i].RA, 
                                                    p_indices.features.indices[i].romano,
                                                    j, // quartil
                                                    vsis_paletaregioes[j][1]
                                ]);
                                break;
                        }
                    }
                }
            } // for
            // fim da PARTE-2
            // PARTE-3: preparar as informações para construir os infograficos, segundo os estilos do quartil
            // zerar a contagem das regiões em cada quartil
            for (var i in p_indices.features.indicador.quartis) vsis_regioesnoquartil.push([0,"",0]);
            // laço: uma passagem para casa região presente no arquivo JSON do indicador escolhido pelo usuário
            rot_regioesindice: for (var i in p_indices.features.indices ){
                // verificar se o índice da região veio definido no arquivo JSON
                if ( p_indices.features.indices[i].indice < 0 ) {
                    // Índice não veio definido no arquivo JSON.
                    continue rot_regioesindice;
                }
                // identificação da renda percapita da região
                for (var m in vsis_dados.percapita.features.indices){
                    if ( p_indices.features.indices[i].romano == vsis_dados.percapita.features.indices[m].romano ){
                        vsis_indicepercapita = vsis_dados.percapita.features.indices[m].indice;
                        break;
                    }
                }
                // identificação de cada região em relação aos quartis.
                for (var j = 0; j < p_indices.features.indicador.num_quartis; j++) {
                    if ( p_indices.features.indices[i].indice <= vsis_limiarquartis[j][1] ) {
                        vsis_infosgraficos.push([
                                                    p_indices.features.indices[i].indice,
                                                    p_indices.features.indices[i].RA,
                                                    p_indices.features.indices[i].romano,
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
                if ( p_indices.features.indices[i].indice >= 0) {
                    // neste caso o índice existe.  Somar a população.
                    for (var k = 0; k < vsis_dados.populacao.features.indices.length; k++){
                        if ( p_indices.features.indices[i].romano == vsis_dados.populacao.features.indices[k].romano ){
                            vsis_regioesnoquartil[j][2] += vsis_dados.populacao.features.indices[k].indice;
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
            var MENS1 = p_indices.features.indicador.titulo.substr(0,52);
            var MENS2 = '<explicacao2><span class="indi_titulo2">' + MENS_59 + ':</span><br />* ' + MENS_65 + ': ' +
                    p_indices.features.indicador.unidade.substr(0,75) +'<br /> * ' + MENS_60 + ': ' + vsis_media.toFixed(2) +
                    '<br /> * ' + MENS_61 + ' : ' + vsis_desvio.toFixed(2) + '</explicacao2>';
            var MENS3 = '<explicacao2><span class="indi_titulo2">' + MENS_59 + ':</span><br />* ' + MENS_62 + ': '+ p_indices.features.indicador.descricao.substr(0,84) +
                    '<br /> * ' + MENS_63 + ': ' + p_indices.features.indicador.ano.substr(0,4) +
                    '<br /> * ' + MENS_64 + ': ' + p_indices.features.indicador.fonte.substr(0,75) + '<br /></explicacao2>';
            document.getElementById('id_indicadores-titulo').innerHTML = '';
            document.getElementById('id_indicadores-titulo').innerHTML = MENS1;
            document.getElementById('id_indicadores-1').innerHTML = '';
            document.getElementById('id_indicadores-1').innerHTML = MENS3;
            document.getElementById('id_indicadores-2').innerHTML = '';
            document.getElementById('id_indicadores-2').innerHTML = MENS2;
            // plotar os gráficos e mostrar o mapa estilizado de acordo com os índices
            //      - duas áreas de indicadores (informações agregadas e desagregadas) e uma área do mapa
            fsis_estilizarRegioes(vsis_infosregioes);
            try {
            if (window.d3 === undefined) { throw MENS_58; }
            }
            catch(p_err) {
                    window.alert(MENS_ERR_09 + p_err);
                    return false;
            }
            fsis_plotarGraficoRank(vsis_infosgraficos);
            fsis_plotarGraficoQuantidade(vsis_regioesnoquartil);
            fsis_plotarGraficoPopulacao(vsis_regioesnoquartil);
            fsis_plotarGraficoDispersao(vsis_infosgraficos);
        } // fim callback
    } // Fim função fsis_construirInfograficos()
    /*
    * --------------------------------------------------------------------------
    *
                        LIMPAR OS INFOGRÁFICOS E AS FEATURES 
                              DO LAYER DE INDICADORES
    
    * --------------------------------------------------------------------------
    */
    function fsis_limparPainel(){
        try{
            vsis_dados.layer_regioes.removeAllFeatures();
            document.getElementById('id_indicadores-titulo').innerHTML = MENS_20;
            document.getElementById('id_indicadores-1').innerHTML = '';
            document.getElementById('id_indicadores-2').innerHTML = '';
        }
        catch(p_err){
            window.alert(MENS_ERR_06 + MENS_23 + MENS_22);
            return false;
        }
        return true;
    }
    //
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
        if (!vsis_dados.botao_info){
            vsis_dados.control_feature_comunidade.deactivate();
            vsis_dados.feature_info.deactivate();
            vsis_dados.select_equipamentos.deactivate();
            fsis_mostrarMsg(MENS_38);
        }
        else {
            var e = document.getElementById("id_infos");
            if (e.selectedIndex == 0) {
                // "WMS"
                vsis_dados.control_feature_comunidade.deactivate();
                vsis_dados.select_equipamentos.deactivate();
                vsis_dados.feature_info.activate();
                fsis_mostrarMsg(MENS_39 + e.options[e.selectedIndex].innerHTML);
            }
            else if (e.selectedIndex == 1) {
                // "Comunidade"
                vsis_dados.feature_info.deactivate();
                vsis_dados.select_equipamentos.deactivate();
                vsis_dados.control_feature_comunidade.activate();
                fsis_mostrarMsg(MENS_39 + e.options[e.selectedIndex].innerHTML);
            }
            else if (e.selectedIndex == 2) {
                //  "Equipamentos"
                vsis_dados.feature_info.deactivate();
                vsis_dados.control_feature_comunidade.deactivate();
                if (vsis_dados.map.getScale() < CLUSTER_SCALE_THRESHOLD){
                    vsis_dados.select_equipamentos.activate();
                    fsis_mostrarMsg(MENS_39 + e.options[e.selectedIndex].innerHTML);
                }
                else {
                    vsis_dados.select_equipamentos.deactivate();
                    fsis_mostrarMsg(MENS_38);
                }
            }
            else { alert(MENS_46)}
        }
    }
    //
    /*
    * --------------------------------------------------------------------------
    *
            ESTILIZAR AS REGIÕES DO MAPA DE ACORDO COM OS INDICADORES
    *
    * --------------------------------------------------------------------------
    */
    function fsis_estilizarRegioes(vsis_infosregioes){
        //vsis_infosregioes: composta por 5 campos: [ [indice,nome da região, romano, quartil,style,[...] ];
        var vsis_tamanho =  vsis_dados.features_regioes.features.length,
            vsis_tamanho2 = vsis_infosregioes.length;
        for (var i=0; i < vsis_tamanho; i++){
            for (var j=0; j < vsis_infosregioes.length; j++){
                if (vsis_dados.features_regioes.features[i].attributes.romano == vsis_infosregioes[j][2]){
                    vsis_dados.features_regioes.features[i].attributes.ra_prefifo = vsis_paletaregioes2[vsis_infosregioes[j][3]][1];
                    break;
                }
            }
            try{
                if (j == vsis_tamanho2){
                    vsis_dados.features_regioes.features[i].attributes.ra_prefifo = QUARTILINDEFINIDO; /* Preto: para estilizar região do mapa referente à RA que não fora encontrada suas informações */
                    throw MENS_27 + vsis_dados.features_regioes.features[i].attributes.nome;
                }
            }
            catch(p_err){
                window.alert(MENS_ERR_07 + p_err);
            }
        }
        vsis_dados.layer_regioes.addFeatures(vsis_dados.features_regioes.features);
    }
    //
    /*
    * --------------------------------------------------------------------------
    *
           PLOTAR GRÁFICO: gráfico de dispersao
    *
    * --------------------------------------------------------------------------
    */
    // Gráfico de Dispersão: renda per capita x indicador
    function fsis_plotarGraficoDispersao(p_infos_RA) {
        var width = 250;
        var height = 180;
        var color = d3.scale.ordinal()
            .domain(["chart0","chart1","chart2","chart3","chart4","chart5"])
            .range([QUARTIL0,QUARTIL1,QUARTIL2,QUARTIL3,QUARTIL4,QUARTIL5]);
        var escalax=  d3.scale.linear()
            .domain([d3.min(p_infos_RA,function(d){return d[0];}), d3.max(p_infos_RA,function(d){return d[0];})])
            .range(["1em","20em"]);
        var  escalay=  d3.scale.linear()
            .domain([0, d3.max(p_infos_RA,function(d){return d[5];})])
            .range(["8em","1em"]);
        d3.select("#id_indicadores-2")
            .append("meutexto")
            .text(MENS_51);
        var svg = d3.select("#id_indicadores-2")
            .append("svg")
            .attr("width",width)
            .attr("height",height)
            .attr("id","scatterplot");
        svg.selectAll("circle")
            .data(p_infos_RA)
            .enter()
            .append("circle")
            .attr("cx",function(d){return escalax(d[0]);})
            .attr("cy",function(d){return escalay(d[5]);})
            .attr("r",4)
            .attr("fill",function(d){return color(d[4]);});
    }
    /*
    * --------------------------------------------------------------------------
    *
            PLOTAR GRÁFICO: população por faixa (partição)
    *
    * --------------------------------------------------------------------------
    */
    //  Gráfico em pizza com % da população por faixa segmentada
    function fsis_plotarGraficoPopulacao(p_quartil){
        var width  = 100;
        var height = 100;
        var dataset = [];
        var vsis_populacaototal = 0;
        //
        d3.select("#id_indicadores-2")
            .append("meutexto")
            .text(MENS_49)
        for (var i in p_quartil)vsis_populacaototal += p_quartil[i][2];
        for (var i in p_quartil)dataset.push((p_quartil[i][2]*100/vsis_populacaototal).toFixed(1));
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
            .text(function(d) {return d.value;})
            .attr("font-family", "sans-serif")
            .attr("font-size", "9px")
    }
    /*
    * --------------------------------------------------------------------------
    *
            PLOTAR GRÁFICO: quantidade de regiões por faixa (partição)
    *
    * --------------------------------------------------------------------------
    */
    //  Gráfico em barras com quantidade de regioes por faixa segmentada
    function fsis_plotarGraficoQuantidade(p_quartil) {
        var width  = 150;
        var height = 100;
        var dataset = [];
        for (var i in p_quartil)dataset.push(p_quartil[i][0]);
        var yScale = d3.scale.linear()
             .domain([0, d3.max(dataset)])
             .range([10, height]);
        var color = d3.scale.ordinal()
            .domain(["chart0","chart1","chart2","chart3","chart4","chart5"])
            .range([QUARTIL0,QUARTIL1,QUARTIL2,QUARTIL3,QUARTIL4,QUARTIL5]);
        //Create SVG element
        d3.select("#id_indicadores-2 div").remove();
        d3.select("#id_indicadores-2")
            .append("meutexto")
            .text(MENS_50)
        d3.select("#id_indicadores-2")
            .append("grafico2")
            .attr("class", "chartsvg");
        var svg = d3.select("#id_indicadores-2 grafico2")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x",function(d, i) {
                return i * (width / dataset.length);
             })
            .attr("y", function(d) {
                return height - yScale(d);
            })
            .attr("width",20)   
            .attr("height", function(d) {
                return yScale(d);
            })       
            .attr("fill",  function(d, i) {return color(i);});
        svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text (function(d) { return d; })
            .attr ("x", function(d,i) {
                return i * (width / dataset.length) + 7;
            })
            .attr("y", function(d) {
                return height - yScale(d) + 14;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
    }
    //
    /*
    * --------------------------------------------------------------------------
    *
            PLOTAR GRÁFICO: regiões ordenadas por seus indices em "termometros"
    *
    * --------------------------------------------------------------------------
    */
    //  Plotagem índices das regiões na forma de termometros de "rankiamento"
    function fsis_plotarGraficoRank(p_infos_RA){
        var escala=  d3.scale.linear()
            .domain([0, d3.max(p_infos_RA,function(d){return d[0];})])
            .range(["1.5em","22em"]);
        d3.select("#id_indicadores-1 div").remove();
        d3.select("#id_indicadores-1")
            .append("div")
            .attr("class", "chart")
            .selectAll("div.line")
            .data(p_infos_RA)
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
            vsis_timeOut = setTimeout("document.getElementById('id_layers_info').innerHTML = ''",7000);
    }
    //
    /*
    * --------------------------------------------------------------------------
    *
    *                      EDITAR ATRIBUTOS DE LAYER VETORIAL COMUNIDADE
    *
    * --------------------------------------------------------------------------
    */
    // Utilizado para os atributos do Layer Vetorial da Comunidade
    function fsis_editarAtributosComunidade(){
        var resp = showModalDialog(vsis_dados.pasta_html + vsis_dados.formulario_comunidade,
                    [MENS_52,MENS_53,MENS_54],"dialogwidth:550;dialogheight:340;resizable:no;status:no;scroll:no;dialogLeft:350;dialogTop:280;");
        if (resp != null){
            vsis_dados.layer_comunidade.selectedFeatures[0].attributes.nome = resp[0];
            vsis_dados.layer_comunidade.selectedFeatures[0].attributes.descricao = resp[1];
            vsis_dados.layer_comunidade.selectedFeatures[0].attributes.comentario = resp[2];
            vsis_dados.layer_comunidade.selectedFeatures[0].attributes.categoria = resp[3];
            if (vsis_dados.layer_comunidade.selectedFeatures[0].state == null ){
                vsis_dados.layer_comunidade.selectedFeatures[0].state = OpenLayers.State.UPDATE; // preparar status para Strategy.Save()
            }
            fsis_montarTabelaAtributos(EDITARATRIBUTOS);
        }
    }
    //
    /*
    * --------------------------------------------------------------------------
    *
                          MONTAR TABELA DE ATRIBUTOS
    *
    * --------------------------------------------------------------------------
    */
    // Utilizado para os atributos dos Layers vetoriais: da Comunidade e dos equipamentos públicos
    function fsis_montarTabelaAtributos(editarAtributos){
        fsis_limparAreaAtributos();
        $("<p></p><table><tr><th>"+ MENS_55 + "</th><th>" + MENS_56 + "</th></tr>").appendTo("#id_indicadores-1");
        for (var i in vsis_dados.feature_selected.feature.attributes){
            $("<tr><td>"+i+"</td><td>"+vsis_dados.feature_selected.feature.attributes[i]+"</td></tr>").appendTo("#id_indicadores-1 table");
        }
        if (editarAtributos){
            $("<tr><th></th><th><button class='myButton3' onclick='fsis_principal(\"EDITARATRIBUTOS\");'>" + MENS_57 + "</button></th></tr>").appendTo("#id_indicadores-1 table");
        }
    }
    /*
    * --------------------------------------------------------------------------
    *
                          LIMPAR ÁREA DA TELA DOS INDICADORES
    *
    * --------------------------------------------------------------------------
    */
    function fsis_limparAreaIndicadores(){
        $("#id_indicadores-1").empty();
        $("#id_indicadores-2").empty();
        $("#id_indicadores-titulo").empty();
    }
    /*
    * --------------------------------------------------------------------------
    *
                          LIMPAR ÁREA DA TELA DOS ATRIBUTOS
    *
    * --------------------------------------------------------------------------
    */
    function fsis_limparAreaAtributos(){
        $("#id_indicadores-1").empty();
        $("#id_indicadores-2").empty();
    }
}  // Fim função fsis_principal()
//
