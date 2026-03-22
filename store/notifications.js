export const state = () => ({
  list: [],
});

export const mutations = {
  ADD_NOTIFICATION(state, notification) {
    state.list.unshift(notification);
  },
  MARK_READ(state, index) {
    state.list[index].is_read = true;
  },
};

export const actions = {
  add({ commit }, notification) {
    commit("ADD_NOTIFICATION", notification);
  },
};
export const getters = {
  unreadCount(state) {
    return state.list.filter((notif) => !notif.is_read).length;
  },
};