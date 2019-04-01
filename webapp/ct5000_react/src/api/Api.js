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

export const refresh = async () => {

    const formBody = JSON.stringify({ "refresh": localStorage.getItem('refresh') })

    let response = await fetch(
        'http://127.0.0.1:8000/api/token/refresh/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formBody
        }
    )
    return await response.json()
}

export const current_user = async () => {
    let response = await fetch(
        'http://127.0.0.1:8000/users/current/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
            }
        }
    )
    return await response.json()
}

export const get_parents = async () => {
    let response = await fetch(
        'http://127.0.0.1:8000/parents/',
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
            }
        }
    )
    return await response.json()
}

export const get_parent = async (parent_id) => {
    let response = await fetch(
        '/parents/' + parent_id,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
            }
        }
    )
    return await response.json()
}

export const get_students_by_parent = async (parent_id) => {
    let response = await fetch(
        'http://127.0.0.1:8000/parents/' + parent_id + '/students/',
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
            }
        }
    )
    return await response.json()
}

export const get_students_by_current_parent = async () => {
    let response = await fetch(
        'http://127.0.0.1:8000/parents/students/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
            }
        }
    )
    return await response.json()
}

export const get_admins = async () => {
    let response = await fetch(
        'http://127.0.0.1:8000/users/admins/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
            }
        }
    )
    return await response.json()
}

export const get_students = async () => {
    let response = await fetch(
        '/students/',
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_student = async (student_id) => {
    let response = await fetch(
        '/students/' + student_id,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_events_by_student = async (student_id) => {
    let response = await fetch(
        'http://127.0.0.1:8000/students/' + student_id + '/events/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
            }
        }
    )
    return await response.json()
}

export const get_events = async () => {
    let response = await fetch(
        'http://127.0.0.1:8000/events/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access'),
            }
        }
    )
    return await response.json()
}

export const get_event = async (event_id) => {
    let response = await fetch(
        '/events/' + event_id,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_devices = async () => {
    let response = await fetch(
        '/devices/',
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_device = async (device_id) => {
    let response = await fetch(
        '/devices/' + device_id,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_buses = async () => {
    let response = await fetch(
        '/buses/',
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_bus = async (bus_id) => {
    let response = await fetch(
        '/buses/' + bus_id,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_schools = async () => {
    let response = await fetch(
        '/schools/',
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_school = async (school_id) => {
    let response = await fetch(
        '/schools/' + school_id,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_drivers = async () => {
    let response = await fetch(
        '/drivers/',
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
}

export const get_driver = async (driver_id) => {
    let response = await fetch(
        '/drivers/' + driver_id,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }
    )
    return await response.json()
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