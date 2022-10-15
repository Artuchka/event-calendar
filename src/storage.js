export function getItemByStamp(dayId) {
	const data = localStorage.getItem(getStorageName(dayId))
	return JSON.parse(data)
}
export function getItemByStampAndUuid(dayId, uuid) {
	const data = localStorage.getItem(getStorageName(dayId))
	const eventsOnDay = JSON.parse(data)

	const eventDetails = eventsOnDay.filter((event) => event.uuid == uuid)[0]

	return eventDetails
}

export function setItemByStamp(dayId, events) {
	const data = JSON.stringify(events)

	localStorage.setItem(getStorageName(dayId), data)
}

export function addItemByStamp(dayId, newEvent) {
	const events = getItemByStamp(dayId) ?? []
	events.push(newEvent)
	const data = JSON.stringify(events)

	localStorage.setItem(getStorageName(dayId), data)
}

export function updateEventByStamp(dayId, eventDetails) {
	const events = getItemByStamp(dayId) ?? []

	events.forEach((event, index) => {
		if (event.uuid == eventDetails.uuid) {
			events[index] = eventDetails
		}
	})

	const data = JSON.stringify(events)
	localStorage.setItem(getStorageName(dayId), data)
}
export function deleteEventByStampAndUuid(dayId, uuid) {
	let events = getItemByStamp(dayId) ?? []
	events = events.filter((event) => event.uuid != uuid)

	const data = JSON.stringify(events)
	localStorage.setItem(getStorageName(dayId), data)
}

function getStorageName(dayId) {
	return `EVENTS_ON_${dayId}`
}
