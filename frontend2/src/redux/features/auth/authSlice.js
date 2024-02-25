import { createSlice } from "@reduxjs/toolkit";

// Parse the name from localStorage or default to an empty string
let name = "";
try {
  const storedName = localStorage.getItem("name");
  if (storedName !== null) {
    name = JSON.parse(storedName);
  }
} catch (error) {
  console.error("Error parsing 'name' from localStorage:", error);
}

const initialState = {
  isLoggedIn: false,
  name: name !== undefined ? name : "", // Default to an empty string if undefined
  user: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN(state, action) {
      state.isLoggedIn = action.payload;
    },
    SET_NAME(state, action) {
      try {
        localStorage.setItem("name", JSON.stringify(action.payload));
        state.name = action.payload;
      } catch (error) {
        console.error("Error saving 'name' to localStorage:", error);
      }
    },
    SET_USER(state, action) {
      const profile = action.payload;
      state.user.name = profile.name;
      state.user.email = profile.email;
      state.user.phone = profile.phone;
      state.user.bio = profile.bio;
      state.user.photo = profile.photo;
    },
  },
});

export const { SET_LOGIN, SET_NAME, SET_USER } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;

