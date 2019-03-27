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

export const parents = async (user, phone_number, address, city, state, zipcode) => {
    let data = {
        user, phone_number, address, city, state, zipcode
    }

    const formBody = JSON.stringify(data)

    let response = await fetch(
		'http://127.0.0.1:8000/parents/',
		{
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    body: formBody
		}
	)
    return response.JSON()
}
export const devices = async (user, registered_by, bus) => {
    let data = {
        user, registered_by, bus
    }

    const formBody = JSON.stringify(data)

    let response = await fetch(
		'http://127.0.0.1:8000/devices/',
		{
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    body: formBody
		}
	)
    return response.JSON()
}
export const students = async (first_name, last_name, age, grade, school, bus, picture, parent_one, parent_two, track) => {
    let data = {
        first_name, last_name, age, grade, school, bus, picture, parent_one, parent_two, track
    }

    const formBody = JSON.stringify(data)

    let response = await fetch(
		'http://127.0.0.1:8000/students/',
		{
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    body: formBody
		}
	)
    return response.JSON()
}
export const buss = async (name) => {
    let data = {
        name
    }

    const formBody = JSON.stringify(data)

    let response = await fetch(
		'http://127.0.0.1:8000/buss/',
		{
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    body: formBody
		}
	)
    return response.JSON()
}
export const drivers = async (bus, first_name, last_name) => {
    let data = {
        bus, first_name, last_name
    }

    const formBody = JSON.stringify(data)

    let response = await fetch(
		'http://127.0.0.1:8000/drivers/',
		{
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    body: formBody
		}
	)
    return response.JSON()
}
export const schools = async (name, address, city, state, zipcode) => {
    let data = {
        name, address, city, state, zipcode
    }

    const formBody = JSON.stringify(data)

    let response = await fetch(
		'http://127.0.0.1:8000/schools/',
		{
		    method: 'POST',
		    headers: {
		        'Content-Type': 'application/json',
		    },
		    body: formBody
		}
	)
    return response.JSON()
}