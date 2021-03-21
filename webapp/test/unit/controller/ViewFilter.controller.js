/*global QUnit*/

sap.ui.define([
	"estudo_vizframe_real_cbc/controller/ViewFilter.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ViewFilter Controller");

	QUnit.test("I should test the ViewFilter controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
