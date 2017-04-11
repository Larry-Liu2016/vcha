class Users {
    constructor(){
        this.users = [];
    };
    addUser(id,name,room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    };

    removeUser(id) {
        var user = this.getUser(id);
        this.users = this.users.filter((user)=> user.id !== id);
        return user;
    }
    
    getUser(id) {
        return this.users.filter((user) => user.id===id)[0];
    }

    getList(room){
        var users = this.users.filter((user) => user.room===room);
        var nameList = users.map((user) => user.name);
        return nameList;
    }
}

module.exports = {Users};

