import BaseModel from './baseModel';

class HubModel extends BaseModel {
    constructor() {
	super();
	console.log("Hub.constructor()");
    }

    load() {
	return new Promise((resolve, reject) => {
	    jsonp(this.redditURL, {param: 'jsonp'}, (err, data) => {
		err ? reject(err) : resolve(data.data.children)
	    });
	});
    }
}

var Hub = new HubModel();

export default Hub;
