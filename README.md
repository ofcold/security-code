# Ofcold Security Code
A powerful security code input supports dynamic configuration of the number of input boxes.

## Features
- Automatic next input box.
- Page initialization automatic countdown.
- The number of custom input boxes.
- Support copy and paste.
- Support tailwindcss by version >=2.0.0

## Installation

```bash
npm install --save @ofcold/security-code

// OR

yarn add @ofcold/security-code
```

## Usage

```html
<!-- Html  -->
<input-code v-model="code"/>
```


#### VUE 2.0 And 3.0
```javascript
// Javascript
import InputCode from '@ofcold/security-code';

export default {
	data:() => ({
		code: ''
	}),
	components: {
		InputCode
	}
}

// OR ...
import {defineComponent, ref} from 'vue'
import InputCode from '@ofcold/security-code'

export default defineComponent({
	components: {
		InputCode
	},
	setup(props, ctx) {
		const code = ref('')

		return {
			code
		}
	}
})
```

## API
- `isArray` Deprecated version 2.x please use `returnArray`.
- `returnArray` boolean default false The return data type.
- `val` string|array default ''.
- `len` The code length default `6`.
- `size` The input size default `md` The options are `small`, `default`, `lg`, `xl`.

## Example loading...

![CODE](https://github.com/ofcold/security-code/blob/master/sms.gif?sanitize=true)
