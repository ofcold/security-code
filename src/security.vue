<template>
	<div id="OfcoldSecurityCode">
		<div class="ofcold__security-code clearfix">
			<h2 class="text-center text-xs-center" v-html="title"></h2>
			<div class="ofcold__security-code-description" v-if="description" v-html="description"></div>

			<div class="ofcold__security-code-wrapper mt-3">
				<div class="ofcold__security-code-field" v-for="n in verifyCodeLength">
					<input
						maxlength="1"
						autocorrect="off"
						autocomplete="off"
						autocapitalize="off"
						spellcheck="false"
						type="tel"
						class="form-control"
						v-model="verifyCode[n-1]"
						@focus="setSelected"
						@input.stop="inputEvent"
						@keydown.stop="downEvent"
						@keypress.stop="pressEvent"
						@paste="pasteEvent(n-1, $event)"
					>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		name: 'OfcoldSecurityCode',
		props: {
			value: [Number, String],
			title: {
				type: String,
				default: '验证您的手机号码以创建新Ofcold ID'
			},
			description: String,
			blurOnComplete: {
				type: Boolean,
				default: false
			},
			verifyCodeLength: {
				type: Number,
				default: 6
			}
		},
		data () {
			return {
				verifyCode: new Array(this.verifyCodeLength)
			}
		},
		mounted() {
			if ( this.value !== 0 ) {
				this.verifyCode = this.value.toString().substr(0, this.verifyCodeLength).split('').map((v) => {
					return Number(v);
				});
			}
		},
		methods: {
			inputEvent (event) {
				let value = event.target.value

				if (value.length > 1) {
					event.target.value = value.substr(0, 1)
				}

				this.getVerifyCode().length === this.verifyCodeLength
					 ? (this.blurOnComplete ? event.target.blur() : this.nextElement(event))
					 : event.target.value && this.nextElement(event)
			},
			pasteEvent (index, event) {
				let i
				let pasteData
				let elements = event.target.parentNode.parentNode.childNodes
				let len = 0
				let vm = this
				for (event.clipboardData && event.clipboardData.getData
					 ? pasteData = event.clipboardData.getData('Text')
					 : window.clipboardData && window.clipboardData.getData && (pasteData = window.clipboardData.getData('Text'))
					 , pasteData = pasteData.replace(/\s/g, '').substr(0, elements.length - index).split(''),
					 i = 0; i < elements.length && !isNaN(Number(pasteData[i])); i++) {
					len++
					elements[i + index].firstChild.value = pasteData[i]
					vm.verifyCode[i + index] = pasteData[i]
				}

				return [
					setTimeout(() => {
						vm.getVerifyCode().length === vm.verifyCodeLength
							 ? (
								 vm.blurOnComplete
								 	 ? event.target.blur()
									 : vm.previousElement(event, vm.getVerifyCode().length - 1)
							 )
							 : vm.previousElement(event, index + len)
					 }, 0),
					event.preventDefault(),
					false
				]
			},
			pressEvent (event) {
				let keyCode = event.which || event.keyCode
				return this.isMainKeyCode(keyCode)
				 	 || this.isTab(keyCode)
					 || this.isBackspace(keyCode)
					 || this.isMetaKey(event, keyCode)
					 	 ? void 0
						 : (event.preventDefault(), false)
			},
			downEvent (event) {
				let parentNode = event.target.parentNode
				let keyCode = event.which || event.keyCode
				let _sibling

				if (keyCode === 8 && !event.target.value) {
					_sibling = parentNode.previousSibling
					if (_sibling) {
						_sibling.firstChild.focus()
					}
				} else if (keyCode >= 37 && keyCode <= 41) {
					switch (keyCode) {
						case 37:
						_sibling = parentNode.previousSibling
						break
						case 39:
						_sibling = parentNode.nextSibling
						break
					}
					if (_sibling) {
						_sibling.firstChild.focus()
					}
					return [event.preventDefault(), false]
				}
			},
			previousElement (event, length) {
				let elements = event.target.parentNode.parentNode.childNodes

				if (length >= elements.length) {
					length = elements.length - 1
				}

				elements[length].firstChild.focus()
			},
			nextElement (event) {
				let parentNode = event.target.parentNode
				let nextSibling = parentNode.nextSibling

				nextSibling
					 ? nextSibling.firstChild.focus()
					 : parentNode.focus();

			},
			isMainKeyCode (keyCode) {
				return keyCode >= 48 && keyCode <= 57
			},
			isTab (keyCode) {
				return keyCode === 9
			},
			isBackspace (keyCode) {
				return keyCode === 8
			},
			isMetaKey (event, keyCode) {
				return event.metaKey && keyCode === 118
			},
			setSelected (event) {
				event.target.select()
			},
			getVerifyCode () {
				let c =  this.verifyCode.join('');

				this.$emit('input', Number(c));

				return c;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ofcold__security-code {
		padding: 10px 15px 25px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: auto;
		margin-right: auto;
		max-width: 400px;
		.text {
			max-width: 350px;
			margin-bottom: 10px;
			word-wrap: break-word;
			text-align: center;
		}
		&-icon {
			font-size: 105px;
			text-align: center;
			color: #e1e1e1;
			margin-top: 5px;
		}
		&-description {
			line-height: 1.3;
			font-size: 1.2rem;
			color: #616161;
		}
		&-wrapper {
			display: inline-block;
			margin: auto;
			min-width: 240px;
			text-align: center;
			@media only screen and (max-device-width: 736px) {
				max-width: 320px;
			}
			.ofcold__security-code-field {
				width: 40px;
				display: inline-block;
				margin-right: 10px;
				float: left;
				@media only screen and (max-device-width: 736px) {
					float: none;
					margin-right: 4px;
				}
				.form-control {
					width: 44px;
					height: 44px;
					font-size: 30px;
					text-align: center;
					padding: 0;
					@media only screen and (max-device-width: 736px) {
						width: 42px;
						height: 42px;
						margin: 0;
					}
					&:focus {
						border: 2px solid #0088cc;
					}
				}
				&:nth-child(3) {
					margin-right: 20px;
				}
			}
		}
		@media only screen and (max-device-width: 736px) {
			max-width: none;
			padding-left: 0;
			padding-right: 0;
		}
	}
</style>
