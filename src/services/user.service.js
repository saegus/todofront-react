let user = null;

const setUser = async u => {
    user = u;
    return user;
};

const getUser = async () => {
    return user;
};

export {
    setUser,
    getUser
}