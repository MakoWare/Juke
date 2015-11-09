class BaseModel {
    constructor() {
	this.index = 3;
    }

    sayHi() {
	console.log("hi");
    }

    getIndex(){
	return this.index++;
    }
}


export default BaseModel;
