sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller,JSONModel, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("estudovizframerealcbc.controller.ViewFilter", {
			onInit: function () {

				//1. Carregando inicial do EntitySet "VH_WerksSet" para incluir no combobox de Centro
				//1.1 Faz a leitura do EntitySet
				this.getOwnerComponent()
				.getModel()
				.read("/VH_WerksSet", {
				  // Se leu com sucesso	
				  success: function (oData) {
					
					//Pega o resultado da leitura
					let oDataModel = oData.results;
	                
					// Cria um JSONModel
					let werksModel = new JSONModel(oDataModel);
	                
					//Para a View Atual, seta o modelo com a variavel do modelo e 
					// o nome que o modelo terá na view "werksOdata"
 					this.getView().setModel(werksModel, "werksOdata");
				  }.bind(this),
				  error: function (e) {},
				});

			}, // Fim onInit

			  
			onChangeWerks: function (oEvent) {

				// 1 . Busca centro selecionado na tela, fazer filtro, buscar os centros de trabalhos
				// no backend e carregar o modelo que está setado na tela para o combobox de centro
				// de trabalho
				// Busca o Werks selecionado na tela
				   let currentWerks = oEvent.getSource().getSelectedKey();
  
				// Busca o controle do Centro de Trabalho pelo ID "workcenterComboBox"
				// e limpa o combobox
				this.getView().byId("idWorkcenterComboBox").setSelectedKey("");
	  
				// Cria filtro usando o WERKS (nome do campo que consta no backend
				// como parametro de entrada..ver SEGW) e o currentWerks é o centro selecionado
				// em tela 
				let filters = [new Filter("WERKS", FilterOperator.EQ, currentWerks)];

				// Lê o EntitySet de centro de trabalho passando o filtro
				this.getOwnerComponent()
				  .getModel()
				  .read("/VH_ArbplSet", {
					filters,
					success: function (oData) {
					  let oDataModel = oData.results;
	  
					  let workcenterModel = new JSONModel(oDataModel);
	                  
					  // o nome que o modelo terá na view "workcenterOdata"
					  this.getView().setModel(workcenterModel, "workcenterOdata");
					}.bind(this),
					error: function (e) {},
				  });

			  }, // Fim onChangeWerks

			  onSearch: function (oEvent) {

				// 1. Busca dados de tela
				let oDatePicker = this.getView().byId("idDatePicker");
				let oDatePickerValue = oDatePicker.getDateValue();
	  
				let oWerksComboBox = this.getView().byId("idWerksComboBox");
				let oWerksComboBoxValue = this.getView()
				  .byId("idWerksComboBox")
				  .getSelectedKey();
	  
				let oWorkcenterComboBox = this.getView().byId("idWorkcenterComboBox");
				let oWorkcenterComboBoxValue = this.getView()
				  .byId("idWorkcenterComboBox")
				  .getSelectedKey();

				// 2. Validação de obrigatóriedade dos campos
				// 2.1 Limpa campos de msg de erro
				oDatePicker.setValueState(sap.ui.core.ValueState.None);
				oDatePicker.setValueStateText("");
	  
				oWerksComboBox.setValueState(sap.ui.core.ValueState.None);
				oWerksComboBox.setValueStateText("");
	  
				oWorkcenterComboBox.setValueState(sap.ui.core.ValueState.None);
				oWorkcenterComboBox.setValueStateText("");

				// 2.2 Verifica se campos estão vazios, se sim emite msg de erro
				 let hasError = false;
				if (
					oDatePickerValue === "" ||
					oDatePickerValue === null ||
					oDatePickerValue === undefined
				  ) {
					oDatePicker.setValueState(sap.ui.core.ValueState.Error);
					oDatePicker.setValueStateText("Necessário informar data.");
					hasError = true;
				  }
		
				  if (
					oWerksComboBoxValue === "" ||
					oWerksComboBoxValue === null ||
					oWerksComboBoxValue === undefined
				  ) {
					oWerksComboBox.setValueState(sap.ui.core.ValueState.Error);
					oWerksComboBox.setValueStateText(
					  "Necessário selecionar algum centro."
					);
					hasError = true;
				  }
		
				  if (
					oWorkcenterComboBoxValue === "" ||
					oWorkcenterComboBoxValue === null ||
					oWorkcenterComboBoxValue === undefined
				  ) {
					oWorkcenterComboBox.setValueState(sap.ui.core.ValueState.Error);
					oWorkcenterComboBox.setValueStateText(
					  "Necessário selecionar algum centro de trabalho."
					);
					hasError = true;
				  }

				  // 2.3 Navegação para próximo tela
				  if (!hasError) {
					
                    // Formata data para mandar de parâmetro na rota
					let ano = oDatePickerValue.getFullYear();
		
					let mes =
					  oDatePickerValue.getMonth() + 1 < 10
						? "0" + (oDatePickerValue.getMonth() + 1)
						: oDatePickerValue.getMonth() + 1;
		
					let dia =
					  oDatePickerValue.getDate() < 10
						? "0" + oDatePickerValue.getDate()
						: oDatePickerValue.getDate();
		
					let formattedDate = `${ano}${mes}${dia}`;
		
					let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		
					oRouter.navTo("RouteViewChart", {
					  werks: oWerksComboBoxValue,
					  workcenter: oWorkcenterComboBoxValue,
					  date: formattedDate,
					});
				  } // Fim If ERROR

			  }	// Fim onSearch

		});
	});
