export const login = async (username, password) => {
	let data = {
		username,
		password
	}
	
	const formBody = JSON.stringify(data)
	
	let response = await fetch(
		'http://127.0.0.1:8000/api/token/',
		{
			method: 'POST',
            headers: {
                'Content-Type': 'application/json',
			},
			body: formBody
		}
	)
	return await response
}

export const events = async () => {
	// let data = {
	// 	username,
	// 	password
	// }

	// const formBody = JSON.stringify(data)
	
	let response = await fetch(
		'http://127.0.0.1:8000/events/',
		{
			method: 'POST',
            headers: {
                'Content-Type': 'application/json',
			},
			// body: formBody
		}
	)
	return await response
}