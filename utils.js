let consts = require('constants');

module.exports = {
    generate_flags: function(room, find, prefix, args, set_memory) {
        room = Game.rooms[room];
        if(_.isUndefined(room)) {
            return consts.ERROR_INVALID_ARGS;
        }
        if(_.isUndefined(args)) {
            args = {
                color: COLOR_WHITE,
                secondaryColor: COLOR_WHITE
            }
        }
        let targets = room.find(find);
        if(targets.length == 0) {
            return consts.ERROR_NO_TARGETS;
        }
        for(let i = 0; i < targets.length; i++) {
            let name = `${room.name}${prefix}${i}`;
            let position = targets[i].pos;
            console.log(room.createFlag(position, name, args.color, args.secondaryColor));
            set_memory(Game.flags[name], targets[i]);
        }
        return OK;
    }
}
