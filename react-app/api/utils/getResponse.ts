export async function getResponse<T>(url: string): Promise<T> {
	const res = await fetch(url, {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json; charset=utf-8',
		},
	})

	if (!res.ok) throw new Error('Error occured' + res.statusText)

	return await res.json()
}
