import { csrfFetch } from "./csrf";
import { IActionCreator } from "./types/redux";
import { ICredentials, ISignUpUser, IUser, SessionInitialState } from "./types/session";


const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user: IUser) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const thunkAuthenticate = (): any => async (dispatch: any) => {
  try {
    const response = await csrfFetch("/api/restore-user");
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        throw response;
      }
      dispatch(setUser(data));
    } else {
      throw response;
    }
  } catch (e) {
    console.log(e)
  }

};

export const thunkLogin = (credentials: ICredentials): any => async (dispatch: any) => {
  try {
    let credential;


    if(credentials.email){
      credential = credentials.email;
    } else if (credentials.credential){
      credential = credentials.credential
    } else {
      throw Error("Client Error: Invalid credential object")
    };

    const credentialRequest = {
      password: credentials.password,
      credential
    }

    const response = await csrfFetch("/api/session/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentialRequest)
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data, "in thunk")
      dispatch(setUser(data));
      return response;
    } else {
      throw response;
    }
  } catch (e) {
    const err = e as Response;
    const errorMessages = await err.json();
    return errorMessages;
  }

};

export const restoreUser = () => async (dispatch: any) => {
  const response = await csrfFetch('/api/session');
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return response;
  } else {
    throw new Error("Unable to restore user");
  }
};

export const thunkSignup = (user: ISignUpUser): any => async (dispatch: any) => {
  const { firstName, lastName, email, username, password } = user;
  try {
    const response = await csrfFetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        password,
        lastName,
        email,
        username,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data));
  } catch (res: any) {
    if (!res.ok) {
      let errors = await res.json();
      return errors;
    }
  }
};

export const thunkLogout = (): any => async (dispatch: any) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" }
  });
  dispatch(removeUser());
  return response;
};

const initialState: SessionInitialState = { user: null };

function sessionReducer(state = initialState, action: IActionCreator): SessionInitialState {
  let newState = {
    ...state
  };

  switch (action.type) {
    case SET_USER:
      console.log(action.payload, "payload")
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;
