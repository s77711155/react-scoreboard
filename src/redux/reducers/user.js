export const userReducer = (state='',action) =>{
    switch (action.type) {
        case 'udateUser' :
            return action.payload;
        default:
            return state
    }
    return state
}