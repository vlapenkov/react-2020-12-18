import { createSelector } from 'reselect';
import { getById } from './utils';

const restaurantsSelector = (state) => state.restaurants.entities;
const orderSelector = (state) => state.order;
const productsSelector = (state) => state.products.entities;
const reviewsSelector = (state) => state.reviews.entities;
const usersSelector = (state) => state.users.entities;
const routerSelector = (state) => state.router;

const currencySelector = (state) => state.currency;

const currencyCourseSelector = createSelector(
  currencySelector,
  (currency) => currency.course
);

export const currencySignSelector = createSelector(
  currencySelector,
  (currency) => currency.sign
);

export const routerSelectorLocation = createSelector(
  routerSelector,
  (x) => x.location.pathname
);
export const restaurantsLoadingSelector = (state) => state.restaurants.loading;
export const restaurantsLoadedSelector = (state) => state.restaurants.loaded;

export const productsLoadingSelector = (state, props) =>
  state.products.loading[props.restaurantId];
export const productsLoadedSelector = (state, props) =>
  state.products.loaded[props.restaurantId];

export const reviewsLoadingSelector = (state, props) =>
  state.reviews.loading[props.restaurantId];
export const reviewsLoadedSelector = (state, props) =>
  state.reviews.loaded[props.restaurantId];

export const usersLoadingSelector = (state) => state.users.loading;
export const usersLoadedSelector = (state) => state.users.loaded;

export const createOrderLoadingSelector = (state) => state.createOrder.loading;
export const createOrderLoadedSelector = (state) => state.createOrder.loaded;
export const errorStatusSelector = (state) => state.createOrder.status;

export const restaurantsListSelector = createSelector(
  restaurantsSelector,
  Object.values
);

export const productAmountSelector = getById(orderSelector, 0);
export const productSelector = getById(productsSelector);
const reviewSelector = getById(reviewsSelector);

const restaurantsIdsByProductsSelector = createSelector(
  restaurantsListSelector,
  (restaurants) =>
    restaurants
      .flatMap((rest) =>
        rest.menu.map((productId) => ({ productId, restId: rest.id }))
      )
      .reduce(
        (acc, { productId, restId }) => ({ ...acc, [productId]: restId }),
        {}
      )
);

export const orderProductsSelector = createSelector(
  productsSelector,
  orderSelector,
  restaurantsIdsByProductsSelector,
  currencyCourseSelector,
  (products, order, restaurantsIds, course) =>
    Object.keys(order)
      .filter((productId) => order[productId] > 0)
      .map((productId) => products[productId])
      .map((product) => ({
        product,
        amount: order[product.id],
        subtotal: order[product.id] * product.price * course,
        restaurantId: restaurantsIds[product.id],
      }))
);

export const totalSelector = createSelector(
  orderProductsSelector,
  (orderProducts) =>
    orderProducts.reduce((acc, { subtotal }) => acc + subtotal, 0)
);

export const reviewWitUserSelector = createSelector(
  reviewSelector,
  usersSelector,
  (review, users) => ({
    ...review,
    user: users[review.userId]?.name,
  })
);

export const averageRatingSelector = createSelector(
  reviewsSelector,
  (_, { restaurant }) => restaurant.reviews,
  (reviews, ids) => {
    const ratings = ids.map((id) => reviews[id]?.rating || 0);
    return Math.round(
      ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
    );
  }
);
