import {API_ACTIONS} from '../../actionTypes';
import {startRequest} from '../../api';
import firebase from 'firebase/index';

export function selectPlace(place) {
  return {
    payload: {place},
    type: API_ACTIONS.SELECT_PLACE
  };
}

export function findPlace(placeToFind) {
  return {
    payload: {placeToFind},
    type: API_ACTIONS.SEARCH_FOR_PLACE
  }
}

export const fetchComments = () => {
  return (dispatch) => {
    firebase.database().ref(`/comments/`)
      .on('value', snapshot => {
        dispatch({type: API_ACTIONS.COMMENT_FETCH_SUCCESS, payload: snapshot.val()});
      });
  };
};

export const fetchRatings = () => {
  return (dispatch) => {
    firebase.database().ref(`/ratings/`)
      .on('value', snapshot => {
        dispatch({type: API_ACTIONS.RATINGS_FETCH_SUCCESS, payload: snapshot.val()});
      });
  };
};

export function fetchGeo() {
  const action = API_ACTIONS.GEOLOCATE;
  const postData = {};
  const attrs = {};
  const params = {key: process.env.MAP_KEY};
  return startRequest({}, action, attrs, params, 'POST', postData);
}

export function createComment(title, description, placeId) {
  const user = firebase.auth().currentUser;
  return (dispatch) => {
    firebase.database().ref(`/comments/`)
      .push({title, content: description, place_id: placeId, user: user.uid})
      .catch((e) => console.log(e));
  };
}

export function removePlace(place) {
  return (dispatch) => {
    firebase.database().ref(`/places/${place.id}`)
      .remove()
      .catch((e) => console.log(e));
  };
}

export function removeComment(comment) {
  return (dispatch) => {
    firebase.database().ref(`/comments/${comment.id}`)
      .remove()
      .catch((e) => console.log(e));
  };
}

export function rate(rating, place) {
  const user = firebase.auth().currentUser;
  if (!user) {
    return {type: 'error'}
  }
  return (dispatch) => {
    firebase.database().ref(`/ratings/${place.id}/${user.uid}`)
      .set(rating)
      .catch((e) => console.log(e));
  };
}