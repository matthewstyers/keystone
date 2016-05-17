var BooleanList = require('./lists/boolean');
var CloudinaryImageList = require('./lists/cloudinaryImage');
var CloudinaryImageMultipleList = require('./lists/cloudinaryImageMultiple');
var CodeList = require('./lists/code');
var ColorList = require('./lists/color');
var DateList = require('./lists/date');
var DateArrayList = require('./lists/dateArray');
var DatetimeList = require('./lists/datetime');
var EmailList = require('./lists/email');
var HtmlList = require('./lists/html');
var KeyList = require('./lists/key');
var LocalFileList = require('./lists/localFile');
var LocalFileMultipleList = require('./lists/localFileMultiple');
var LocationList = require('./lists/location');
var MarkdownList = require('./lists/markdown');
var MoneyList = require('./lists/money');
var NameList = require('./lists/name');
var NumberList = require('./lists/number');
var PasswordList = require('./lists/password');
var SelectList = require('./lists/select');
var TextList = require('./lists/text');
var TextareaList = require('./lists/textarea');
var UrlList = require('./lists/url');
var UserList = require('./lists/user');

module.exports = {
	sections: {
		form: {
			selector: '.Modal-dialog',
			sections: {
				//
				// DEFINE ALL LISTS
				//
				booleanList: new BooleanList(),
				cloudinaryimageList: new CloudinaryImageList(),
				cloudinaryimagemultipleList: new CloudinaryImageMultipleList(),
				codeList: new CodeList(),
				colorList: new ColorList(),
				dateList: new DateList(),
				datearrayList: new DateArrayList(),
				datetimeList: new DatetimeList(),
				htmlList: new HtmlList(),
				emailList: new EmailList(),
				keyList: new KeyList(),
				localfileList: new LocalFileList(),
				localfilemultipleList: new LocalFileMultipleList(),
				locationList: new LocationList(),
				markdownList: new MarkdownList(),
				moneyList: new MoneyList(),
				nameList: new NameList(),
				numberList: new NumberList(),
				passwordList: new PasswordList(),
				selectList: new SelectList(),
				textList: new TextList(),
				textareaList: new TextareaList(),
				urlList: new UrlList(),
				userList: new UserList(),
			},
			elements: {
				//
				// FORM LEVEL ELEMENTS
				//
				createButton: 'button[class="Button Button--success"]',
				cancelButton: 'button[class="Button Button--link-cancel"]',
			},
			commands: [{
				//
				// FORM LEVEL COMMANDS
				//
			}],
		},
	},
	elements: {
		//
		// PAGE LEVEL ELEMENTS
		//
		flashError: '.Alert--danger'
	},
	commands: [{
		//
		// PAGE LEVEL COMMANDS
		//
		assertFlashError: function (message) {
			return this.expect.element('@flashError')
				.text.to.equal(message);
		},
		assertUI: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			config.fields.forEach( function(field) {
				var task = form.section[list].section[field].assertUI(config.args);
				tasks.push(task);
			});
			return tasks;
		},
		cancel: function (config) {
			return this.section.form
				.click('@cancelButton');
		},
		fillInputs: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			var fields = Object.keys(config.fields);
			fields.forEach( function(field) {
				var task = form.section[list].section[field]
					.fillInput(config.fields[field]);
				tasks.push(task);
			});
			return tasks;
		},
		save: function() {
			return this.section.form
				.click('@createButton');
		},
		assertInputs: function (config) {
			var list = config.listName.toLowerCase() + 'List';
			var tasks = [];
			var form = this.section.form;
			var fields = Object.keys(config.fields);
			fields.forEach( function(field) {
				var task = form.section[list].section[field]
					.assertInput(config.fields[field]);
				tasks.push(task);
			});
			return tasks;
		},
	}],
};
