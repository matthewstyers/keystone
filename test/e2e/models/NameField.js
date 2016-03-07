var keystone = require('../../../index.js');
var Types = keystone.Field.Types;

var NameField = new keystone.List('NameField', {
    autokey: { path: 'key', from: 'name', unique: true },
    track: true
});

NameField.add({
    name: { type: Types.Name, required: true, index: true },
});

NameField.defaultColumns = 'name';
NameField.register();

module.exports = NameField;
