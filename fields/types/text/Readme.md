# Text Field

Stores a `String` in the model.

## Methods

### `crop(length, append, preserveWords)`

Uses the `cropString()` method from [keystone-utils](https://github.com/keystonejs/keystone-utils#conversion-utilities) to crop the value to the specified length.

### `format`

Simply returns the stored string, or an empty string if the value is `undefined`.

_This is the default implementation in `Type`._

### `updateItem`

Updates with the provided value if it is different from the stored value. All types will be coerced to the schema type by mongoose, so `!=` is used to compare with existing values in the item before the new value is set. When `null` is passed, mongoose will remove the path from the stored document and the value will be `undefined` when the item is next retrieved.

_This is the default implementation in `Type`._

### `validateInput`

Ensures the value, if provided, is a string.

Allows `null` to clear the field value.

### `validateRequiredInput`

Ensures a value has been provided. Empty strings are not valid.
