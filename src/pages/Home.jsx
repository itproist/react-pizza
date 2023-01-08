import React, {useContext, useEffect, useState} from "react";
import {setCategoryId, setCurrentPage } from "../redux/slices/filterSlice";
import Sort from '../components/Sort';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Pagination from "../components/Pagination";
import {SearchContext} from "../App";
import {useDispatch, useSelector} from "react-redux";
import {Skeleton} from "../components/PizzaBlock/Skeleton"
import axios from "axios";
const Home = () => {
    const dispatch = useDispatch()
    const {categoryId, sort, currentPage } = useSelector((state) => state.filter)
    const sortType = sort.sort;
    const {searchValue} = useContext(SearchContext);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

        useEffect(() => {
            setIsLoading(true)
            const search = searchValue ? `&search=${searchValue}` : ``;
            axios.get(`https://633975f966857f698fb65c63.mockapi.io/items?page=${currentPage}&limit=4&${categoryId > 0 ? `category=${categoryId}` : ``}&sortBy=${sortType.sort}&order=desc&${search}`)
                .then((res) => {
                setItems(res.data)
                setIsLoading(false)
            })
        }, [categoryId, sortType, searchValue, currentPage]);

    const onClickCategory = (id) => {
        dispatch(setCategoryId(id))
    }

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number))
    }

    return (
        <>
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={onClickCategory} />
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {
                    isLoading ? [...new Array(6)].map((_, index) =>
                        <Skeleton key={index} /> ) : items.map((obj) => <PizzaBlock
                        key={obj.id} {...obj} />
                    )
                }
            </div>
            <Pagination currentPage={currentPage} onChangePage ={onChangePage}/>
        </>
    )
}
export default Home;