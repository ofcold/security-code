# Ofcold Security Code
A powerful security code input supports dynamic configuration of the number of input boxes.

## Features
- Automatic next input box.
- Page initialization automatic countdown.
- The number of custom input boxes.
- Support copy and paste.

## Installation

```bash
	npm install --save ofcold-security-code
```

## Usage

```html
	<!-- Html  -->
	<Sms v-model="code"></Sms>
```

```javascript
	// Javascript
	import Sms from 'ofcold-security-code';

	export default {
		data:() => ({
			code: ''
		}),
		components: {
			Sms
		}
	}
```

## API
| Props | Type | Required|
|-----|-----|-----|
|value|String,Number|true|
|title|String|true|
|description|Stringy|NULL|false|

## Example loading...

![CODE](https://github.com/ofcold/security-code/blob/master/sms.gif?sanitize=true)
