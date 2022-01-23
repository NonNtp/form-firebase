import React, { useEffect, useState, useCallback } from 'react'
import ErrorModal from '../UI/ErrorModal'
import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
	const [userIngredients, setUserIngredients] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState()

	useEffect(() => {
		console.log('RERUNNING', userIngredients)
	}, [userIngredients])

	const filterIngredientsHandler = useCallback((filterIngredients) => {
		setUserIngredients(filterIngredients)
	}, [])

	const addIngredientHandler = (ingredient) => {
		setIsLoading(true)
		fetch(
			'https://test-http-78cc0-default-rtdb.firebaseio.com/ingredients.json',
			{
				method: 'POST',
				body: JSON.stringify(ingredient),
				headers: { 'Content-type': 'application/json' },
			}
		)
			.then((response) => {
				setIsLoading(false)
				return response.json()
			})
			.then((responseData) => {
				setUserIngredients((prevState) => [
					...prevState,
					{ id: responseData.name, ...ingredient },
				])
			})
	}

	const removeIngredientHandler = (id) => {
		setIsLoading(true)
		fetch(
			`https://test-http-78cc0-default-rtdb.firebaseio.com/ingredients/${id}.json`,
			{
				method: 'DELETE',
			}
		)
			.then((response) => {
				setIsLoading(false)
				setUserIngredients((prevState) =>
					prevState.filter((ingredient) => ingredient.id !== id)
				)
			})
			.catch((error) => {
				setIsError(error.message)
			})
	}

	const clearError = () => {
		setIsError(null)
		setIsLoading(false)
	}

	return (
		<div className='App'>
			{isError && <ErrorModal onClose={clearError}>{isError}</ErrorModal>}
			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredients={filterIngredientsHandler} />
				{/* Need to add list here! */}
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	)
}

export default Ingredients
