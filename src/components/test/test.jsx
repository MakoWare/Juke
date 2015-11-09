import Hub from '../../models/hub';

class Test extends HTMLElement {
    createdCallback() {
	console.log("Test.createdCallback()");
	console.log(Hub.getIndex());
	console.log(this);
    }
}

document.registerElement('x-test', Test);

