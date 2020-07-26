import maxios from 'axios';

export type Method = 'POST' | 'GET';

interface Data {
	url: string;
	params: Object;
	method: Method;
}

const instance = maxios.create({
	baseURL: 'http://saoyears.top:7001/',
	timeout: 5000,
	headers: {
		'content-type': 'application/json; charset=UTF-8'
	}
});

const axios = {
	post: function(url: string, params: Object) {
		return this.request({ url, params, method: 'POST' });
	},
	get: function(url: string, params: Object) {
		return this.request({ url, params, method: 'GET' });
	},
	request: function({ url = '', params = {}, method }: Data) {
		return new Promise((resolve, reject) => {
			instance({
				method: method,
				url: url,
				params: params
			})
				.then((res) => {
					const { code = 0, data, msg = '' } = res.data;
					if (code == 1000) {
						resolve(res.data.data);
					} else {
						console.log(res);
						alert(msg);
					}
				})
				.catch((err) => {
					console.log(err);

					// reject(err);
				});
		});
	}
};

export default axios;