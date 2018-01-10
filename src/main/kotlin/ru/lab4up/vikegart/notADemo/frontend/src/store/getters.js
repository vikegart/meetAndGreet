export const getCSRF = state => {
    if (state.system.csrf !== null) {
        return state.system.csrf.content
    }
    return "";
};

// export const getCSRF_NAME = state => {
//     if (state.system.csrf_name !== null) {
//         return state.system.csrf_name.content;
//     }
//     return "";
// };
