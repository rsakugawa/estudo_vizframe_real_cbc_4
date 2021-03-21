sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator", 
    "../model/formatter",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem" ,
    "sap/ui/core/routing/History",  
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, Filter, FilterOperator, formatter, FlattenedDataset, FeedItem, History ) {
		"use strict";

		return Controller.extend("estudovizframerealcbc.controller.ViewChart", {
            formatter: formatter,
			onInit: function () {

                // Busca parametros enviados(argumentos) na rota
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.getRoute("RouteViewChart").attachPatternMatched((oEvent) => {
                  let oArgs = oEvent.getParameter("arguments");
      
                  this._timeColumnChart(oArgs); // Chama função enviando parametros
                }, this);

			}, // Fim Init

            _timeColumnChart: function (args) {
     
              // Cria um modelo vazio e seta na View(atual) com o nome "ODataSelectedToTable"
                this.getView().setModel(
                  new JSONModel([
                    {
                      WORKCENTER: "",
                      TOTAL: "",
                      PERC_APPROVED: "",
                      PERC_REPROVED: "",
                      VALUE_APPROVED: "",
                      VALUE_REPROVED: "",
                      PRODH: "",
                      WERKS: "",
                      TIME: "",
                    },
                  ]),
                  "ODataSelectedToTable"
                );
      
               // Cria filtro com os argumentos da primeira tela  
                let filters = [
                  new Filter("WERKS", FilterOperator.EQ, args.werks),
                  new Filter("DATE", FilterOperator.EQ, args.date),
                  new Filter("PRODH", FilterOperator.EQ, args.prodh),
                  new Filter("WORKCENTER", FilterOperator.EQ, args.workcenter),
               ];
      
               // Faz a leitura no backend passando o parâmetro
                this.getOwnerComponent()
                  .getModel()
                  .read("/AponTotSet", {
               //     filters,
      
                    success: function (oData) {

                      // salva retorno do Odata (results) 
                      let dataModel = oData.results;

      
                      // Define tipo de gráfico  
                      var timeAxisColumnChart = this.getView().byId( "timeAxisColumnChart");
                            timeAxisColumnChart.setVizType("timeseries_column");
      
                      // Declara array dos gráficos       
                      let result = [];
                      let aMeasures = [];
                      let aMeasuresFeeds = [];

                      // Loop na retorno do Odata (dataModel)
                      for (const {
                        WORKCENTER,
                        TOTAL,
                        PERC_APPROVED,
                        PERC_REPROVED,
                        VALUE_APPROVED,
                        VALUE_REPROVED,
                        WERKS,
                        PRODH,
                        TIME,
                      } of dataModel) {

                        // Alimenta aMeasures
                        // Measures é as colunas , exemplo:
                        // name: JAVA
                        // value: {JAVA}
                        aMeasures.push({
                          name: `${WORKCENTER}`,
                          value: `{${WORKCENTER}}`,
                        });
      
                       // Alimenta aMeasuresFeeds
                       // IndexOf busca o "tipo e valor" se não existe no
                       // array, vai voltar -1, ai insere..senao nao faz nada
                        // ? = Se encontrou no IF e ':' seria o ELSE 
                        // Lógica para nao inserir duplicado
                        //MeasureFeed é somente o nome exemplo: [JAVA]


                        aMeasuresFeeds.indexOf(WORKCENTER) === -1
                          ? aMeasuresFeeds.push(WORKCENTER)
                          : null;
      
                        // Alimenta array principal do gráfico
                        // Obs: Nessa lógica abaixo tem '({ ' e diferente do push acima
                        // insere nome de campo e valor...e nao somente o valor
                        result.push({
                          TIME: this.formatter.formatDate(TIME), // função no formatter
                          [WORKCENTER]:
                            Number(TOTAL) === 0
                              ? Number(TOTAL) + 0.001
                              : Number(TOTAL),
                          WORKCENTER,
                          PERC_APPROVED,
                          PERC_REPROVED,
                          VALUE_APPROVED,
                          VALUE_REPROVED,
                          WERKS,
                          PRODH,
                          TOTAL,
                        });
                      } // Fim do FOR

                      debugger;
      
                      // Grava array principal em modelo
                      // DÚVIDA: Apesar do array principal ter vários campos
                      // só vai pro grafico o que constar na measures/dimensions
                      let oModel = new JSONModel();
                      oModel.setData(result);
                      oModel.refresh();
     
                      // Inicia criação de gráfico
                      // Define dimensoes
                      let oDataset = new FlattenedDataset({
                        dimensions: [
                          {
                            name: "TIME",
                            value: "{TIME}", //Esse Time vem do /AponTotSet..fica em loop??
                            dataType: "date",
                          },
                        ],
                        // Define Measures c/ array alimentado acima
                        measures: aMeasures,
                        data: {
                          path: "/",
                        },
                      });
      
                      // Seta dimensoes/measures    
                      timeAxisColumnChart.setDataset(oDataset);

                      // Incluí modelo com os dados principais
                      timeAxisColumnChart.setModel(oModel);
      
                      // Cria FeedItem
                      let feedValueAxisActual = new FeedItem({
                        uid: "valueAxis",
                        type: "Measure",
                        values: aMeasuresFeeds,
                      }),
                      feedTimeAxis = new FeedItem({
                        uid: "timeAxis",
                        type: "Dimension",
                        values: ["TIME"],
                      });
    
                    // Seta FeedItem  
                    timeAxisColumnChart.removeAllFeeds();
                    timeAxisColumnChart.addFeed(feedValueAxisActual);
                    timeAxisColumnChart.addFeed(feedTimeAxis);

                    // Define propriedades do gráfico
                      timeAxisColumnChart.setVizProperties({
                        legendGroup: {
                          layout: {
                            position: "bottom",
                          },
                        },
                        legend: {
                          ignoreNoValue: true,
                        },
                        title: {
                          visible: false,
                        },
                        plotArea: {
                          dataLabel: {
                            visible: false,
                          },
                          window: {
                            start: "firstDataPoint",
                            end: "lastDataPoint",
                          },
                          dataPointSize: {
                            min: 60,
                            max: 60,
                          },
                        },
                        dataLabel: { visible: true, showTotal: true },
                        valueAxis: {
                          title: {
                            visible: false,
                          },
                        },
                        timeAxis: {
                          title: {
                            visible: false,
                          },
                          levels: ["hour"],
                        },
                        title: {
                          visible: false,
                        },
      
                        uiConfig: {
                          applicationSet: "fiori",
                        },
                      });

                    }.bind(this),
                    error: function (e) {},
                  });
              },


            // Retorna para tela de filtro
			onNavBack: function () {

				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("RouteViewFilter");

			}	

		});
	});
