/**
 * Checks if the node is an Element. This is faster than an instanceof check.
 *
 * @param node The node to check.
 *
 * @return Whether or not the node is an Element.
 */
function isElement(node: Node): node is Element {
	return node.nodeType === 1;
}

/**
 * Checks if the node is a text node. This is faster than an instanceof check.
 *
 * @param node The node to check.
 *
 * @return Whether or not the node is a Text.
 */
function isText(node: Node): node is Text {
	return node.nodeType === 3;
}

/**
 * Checks if `keyCod` is a Main.

 * @param  {number}  keyCode
 *
 * @return {boolean}
 */
function isMainKeyCode (keyCode: number): boolean {
	return keyCode >= 48 && keyCode <= 57;
}

/**
 * Checks if `keyCod` is a Tab.
 *
 * @param  {number}  keyCode
 *
 * @return {boolean}
 */
function isTab (keyCode: number): boolean {
	return keyCode === 9;
}

/**
 * Checks if `keyCod` is a Backspace.
 *
 * @param  {number}  keyCode
 *
 * @return {boolean}
 */
function isBackspace (keyCode: number): boolean {
	return keyCode === 8;
}

/**
 * Checks if `keyCod` is a Meta Key.
 *
 * @param  {KeyboardEvent} event
 * @param  {number}        keyCode
 *
 * @return {boolean}
 */
function isMetaKey (event: KeyboardEvent, keyCode: number): boolean {
	return event.metaKey && keyCode === 118;
}

/**
 * Get the Keyboard code.
 *
 * @param  {Event}  e
 *
 * @return {number}
 */
function getKeyCode(e: Event): number {
	return (e as KeyboardEvent).which || (e as KeyboardEvent).keyCode;
}

function siblingFirstChildFoucs(element: HTMLDivElement | null) {
	if (element && isElement(element)) {
		(element.firstChild as HTMLInputElement).focus();
	}
}

export class SecurityCodeDom {
	/**
	 * crated an Dom instance.
	 *
	 * @param {Event} readonly event
	 */
	private constructor(protected readonly event: Event) {
	}

	/**
	 * Return parent element.
	 *
	 * @return HTMLDivElement
	 */
	public parent(): HTMLDivElement {
		return this.target().parentNode as HTMLDivElement;
	}

	public wrapper(): HTMLDivElement {
		return this.parent().parentNode as HTMLDivElement;
	}

	/**
	 * Return childrens element by wrapper.
	 *
	 * @return HTMLCollection
	 */
	public childrens(): HTMLCollection {
		return this.wrapper().children as HTMLCollection;
	}

	/**
	 * Return the input value.

	 * @return {string}
	 */
	public inputValue(): string {
		return this.target().value;
	}

	public target(): HTMLInputElement {
		return this.event.target as HTMLInputElement;
	}

	public preventDefault(): void {
		this.event.preventDefault();
	}

	public firstChildByNode(len: number): HTMLInputElement {
		return (this.childrens()[len] as HTMLDivElement).firstChild as HTMLInputElement;
	}

	public nextElement(): void {
		let nextSibling = this.parent().nextSibling as HTMLDivElement;

		nextSibling && isElement(nextSibling)
			 ? (nextSibling.firstChild as HTMLInputElement).focus()
			 : this.parent().focus();
	}

	public inputEvent (equalLen: boolean, blurOnComplete: boolean): void {
		let val = this.inputValue();

		if (val.length > 1) {
			this.target().value = val.substr(0, 1);
		}

		equalLen
			 ? (blurOnComplete ? this.target().blur() : this.nextElement())
			 : val && this.nextElement();
	}

	public pressEvent() {
		let keyCode: number = getKeyCode(this.event);
		return isMainKeyCode(keyCode) || isTab(keyCode) || isBackspace(keyCode) || isMetaKey(this.event as KeyboardEvent, keyCode)
				 ? void 0
				 : [this.preventDefault(), false];
	}

	public downEvent () {
		let sibling: HTMLDivElement | null = null,
			keyCode: number = getKeyCode(this.event);

		if (isBackspace(keyCode) && ! this.inputValue()) {
			sibling = this.parent().previousElementSibling as HTMLDivElement;

			siblingFirstChildFoucs(sibling);

		} else if (keyCode >= 37 && keyCode <= 41) {
			sibling = {
				37: this.parent().previousElementSibling as HTMLDivElement,
				39: this.parent().nextElementSibling as HTMLDivElement
			}[keyCode] || null;

			siblingFirstChildFoucs(sibling);

			return [this.preventDefault(), false];
		}
	}

	public static make(event: Event) {
		return new SecurityCodeDom(event);
	}
}
