var fieldTests = require('./commonFieldTestUtils.js');
var TextModelTestConfig = require('../../../modelTestConfig/TextModelTestConfig');

module.exports = {
	before: fieldTests.before,
	after: fieldTests.after,
	'Text field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openFieldList('Text');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.initialFormScreen.assertFieldUIVisible({
			modelTestConfig: TextModelTestConfig,
			fields: [{name: 'name'}, {name: 'fieldA'}]
		});
	},
	'restoring test state': function(browser) {
		browser.initialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Text field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openFieldList('Text');
		browser.listScreen.createFirstItem();
		browser.adminUIApp.waitForInitialFormScreen();
		browser.initialFormScreen.fillFieldInputs({
			modelTestConfig: TextModelTestConfig,
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormScreen.assertFieldInputs({
			modelTestConfig: TextModelTestConfig,
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		});
		browser.initialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.itemScreen.assertFieldInputs({
			modelTestConfig: TextModelTestConfig,
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
			}
		})
	},
	'Text field should show correctly in the edit form': function(browser) {
		browser.itemScreen.assertFieldUIVisible({
			modelTestConfig: TextModelTestConfig,
			fields: [{name: 'fieldA'}, {name: 'fieldB'}]
		});
	},
	'Text field can be filled via the edit form': function(browser) {
		browser.itemScreen.fillFieldInputs({
			modelTestConfig: TextModelTestConfig,
			fields: {
				'fieldB': {value: 'Some test text for field B'}
			}
		});
		browser.itemScreen.save();
		browser.adminUIApp.waitForItemScreen();
		browser.itemScreen.assertFlashMessage('Your changes have been saved successfully');
		browser.itemScreen.assertFieldInputs({
			modelTestConfig: TextModelTestConfig,
			fields: {
				'name': {value: 'Text Field Test 1'},
				'fieldA': {value: 'Some test text for field A'},
				'fieldB': {value: 'Some test text for field B'}
			}
		})
	},
};
