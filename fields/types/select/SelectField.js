import Field from '../Field';
import React from 'react';
import Select from 'react-select';
import { FormInput } from '../../../admin/client/App/elemental';

/**
 * TODO:
 * - Custom path support
 */

module.exports = Field.create({

	displayName: 'SelectField',
	statics: {
		type: 'Select',
	},

	valueChanged (newValue) {
		// TODO: This should be natively handled by the Select component
		if (this.props.numeric && typeof newValue === 'string') {
			newValue = newValue ? Number(newValue) : undefined;
		}
		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
	},

	renderValue () {
		const { multi, ops, value } = this.props;
		const findVal = (val) => ops.find(opt => opt.value === val);
		const selected = multi
		? _.join(_.map(value, (item) => findVal(item)), ',')
		: findVal(value);

		return (
			<FormInput noedit>
				{selected ? selected.label : null}
			</FormInput>
		);
	},

	renderField () {
		const { multi, numeric, ops, path, value: val } = this.props;

		// TODO: This should be natively handled by the Select component
		const options = (numeric)
			? ops.map(function (i) {
				return { label: i.label, value: String(i.value) };
			})
			: ops;
		const value = (typeof val === 'number')
			? String(val)
			: (typeof val === Array)
			? _.map(val, (item) => typeof item === 'number' ? String(item) : item)
			: val;

		return (
			<div>
				{/* This input element fools Safari's autocorrect in certain situations that completely break react-select */}
				<input type="text" style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} tabIndex="-1"/>
				<Select
					multi={multi}
					simpleValue
					name={this.getInputName(path)}
					value={value}
					options={options}
					onChange={this.valueChanged}
				/>
			</div>
		);
	},

});
