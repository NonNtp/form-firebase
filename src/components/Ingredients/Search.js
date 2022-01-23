import React, { useEffect, useState, useRef } from 'react'
import Card from '../UI/Card'
import './Search.css'

const Search = React.memo((props) => {
	const { onLoadIngredients } = props
	const [enteredFilter, setEnteredFilter] = useState('')
	const inputRef = useRef()

	const filterHandler = (event) => {
		setEnteredFilter(event.target.value)
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			if (enteredFilter === inputRef.current.value) {
				const query =
					enteredFilter.length === 0
						? ''
						: `?orderBy="title"&equalTo="${enteredFilter}"`
				fetch(
					'https://test-http-78cc0-default-rtdb.firebaseio.com/ingredients.json' +
						query
				).then((response) => {
					response.json().then((responseData) => {
						const loadingIngredients = []
						for (const key in responseData) {
							loadingIngredients.push({
								id: key,
								title: responseData[key].title,
								amount: responseData[key].amount,
							})
						}
						onLoadIngredients(loadingIngredients)
					})
				})
			}
		}, 500)
		return () => {
			clearTimeout(timer)
		}
	}, [enteredFilter, onLoadIngredients, inputRef])

	return (
		<section className='search'>
			<Card>
				<div className='search-input'>
					<label>Filter by Title</label>
					<input
						type='text'
						value={enteredFilter}
						onChange={filterHandler}
						ref={inputRef}
					/>
				</div>
			</Card>
		</section>
	)
})

export default Search
