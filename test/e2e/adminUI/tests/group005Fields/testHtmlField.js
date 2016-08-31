var fieldTests = require('./commonFieldTestUtils.js');
var HtmlModelTestConfig = require('../../../modelTestConfig/HtmlModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Html field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Html');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: HtmlModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Html field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Html');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
			}
		})
	},
	'Html field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: HtmlModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Html field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'fieldB': {value: 'Some test html code for field B'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: HtmlModelTestConfig,
			fields: {
				'name': {value: 'Html Field Test 1'},
				'fieldA': {value: 'Some test html code for field A'},
				'fieldB': {value: 'Some test html code for field B'}
			}
		})
	},
};
