<template>
	<div class="flex flex-direction ml-auto mr-auto">
		<div class="flex justify-center m-auto">
			<div class="inline-block mr-4"
				 :class="data.sizes[size]"
				 v-for="(n, i) in len"
				 :task-id="`ofcold-security-task-code-id-${i}`">
				<input
					maxlength="1"
					autocorrect="off"
					autocomplete="off"
					autocapitalize="off"
					spellcheck="false"
					type="text"
					class="focus:outline-none border text-center w-full h-full rounded"
					v-model="data.securityCode[n-1]"
					@focus="setSelected"
					@input.stop="inputEvent"
					@keydown.stop="downEvent"
					@keypress.stop="pressEvent"
					@paste="pasteEvent(n-1, $event)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent, reactive, onMounted} from 'vue'
import {
	previousElement,
	nextElement,
	isMainKeyCode,
	isTab,
	isBackspace,
	isMetaKey,
	getClipboardData,
} from './SecurityCodeHelpers'

export default defineComponent({
	name: 'ofcold-security-code',
	props: {
		val: {
			type: String,
			default: null
		},
		blurOnComplete: {
			type: Boolean,
			default: false
		},
		len: {
			type: Number,
			default: 6
		},
		isArray: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'default'
		}
	},
	setup({val, blurOnComplete, len, isArray, size}, {emit}) {
		const data = reactive({
			securityCode: new Array(len),
			sizes: {
				small: 'w-8 h-8',
				default: 'w-12 h-12 text-xl',
				lg: 'w-16 h-16 text-3xl',
				xl: 'w-20 h-20 text-4xl'
			}
		});

		onMounted(() => {
			if (val) {
				data.securityCode = val instanceof Array
					 ? val
					 : val.toString().substr(0, len).split('')
			}
		});

		function inputEvent (event)  {
			let value = event.target.value

			if (value.length > 1) {
				event.target.value = value.substr(0, 1)
			}

			getCodeString().length === len
				 ? (blurOnComplete ? event.target.blur() : nextElement(event))
				 : event.target.value && nextElement(event)
		}

		function pasteEvent (idx, event) {
			let i,
				elements = event.target.parentNode.parentNode.children,
				length = 0
			const pasteData = getClipboardData(event, len)
			for (i = 0; i < elements.length; i++) {
				length++;
				elements[i + idx].firstChild.value = pasteData[i];
				data.securityCode[i + idx] = pasteData[i];
			}

			return [
				setTimeout(() => {
					getCodeString().length === len
						 ? (
							 blurOnComplete
								 ? event.target.blur()
								 : previousElement(event, getCodeString().length - 1)
						 )
						 : previousElement(event, idx)
				}, 0),
				event.preventDefault(),
				false
			]
		}

		function pressEvent (event) {
			let keyCode = event.which || event.keyCode
			return isMainKeyCode(keyCode)
				 || isTab(keyCode)
				 || isBackspace(keyCode)
				 || isMetaKey(event, keyCode)
					 ? void 0
					 : (event.preventDefault(), false)
		}
		function downEvent (event)  {
			let parentNode = event.target.parentNode;
			let keyCode = event.which || event.keyCode;
			let _sibling;

			if (keyCode === 8 && !event.target.value) {
				_sibling = parentNode.previousElementSibling;
				if (_sibling && _sibling.nodeType === 1) {
					_sibling.firstChild.focus();
				}
			} else if (keyCode >= 37 && keyCode <= 41) {
				switch (keyCode) {
					case 37:
						_sibling = parentNode.previousElementSibling;
					break
					case 39:
						_sibling = parentNode.nextElementSibling;
					break
				}
				if (_sibling) {
					_sibling.firstChild.focus();
				}
				return [event.preventDefault(), false];
			}
		}

		function setSelected (event)  {
			event.target.select();
		}

		function getCodeString ()  {
			let code = isArray ? data.securityCode : data.securityCode.join('');
			emit('update:modelValue', code);
			return code;
		}

		return {data, setSelected, inputEvent, pasteEvent, pressEvent, downEvent, getCodeString}
	},
})
</script>
