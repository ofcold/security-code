<template>
	<div id="securityCode">
		<div class="verify-code clearfix">
			<div class="text">
				<i class="verify-code-icon icon-mail"></i>
				<h2 class="verify-code-title" v-html="title"></h2>
				<div v-if="errors" class="text-danger">
					<small v-for="e in errors">{{ e }}</small><br>
				</div>
				<div class="verify-code-description">
					一条包含验证码的手机短信已发送至 <span class="mobile">{{ hiddrenTelphone }}</span>请在此处输入验证码:
				</div>
			</div>
			<div class="verify-code-wrapper">
				<div class="verify-code-field" v-for="n in verifyCodeLength">
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
			
			<div class="text-xs-center">
				没有收到手机短信？
				<button :disabled="disabled" class="btn btn-link" @click="reSendSmsCode">{{ reText }}</button>
			</div>

			<div class="text-xs-center">
				<button :disabled="getVerifyCode.length != 6" class="btn btn-link text-info display-4" @click="onActivatorAccount">
					激活
				</button>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		name: 'AnomalyFieldSms',
		props: {
			title: {
				type: String,
				default: '验证您的手机号码以创建新Ofcold ID'
			},
			telphone: {
				type: String,
				default: '+86 188 **** **43'
			},
			hiddrenTelphone: {
				type: String,
				default: ''
			},
			resendUrl: {
				type: String,
				default: '/activator/resend'
			},
			expiration: {
				type: Number,
				default: 120
			},
			accountActivatorUrl: {
				type: String,
				default: '/account/activeator'
			},
			verifyCodeLength: {
				type: Number,
				default: 6
			},
			blurOnComplete: {
				type: Boolean,
				default: false
			},
			start: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				verifyCode: new Array(this.verifyCodeLength),
				errors: [],
				reText: '获取验证码',
				disabled: true
			}
		},
		created() {
			if ( this.start )
			{
				this.countDown();
			}
		},
		methods: {
			inputEvent (event) {
				var value = event.target.value
				if (value.length > 1) {
					event.target.value = value.substr(0, 1)
				}
				this.getVerifyCode().length === this.verifyCodeLength
				? (this.blurOnComplete ? event.target.blur() : this.nextElement(event))
				: event.target.value && this.nextElement(event)
			},
			pasteEvent (index, event) {
				var i
				var pasteData
				var elements = event.target.parentNode.parentNode.childNodes
				var len = 0
				var vm = this
				for (event.clipboardData && event.clipboardData.getData
					 ? pasteData = event.clipboardData.getData('Text')
					 : window.clipboardData && window.clipboardData.getData && (pasteData = window.clipboardData.getData('Text'))
					 , pasteData = pasteData.replace(/\s/g, '').substr(0, elements.length - index).split(''),
					 i = 0; i < elements.length && !isNaN(parseInt(pasteData[i])); i++) {
					len++
					elements[i + index].firstChild.value = pasteData[i]
					vm.verifyCode[i + index] = pasteData[i]
				}

				return [setTimeout(function () {
					vm.getVerifyCode().length === vm.verifyCodeLength
						? (vm.blurOnComplete ? event.target.blur() : vm.previousElement(event, vm.getVerifyCode().length - 1))
						: vm.previousElement(event, index + len)
				}, 0), event.preventDefault(), false]
			},
			pressEvent (event) {
				var keyCode = event.which || event.keyCode
				return this.isMainKeyCode(keyCode) || this.isTab(keyCode) || this.isBackspace(keyCode) || this.isMetaKey(event, keyCode) ? void 0 : (event.preventDefault(), false)
			},
			downEvent (event) {
				var parentNode = event.target.parentNode
				var keyCode = event.which || event.keyCode
				var _sibling

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
				var elements = event.target.parentNode.parentNode.childNodes
				if (length >= elements.length) {
					length = elements.length - 1
				}
				elements[length].firstChild.focus()
			},
			nextElement (event) {
				var parentNode = event.target.parentNode
				var nextSibling = parentNode.nextSibling
				if (nextSibling) {
					nextSibling.firstChild.focus()
				} else {
				parentNode.focus()
				}
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
				return this.verifyCode.join('')
			},
			reSendSmsCode() {
				axios.post(this.resendUrl, {
					mobile: this.telphone
				})
				.then(response => {

				})
				.catch(errors => {
					this.errors = errors.response.data;
				});

				this.countDown();
			},
			countDown() {
				let time = setInterval(()=>{
	                this.expiration --
	                if( this.expiration == 0 )
	                {
						this.reText = '获取验证码';
						this.expiration = 120;
						this.disabled = false;
						clearInterval(time);
	                }
	                else
	                {
	                	this.reText = this.expiration + ' S';
	                }
	            }, 1000);
			},
			onActivatorAccount() {
				axios.post(this.accountActivatorUrl, {
					code: this.getVerifyCode(),
					mobile: this.telphone
				})
				.then(response => {
					if ( response.data.redirect ) {
						alert(response.data.messages);
						window.location = response.data.redirect;
					}
				})
				.catch(errors => {
					this.errors = errors.response.data;
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.verify-code {
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
		.btn-link {
			font-size: 16px;
		}
		&-icon {
			font-size: 105px;
			text-align: center;
			color: #e1e1e1;
			margin-top: 5px;
		}
		&-title {
			font-size: 29px;
			line-height: 1.1;
			margin-bottom: 15px;
			margin-top: 5px;
			width: 100%;
		}
		&-description {
			line-height: 1.3;
			font-size: 17px;
			.mobile {
				white-space: normal;
				word-wrap: break-word;
				font-weight: 600;
				font-size: 20px;
			}
		}
		&-wrapper {
			display: inline-block;
			margin: auto;
			min-width: 240px;
			text-align: center;
			@media only screen and (max-device-width: 736px) {
				max-width: 320px;
			}
			.verify-code-field {
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
			.btn-link {
				font-size: 14px;
			}
			&-icon, &-title {
				display: none;
			}
		}
	}
</style>
