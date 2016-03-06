/*!
 * Module dependencies.
 */

var fs = require('fs-extra');
var fsNative = require('fs');
var path = require('path');
var _ = require('lodash');
var Grid = require('gridfs-stream');
var grappling = require('grappling-hook');
var keystone = require('../../../');
var moment = require('moment');
var mongoose = keystone.mongoose;
var util = require('util');
var utils = require('keystone-utils');
var super_ = require('../Type');
var gridfs;

var connection = mongoose.connection;

connection.once('open', function() {
		console.log('mongo connection open, motherfucker.');
		Grid.mongo = mongoose.mongo;
		gridfs = new Grid(connection.db);
});

/**
 * largefile FieldType Constructor
 * @extends Field
 * @api public
 */

function largefile(list, path, options) {

	grappling.mixin(this)
		.allowHooks('move');
	this._underscoreMethods = ['format', 'uploadFile'];
	this._fixedSize = 'full';

	// TODO: implement filtering, usage disabled for now
	options.nofilter = true;

	// TODO: implement initial form, usage disabled for now
	if (options.initial) {
		throw new Error('Invalid Configuration\n\n' + 'largefile fields (' + list.key +
			'.' + path + ') do not currently support being used as initial fields.\n');
	}

	if (options.overwrite !== false) {
		options.overwrite = true;
	}

	largefile.super_.call(this, list, path, options);

	// Allow hook into before and after
	if (options.pre && options.pre.move) {
		this.pre('move', options.pre.move);
	}

	if (options.post && options.post.move) {
		this.post('move', options.post.move);
	}

}

/*!
 * Inherit from Field
 */

util.inherits(largefile, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

largefile.prototype.addToSchema = function() {
	var field = this;
	var schema = this.list.schema;

	var paths = this.paths = {
		// fields
		filename: this._path.append('.filename'),
		originalname: this._path.append('.originalname'),
		gridId: this._path.append('.gridId'),
		size: this._path.append('.size'),
		filetype: this._path.append('.filetype'),
		// virtuals
		exists: this._path.append('.exists'),
		href: this._path.append('.href'),
		upload: this._path.append('_upload'),
		action: this._path.append('_action'),
	};

	var schemaPaths = this._path.addTo({}, {
		filename: String,
		originalname: String,
		size: Number,
		filetype: String,
	});
	schema.add(schemaPaths);

	// exists checks for a matching file at run-time
	var exists = function(item) {
		gridfs.exist({
			_id: item.gridId
		}, function(err, found) {
			if (err) {
				console.log(err);
				return false;
			}
			else {
				if (found) {
					console.log('File exists');
					return true;
				}
				else {
					console.log('File does not exist');
					return false;
				}
			}
		});
	};

	// reset clears the value of the field
	var reset = function(item) {
		item.set(field.gridId, {
			filename: '',
			gridId: '',
			size: 0,
			filetype: '',
		});
	};

	var schemaMethods = {
		exists: function() {
			return exists(this);
		},
		/**
		 * Resets the value of the field
		 *
		 * @api public
		 */
		reset: function() {
			reset(this);
		},
		/**
		 * Deletes the file from largefile and resets the field
		 *
		 * @api public
		 */
		delete: function() {
			if (exists(this)) {
				gridfs.remove({
				_id: this.gridId
			}, function(err) {
				if (err) return err;
				console.log('success');
			});

			}
			reset(this);
		},
	};




	// The .exists virtual indicates whether a file is stored
	schema.virtual(paths.exists)
		.get(function() {
			return schemaMethods.exists.apply(this);
		});

	// The .href virtual returns the public path of the file
	schema.virtual(paths.href)
		.get(function() {
			return field.href(this);
		});

	_.forEach(schemaMethods, function(fn, key) {
		field.underscoreMethod(key, fn);
	});

	// expose a method on the field to call schema methods
	this.apply = function(item, method) {
		return schemaMethods[method].apply(item, Array.prototype.slice.call(
			arguments, 2));
	};

	this.bindUnderscoreMethods();
};


/**
 * Formats the field value
 *
 * Delegates to the options.format function if it exists.
 * @api public
 */

largefile.prototype.format = function(item) {
	if (!item.get(this.paths.filename)) return '';
	if (this.hasFormatter()) {
		var file = item.get(this.gridId);
		file.href = this.href(item);
		return this.options.format.call(this, item, file);
	}
	return this.href(item);
};


/**
 * Detects whether the field has formatter function
 *
 * @api public
 */

largefile.prototype.hasFormatter = function() {
	return typeof this.options.format === 'function';
};


/**
 * Return the public href for the stored file
 *
 * @api public
 */

largefile.prototype.href = function(item) {
	if (!item.get(this.paths.filename)) return '';
	var prefix = this.options.prefix ? this.options.prefix : item.get(this.paths
		.gridId);
	return prefix + '/' + item.get(this.paths.filename);
};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

largefile.prototype.isModified = function(item) {
	return item.isModified(this.paths.gridId);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */

largefile.prototype.inputIsValid = function(data) { // eslint-disable-line no-unused-vars
	// TODO - how should file field input be validated?
	return true;
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

largefile.prototype.updateItem = function(item, data, callback) { // eslint-disable-line no-unused-vars
	// TODO - direct updating of data (not via upload)
	process.nextTick(callback);
};


/**
 * Uploads the file for this field
 *
 * @api public
 */

largefile.prototype.uploadFile = function(item, file, update, callback) {
	console.log('uploadFile started');
	var field = this;
	var prefix = field.options.datePrefix ? moment()
		.format(field.options.datePrefix) + '-' : '';
	var filename = prefix + file.name;
	var filetype = file.mimetype || file.type;
	if (field.options.allowedTypes && !_.contains(field.options.allowedTypes,
			filetype)) {
		return callback(new Error('Unsupported File Type: ' + filetype));
	}

	if (typeof update === 'function') {
		callback = update;
		update = false;
	}

	var doMove = function(callback) {
		console.log('doMove triggered');
		if (typeof field.options.filename === 'function') {
			filename = field.options.filename(item, file);
		}

		var writestream = gridfs.createWriteStream({
			filename: filename
		});
		fsNative.createReadStream(file.path)
			.pipe(writestream);

		writestream.on('close', function(gridFile) {

			// if (err) return callback(err);
			console.log(gridFile);

			var fileData = {
				gridId: gridFile._id,
				filename: filename,
				originalname: file.originalname,
				size: gridFile.size,
				filetype: filetype,
			};

			if (update) {
				item.set(field.gridId, fileData);
			}

			callback(null, fileData);

		});
	};

	field.callHook('pre:move', item, file, function(err) {
		if (err) return callback(err);
		doMove(function(err, fileData) {
			if (err) return callback(err);
			field.callHook('post:move', [item, file, fileData], function(err) {
				if (err) return callback(err);
				callback(null, fileData);
			});
		});
	});
};


/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Expected form parts are
 * - `field.paths.action` in `req.body` (`clear` or `delete`)
 * - `field.paths.upload` in `req.files` (uploads the file to largefile)
 *
 * @api public
 */

largefile.prototype.getRequestHandler = function(item, req, paths, callback) {
	console.log('balls');
	var field = this;

	if (utils.isFunction(paths)) {
		callback = paths;
		paths = field.paths;
	}
	else if (!paths) {
		paths = field.paths;
	}

	callback = callback || function() {};

	return function() {

		if (req.body) {
			var action = req.body[paths.action];

			if (/^(delete|reset)$/.test(action)) {
				field.apply(item, action);
			}
		}

		if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {
			console.log('getRequestHandler passed');
			return field.uploadFile(item, req.files[paths.upload], true, callback);

		}
		else {
			console.log('getRequestHandler failed');
		}

		return callback();

	};

};

/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 *
 * @api public
 */

largefile.prototype.handleRequest = function(item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
};


/*!
 * Export class
 */

module.exports = largefile;
